"use client";

import dynamic from "next/dynamic";
import { Triangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/evervault-card";
import { EvervaultCard } from "@/components/ui/evervault-card";
import ClientMessage from "../_types/clientMessage";
import Image from "next/image";
import logo from "@/assets/main_logo@1x.svg";
import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { submitMessage } from "@/app/project/actions/copilotActions";
import { Button } from "@/components/ui/button";
const CopilotMenu = dynamic(() => import("./CopilotMenu"), { ssr: false });
import { useEffect } from "react";
import { searchConversationHistory } from "@/app/project/actions/copilotActions";
import ConversationHistory from "../_types/conversationHistory";

export const maxDuration = 30;

interface AICopilotProps {
  threadId: string | null;
  projectId: string;
  hasCopilotCreateAccess: boolean;
  assistantId: string;
  existingMessages: ClientMessage[];
}

export default function AICopilot({
  threadId,
  projectId,
  hasCopilotCreateAccess,
  assistantId,
  existingMessages,
}: AICopilotProps) {
  const [currentThreadId, setCurrentThreadId] = useState(threadId);
  const router = useRouter();
  const pathname = usePathname();
  const [messages, setMessages] = useState<ClientMessage[]>(existingMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState<String | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const initialMessage = "Hello! I am Kindi How can I assist you today?";
  const [conversationsHistory, setConversationsHistory] = useState<
    ConversationHistory[] | null
  >(null);
  const inputPlaceholder = hasCopilotCreateAccess
    ? "Chat with Kindi"
    : "You don't have access to talk with Kindi";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInput("");
    setError(null);
    setSubmitDisabled(true);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: "123",
        status: "user.message.created",
        text: input,
        gui: null,
        role: "user",
      },
    ]);
    try {
      const { message, threadId } = await submitMessage(
        input,
        currentThreadId,
        projectId,
        assistantId,
      );

      setMessages((currentMessages) => [...currentMessages, message]);
      setCurrentThreadId(threadId);
      setSubmitDisabled(false);
    } catch (error: any) {
      if (error instanceof Error) {
        setError(error.message);
      }

      console.error(error);
      setSubmitDisabled(false);
    }
  };

  const handleRetry = async () => {
    setError(null);
    setSubmitDisabled(true);

    try {
      const { message, threadId } = await submitMessage(
        input,
        currentThreadId,
        projectId,
        assistantId,
      );
      setMessages((currentMessages) => [...currentMessages, message]);
      setCurrentThreadId(threadId);
      setSubmitDisabled(false);
    } catch (error: any) {
      console.error(error);
      setError(error.message);

      setSubmitDisabled(false);
    }
  };

  const handleNewChat = async () => {
    if (pathname !== `/project/${projectId}`) {
      router.push(`/project/${projectId}`);
      return;
    }

    setInput("");
    setError("");
    setSubmitDisabled(false);
    setMessages([]);
    setCurrentThreadId(null);
    setConversationsHistory([]);
  };

  useEffect(() => {
    const fetchConversationsHistory = async () => {
      try {
        const data = await searchConversationHistory(projectId, "");
        const conversationsHistory: ConversationHistory[] = data.map((item) => {
          return {
            id: item.id,
            name: item.title,
          };
        });
        setConversationsHistory(conversationsHistory);
      } catch (error) {
        setConversationsHistory([]);
        if (error instanceof Error) {
          console.error(error.message);
          return;
        }
        console.error(error);
      }
    };
    fetchConversationsHistory();
  }, [projectId]);

  useEffect(() => {
    setCurrentThreadId(threadId);
  }, [threadId]);

  return (
    <div className="flex flex-col lg:flex-row">
      <CopilotMenu
        conversationsHistory={conversationsHistory}
        projectId={projectId}
        onClickNewChat={handleNewChat}
      />
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

          <div className="flex w-full flex-col items-start justify-center gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex max-w-xl items-start ${
                  message.role === "user" ? "self-end" : "self-start"
                }`}
              >
                {message.role !== "user" && (
                  <Image
                    src={logo}
                    alt="Kindi Avatar"
                    className="mr-3 rounded-full"
                    width={40}
                    height={40}
                  />
                )}
                <div
                  className={`whitespace-pre-wrap rounded-2xl px-4 py-2 text-base shadow-md ${
                    message.role === "user"
                      ? "bg-black text-white shadow-gray-600"
                      : "bg-white bg-opacity-60 text-gray-900 shadow-gray-200"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* {isLoading && <MessageLoading />} */}

            {error && (
              <div className="items- flex w-full max-w-xs flex-col gap-4">
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

                {hasCopilotCreateAccess && (
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
