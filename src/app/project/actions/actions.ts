"use server";

import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createStreamableValue } from "ai/rsc";

export async function continueConversation(
  messages: CoreMessage[],
  conversationId: string | null,
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }

  const newConversationId = "new conversation id";
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    system: `You are called Kindi, an AI assistant that helps customer support employees to answer the customer questions. 
      Start by greeting the employee and how can I help you and mention your name.
       `,
    messages: messages,
    async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      // implement your own storage logic:
      console.log(`Text is ${text}`);
      console.log(messages);
      //await saveChat({ text, toolCalls, toolResults });
    },
  });
  const stream = createStreamableValue(result.textStream);
  return { message: stream.value, conversationId: newConversationId };
}
