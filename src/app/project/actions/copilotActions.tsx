"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasAccess } from "@/lib/user/projectAccess";
import ClientMessage from "../_types/clientMessage";
import { openai } from "@/lib/openai";
import { generateId } from "ai";
import {
  createStreamableUI,
  createStreamableValue,
  StreamableValue,
} from "ai/rsc";
import prismaDB from "@/lib/db/prisma";
import { Message } from "../_components/message";

export async function submitMessage(
  messageId: string,
  question: string,
  threadId: string | null,
  projectId: string,
  assistantId: string,
  modelName: string | null,
): Promise<{
  message: ClientMessage;
  threadId: string;
  streamStatus: StreamableValue<"pending" | "completed", any>;
}> {
  const textStream = createStreamableValue("");
  const statusStream = createStreamableValue("Thinking...");
  const streamStatus = createStreamableValue<"pending" | "completed">(
    "pending",
  );
  const textUIStream = createStreamableUI(
    <Message textStream={textStream.value} statusStream={statusStream.value} />,
  );

  const runQueue: any = [];
  let newThreadId = threadId ?? "";
  if (threadId) {
    await handleExistingThread(threadId, assistantId, question, modelName, runQueue);
  } else {
    newThreadId = await handleNewThread(
      projectId,
      assistantId,
      question,
      modelName,
      runQueue,
    );
  }

  (async () => {
    await processRunQueue(runQueue, textStream, statusStream);
    textStream.done();
    statusStream.done();
    textUIStream.done();
    streamStatus.done("completed");
  })();

  return {
    message: {
      id: messageId,
      text: textUIStream.value,
      role: "assistant",
    },
    threadId: newThreadId,
    streamStatus: streamStatus.value,
  };
}

export async function searchConversationHistory(
  projectId: string,
  query: string,
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }
  const userId = session.user.id ?? "";

  const conversations = await prismaDB.copilotThread.findMany({
    where: {
      projectId: projectId,
      userId: userId,
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return conversations;
}

export async function cancelRuns(threadId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }

  const { data: runs } = await openai.beta.threads.runs.list(threadId);

  for (const run of runs) {
    if (run.status === "in_progress") {
      await openai.beta.threads.runs.cancel(threadId, run.id);
    }
  }
}

export async function conversationMessages(
  conversationId: string,
): Promise<{ messages: ClientMessage[]; threadId: string }> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }
  const userId = session.user.id ?? "";

  // Check if conversation belongs to this user
  const converstation = await prismaDB.copilotThread.findFirst({
    where: {
      userId: userId,
      id: conversationId,
    },
  });

  if (!converstation) {
    throw Error("You don't belong to this conversation!.");
  }

  const threadMessages = await openai.beta.threads.messages.list(
    converstation.threadId,
    { order: "asc" },
  );

  const messages = threadMessages.data.map((message) => {
    let textContent = "";
    message.content.forEach((part: any) => {
      if (part.type === "text" && part.text) {
        textContent = (textContent + part.text.value) as string;
      }
    });

    const textStream = createStreamableValue(textContent);
    const statusStream = createStreamableValue("");
    const textUIStream = createStreamableUI(
      <Message
        textStream={textStream.value}
        statusStream={statusStream.value}
      />,
    );

    textStream.done();
    statusStream.done();
    textUIStream.done();
    return {
      id: message.id,
      text: textUIStream.value,
      role: message.role,
    };
  });

  return { messages: messages, threadId: converstation.threadId };
}

function getEventStatus(event: string) {
  switch (event) {
    case "thread.run.completed":
    case "thread.message.delta":
    case "thread.message.incomplete":
    case "thread.message.completed":
    case "thread.run.step.completed":
      return "";

    case "thread.run.cancelling":
      return "Cancelling...";

    case "thread.run.cancelled":
    case "thread.run.step.cancelled":
      return "Cancelled";

    default:
      return "Thinking...";
  }
}

async function handleExistingThread(
  threadId: string,
  assistantId: string,
  question: string,
  modelName: string | null,
  runQueue: any[],
) {
  const message = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: question,
  });

  const run = await openai.beta.threads.runs.create(message.thread_id, {
    assistant_id: assistantId,
    stream: true,
    model: modelName,
  });

  runQueue.push({ id: generateId(), run });
}

async function handleNewThread(
  projectId: string,
  assistantId: string,
  question: string,
  modelName: string | null,
  runQueue: any[],
) {
  const userId = await authenticateAndAuthorize(projectId);
  const thread = await openai.beta.threads.create();
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: question,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId,
    stream: true,
    model: modelName,
  });

  runQueue.push({ id: generateId(), run });

  await prismaDB.copilotThread.create({
    data: {
      projectId: projectId,
      threadId: thread.id,
      title: question.slice(0, 40),
      userId: userId,
    },
  });

  return thread.id;
}

async function authenticateAndAuthorize(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error(
      "Operation is not allowed; you need to authenticate first.",
    );
  }

  const project = await prismaDB.project.findFirst({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Cannot find project with the provided id.");
  }

  const hasCopilotCreateAccess = hasAccess({
    projectId,
    scope: "copilot:create",
    session,
  });

  if (!hasCopilotCreateAccess) {
    throw new Error("Operation is not allowed; you don't have authorization.");
  }

  return session.user.id;
}

async function processRunQueue(
  runQueue: any[],
  textStream: any,
  statusStream: any,
) {
  while (runQueue.length > 0) {
    const latestRun = runQueue.shift();

    if (latestRun) {
      for await (const delta of latestRun.run) {
        processDeltaEvent(delta, textStream, statusStream);
      }
    }
  }
}

function processDeltaEvent(delta: any, textStream: any, statusStream: any) {
  const { data, event } = delta;
  const eventStatus = getEventStatus(event);
  statusStream.update(eventStatus);

  switch (event) {
    case "thread.created":
      break;

    case "thread.run.created":
      break;
    case "thread.message.delta":
      data.delta.content?.forEach((part: any) => {
        if (part.type === "text" && part.text) {
          textStream.append(part.text.value as string);
        }
      });
      break;
    case "thread.run.failed":
      console.error(data);
      throw new Error(data.last_error?.message);
    default:
      break;
  }
}
