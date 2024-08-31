"use server";

import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createStreamableValue } from "ai/rsc";
import { hasAccess } from "@/lib/user/projectAccess";
import prismaDB from "@/lib/db/prisma";

export async function continueConversation(
  messages: CoreMessage[],
  conversationId: string | null,
  projectId: string,
) {
  const session = await getServerSession(authOptions);

  if (messages.length === 0) {
    throw Error("Messages input array cannot be empty!");
  }

  if (
    !hasAccess({
      session: session,
      projectId,
      scope: "conversations:create",
    })
  ) {
    throw Error("Operation is not allowed; you don't have authorization");
  }

  const newMessage = messages[messages.length - 1];

  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }

  const userId = session.user.id ?? "";

  let newConversationId: string = conversationId ?? "";
  if (!conversationId) {
    // Check if the user belongs to the project or not before initiating new conversation
    const project = await prismaDB.projectUser.findFirst({
      where: {
        projectId: projectId,
        userId: userId,
      },
    });

    if (!project) {
      throw Error(
        "You don't belong to the project that you are trying to initiate new copilot conversation inside it.",
      );
    }

    const result = await prismaDB.copilotConversation.create({
      data: {
        projectId,
        userId,
      },
    });
    newConversationId = result.id;
  }

  await saveMessageToConversation(
    newConversationId,
    newMessage.content as string,
    newMessage.role,
  );

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    system: `You are called Kindi, an AI assistant that helps customer support employees to answer the customer questions. 
      Start by greeting the employee and how can I help you and mention your name.
       `,
    messages: messages,
    async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      try {
        await saveMessageToConversation(
          newConversationId,
          text,
          "assistant",
          finishReason,
          usage.promptTokens,
          usage.completionTokens,
          usage.totalTokens,
        );
      } catch (error) {
        console.error(error);
      }
    },
  });

  const stream = createStreamableValue(result.textStream);
  return { message: stream.value, conversationId: newConversationId };
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
