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
const ASSISTANT_ID = "asst_qG4fERbGdCCSMcunLCIf3QE0";

export async function submitMessage(
  question: string,
  threadId: string | null,
  projectId: string,
): Promise<{ message: ClientMessage; threadId: string }> {
  const textStream = createStreamableValue("");
  const statustream = createStreamableValue("Thinking...");
  const textUIStream = createStreamableUI(
    <Message textStream={textStream.value} statusStream={statustream.value} />,
  );

  const runQueue = [];
  let newTheadId = threadId ?? "";
  (async () => {
    if (threadId) {
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: question,
      });

      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: ASSISTANT_ID,
        stream: true,
      });

      runQueue.push({ id: generateId(), run });
    } else {
      const run = await openai.beta.threads.createAndRun({
        assistant_id: ASSISTANT_ID,
        stream: true,
        thread: {
          messages: [{ role: "user", content: question }],
        },
      });

      runQueue.push({ id: generateId(), run });
    }

    while (runQueue.length > 0) {
      const latestRun = runQueue.shift();

      if (latestRun) {
        for await (const delta of latestRun.run) {
          const { data, event } = delta;
          const evenStatus = getEventStatus(event);
          statustream.update(evenStatus);

          if (event === "thread.created") {
            newTheadId = data.id;
          } else if (event === "thread.run.created") {
            // RUN_ID = data.id;
          } else if (event === "thread.message.delta") {
            data.delta.content?.map((part) => {
              if (part.type === "text") {
                if (part.text) {
                  textStream.append(part.text.value as string);
                }
              }
            });
          } else if (event === "thread.run.failed") {
            console.error(data);
            throw Error(data.last_error?.message);
          }
        }
      }
    }
    textStream.done();
  })();

  return {
    message: {
      id: generateId(),
      text: textUIStream.value,
      role: "assistant",
    },
    threadId: newTheadId,
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
  });

  return conversations;
}

export async function conversationMessages(conversationId: string) {
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

  const messages = await prismaDB.copilotConversationMessage.findMany({
    where: {
      conversationId: conversationId,
    },
  });

  return messages;
}

async function saveMessageToConversation(
  conversationId: string,
  message: string,
  role: string,
  finishReason: string | null = null,
  promptTokens: number | null = null,
  completionTokens: number | null = null,
  totalTokens: number | null = null,
) {
  await prismaDB.copilotConversationMessage.create({
    data: {
      conversationId,
      message,
      role,
      finishReason,
      promptTokens,
      completionTokens,
      totalTokens,
    },
  });
}

function getEventStatus(event: string) {
  switch (event) {
    case "thread.run.completed":
    case "thread.message.delta":
    case "thread.message.completed":
    case "thread.run.step.completed":
      return "";

    default:
      return "Thinking...";
  }
}
