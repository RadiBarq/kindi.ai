"use client";

import { Triangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/evervault-card";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { type CoreMessage } from "ai";
import Image from "next/image";
import logo from "@/assets/main_logo@1x.svg";
import { FormEvent, useState } from "react";
import { continueConversation } from "@/app/project/actions/copilotActions";
import { readStreamableValue } from "ai/rsc";
import { Button } from "@/components/ui/button";
import CopilotMenu from "./CopilotMenu";

export const maxDuration = 30;

interface AICopilotProps {
  conversationId: string | null;
  projectId: string;
  hasSendNewMessageAccess: boolean;
}

export default function AICopilot({
  conversationId,
  projectId,
  hasSendNewMessageAccess,
}: AICopilotProps) {
  const [currentConversationId, setCurrentConversationId] =
    useState(conversationId);
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const initialMessage = "Hello! I am Kindi How can I assist you today?";
  const inputPlaceholder = hasSendNewMessageAccess
    ? "Chat with Kindi"
    : "You don't have access to talk with Kindi";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInput("");
    setIsLoading(true);
    setError(null);
    setSubmitDisabled(true);
    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: "user" },
    ];
    setMessages(newMessages);

    try {
      const { message, conversationId } = await continueConversation(
        newMessages,
        currentConversationId,
        projectId,
      );

      setIsLoading(false);
      setCurrentConversationId(conversationId);

      for await (const content of readStreamableValue(message)) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: content as string,
          },
        ]);
      }

      setSubmitDisabled(false);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      setIsLoading(false);
      setSubmitDisabled(false);
    }
  };

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    setSubmitDisabled(true);

    try {
      const { message, conversationId } = await continueConversation(
        messages,
        currentConversationId,
        projectId,
      );

      setIsLoading(false);
      setCurrentConversationId(conversationId);

      for await (const content of readStreamableValue(message)) {
        setMessages([
          ...messages,
          {
            role: "assistant",
            content: content as string,
          },
        ]);
      }
      setSubmitDisabled(false);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      setIsLoading(false);
      setSubmitDisabled(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <CopilotMenu projectId={projectId} />
      <div className="relative top-32 mx-auto w-full border border-black/[0.2] px-4 py-16 dark:border-white/[0.2] md:px-16 lg:top-0 lg:max-w-4xl">
        <Icon className="-left-3 -top-3 hidden h-6 w-6 text-black dark:text-white lg:absolute lg:block" />
        <Icon className="-bottom-3 -left-3 hidden h-6 w-6 text-black dark:text-white lg:absolute lg:block" />
        <Icon className="-right-3 -top-3 hidden h-6 w-6 text-black dark:text-white lg:absolute lg:block" />
        <Icon className="-bottom-3 -right-3 hidden h-6 w-6 text-black dark:text-white lg:absolute lg:block" />
        <div className="flex w-full max-w-7xl flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex w-full justify-center text-xl font-medium">
              <EvervaultCard
                className="invisible hidden w-full text-sm sm:max-w-sm md:visible md:flex md:max-w-md lg:max-w-lg xl:max-w-xl"
                text={initialMessage}
              />
              <div className="flex w-full px-10 text-left text-4xl font-semibold md:invisible md:hidden">
                {initialMessage}
              </div>
            </div>
          )}
          <div className="flex w-full flex-col items-center justify-center gap-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex  max-w-xl items-start ${
                  m.role === "user" ? "self-end" : "self-start"
                }`}
              >
                {m.role !== "user" && (
                  <Image
                    src={logo}
                    alt="Kindi Avatar"
                    className="mr-3 rounded-full"
                    width={40}
                    height={40}
                  />
                )}
                <div
                  className={`whitespace-pre-wrap rounded-2xl px-4 py-2 shadow-md  ${
                    m.role === "user"
                      ? "bg-black text-white shadow-gray-600"
                      : "bg-white bg-opacity-60 text-gray-900 shadow-gray-200"
                  }`}
                >
                  {m.content as String}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex self-start">
                <Image
                  src={logo}
                  alt="Kindi Avatar"
                  className="mr-3 rounded-full"
                  width={40}
                  height={40}
                />
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-900 opacity-75"></span>
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-gray-900"></span>
                </span>
              </div>
            )}

            {error && (
              <div className="flex max-w-sm flex-col items-end gap-4">
                <div className="flex self-start">
                  <Image
                    src={logo}
                    alt="Kindi Avatar"
                    className="mr-3 rounded-full"
                    width={40}
                    height={40}
                  />
                  <div className="whitespace-pre-wrap rounded-2xl bg-red-400 px-4 py-2 shadow-md">
                    Unexpected error happened please try again!
                  </div>
                </div>
                <Button
                  onClick={() => handleRetry()}
                  className="w-20 items-end"
                  variant="outline"
                  disabled={submitDisabled}
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex w-full  items-center justify-center"
          >
            <div className="fixed bottom-0 mb-8 flex w-3/4 items-center  lg:w-1/3">
              <div className="relative w-full ">
                <Input
                  className="h-11 w-full rounded-3xl bg-white bg-opacity-60 pr-10 text-gray-900 shadow-md shadow-gray-200"
                  value={input}
                  placeholder={inputPlaceholder}
                  onChange={(e) => setInput(e.target.value)}
                />

                {hasSendNewMessageAccess && (
                  <button
                    type="submit"
                    disabled={submitDisabled}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-600 hover:text-gray-900 disabled:text-gray-400"
                  >
                    <Triangle className="h-6 w-6 rotate-90" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
