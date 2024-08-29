import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

// Allow streaming responses up to 30 seconds.
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    system: `You are called Kindi, an AI assistant that helps customer support employees to answer the customer questions. 
      Start by greeting the employee and how can I help you and mention your name.
       `,
    messages: convertToCoreMessages(messages),
  });
  return result.toDataStreamResponse();
}
