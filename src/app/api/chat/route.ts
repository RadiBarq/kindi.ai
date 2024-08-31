import { openai } from "@ai-sdk/openai";
import { StreamData, streamText, convertToCoreMessages } from "ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismaDB from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds.
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          message: "Operation is not allowed; you need to authenticate first",
        },
        { status: 401 },
      );
    }
    const { messages, conversationId } = await req.json();
    const data = new StreamData();
    data.append({ conversationId });
    const result = await streamText({
      model: openai("gpt-4-turbo"),
      system: `You are called Kindi, an AI assistant that helps customer support employees to answer the customer questions. 
        Start by greeting the employee and how can I help you and mention your name.
         `,
      messages: convertToCoreMessages(messages),
      async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
        // implement your own storage logic:
        console.log(`Text is ${text}`);
        console.log(messages);
        data.close();
        //await saveChat({ text, toolCalls, toolResults });
      },
    });
    const stream = result.toDataStreamResponse({ data });
    return { message: stream, data };
  } catch (error) {
    console.log("Error fetching projects: ", error);
    return NextResponse.json(
      {
        message: "Unexpected server error!. Please try again later.",
      },
      { status: 500 },
    );
  }
}

async function saveChat() {}
