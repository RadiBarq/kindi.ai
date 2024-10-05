"use client";

import dynamic from "next/dynamic";
import { Triangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/evervault-card";
import { EvervaultCard } from "@/components/ui/evervault-card";
import ClientMessage from "../_types/clientMessage";
import Image from "next/image";
import logo from "@/assets/main_logo@1x.svg";
import { FormEvent, ChangeEvent, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { submitMessage } from "@/app/project/actions/copilotActions";
import { Button } from "@/components/ui/button";
const CopilotMenu = dynamic(() => import("./CopilotMenu"), { ssr: false });
import { useEffect, useRef } from "react";
import { generateId } from "ai";
import { searchConversationHistory } from "@/app/project/actions/copilotActions";
import ConversationHistory from "../_types/conversationHistory";
import { ChevronsDown } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ClientMessage[]>(existingMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState<String | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const initialMessage = "Hello! I am Kindi How can I assist you today?";
  const prevMessagesLength = useRef(messages.length);
  const [conversationsHistory, setConversationsHistory] = useState<
    ConversationHistory[] | null
  >(null);
  const inputPlaceholder = hasCopilotCreateAccess
    ? "Chat with Kindi"
    : "You don't have access to talk with Kindi";
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && messages.length !== 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Scroll to the bottom when messages changes or user scroll to bottom.
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // This is to show the scroll bottom icon and observe if last message is visible or not.
  useEffect(() => {
    const current = messagesEndRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      },
    );

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [messagesEndRef]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newMessageId = generateId();
    setInput("");
    setError(null);
    setSubmitDisabled(true);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: generateId(),
        status: "user.message.created",
        text: input,
        gui: null,
        role: "user",
      },
      {
        id: newMessageId,
        status: "user.message.created",
        text: null,
        gui: null,
        role: "assistant",
      },
    ]);

    try {
      const { message, threadId } = await submitMessage(
        newMessageId,
        input,
        currentThreadId,
        projectId,
        assistantId,
      );

      setMessages((currentMessages) => [
        ...currentMessages.filter((m) => m.id !== newMessageId),
        message,
      ]);
      setCurrentThreadId(threadId);
      setSubmitDisabled(false);
    } catch (error: any) {
      if (error instanceof Error) {
        setError(error.message);
      }

      setMessages((currentMessages) => [
        ...currentMessages.filter((m) => m.id !== newMessageId),
      ]);
      console.error(error);
      setSubmitDisabled(false);
    }
  };

  const handleRetry = async (messageText: string) => {
    setError(null);
    setSubmitDisabled(true);
    const newMessageId = generateId();

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: newMessageId,
        status: "user.message.created",
        text: null,
        gui: null,
        role: "assistant",
      },
    ]);

    try {
      const { message, threadId } = await submitMessage(
        newMessageId,
        messageText,
        currentThreadId,
        projectId,
        assistantId,
      );
      setMessages((currentMessages) => [
        ...currentMessages.filter((m) => m.id !== newMessageId),
        message,
      ]);
      setCurrentThreadId(threadId);
      setSubmitDisabled(false);
    } catch (error: any) {
      if (error instanceof Error) {
        console.error(error.message);
        setError(error.message);
      } else {
        console.error(error);
      }

      setMessages((currentMessages) => [
        ...currentMessages.filter((m) => m.id !== newMessageId),
      ]);
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

  const onInputChage = (event: ChangeEvent<HTMLInputElement>) => {
    const question = event.target.value;
    setSubmitDisabled(question === "");
    setInput(question);
  };

  const fetchConversationsHistory = useCallback(async () => {
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
  }, [projectId]);

  useEffect(() => {
    fetchConversationsHistory();
  }, [projectId, fetchConversationsHistory]);

  useEffect(() => {
    setCurrentThreadId(threadId);
  }, [threadId]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (prevMessagesLength.current === 0 && messages.length > 0) {
      fetchConversationsHistory();
    }
    prevMessagesLength.current = messages.length;
  }, [messages, fetchConversationsHistory]);

  return (
    <div className="flex w-full flex-col px-2 lg:mt-4 lg:flex-row">
      <CopilotMenu
        conversationsHistory={conversationsHistory}
        projectId={projectId}
        onClickNewChat={handleNewChat}
      />
      <div className="relative top-32 mx-auto w-full max-w-6xl border border-black/[0.2] px-4 py-12 dark:border-white/[0.2] md:max-w-xl md:px-16 lg:top-0  xl:max-w-3xl 2xl:max-w-6xl ">
        <Icon className="-left-3 -top-3 hidden h-6 w-6 text-black dark:text-white lg:absolute lg:block" />
        <Icon className="-bottom-3 -left-3 hidden h-6 w-6 text-black dark:text-white lg:absolute lg:block" />
        <Icon className="-right-3 -top-3 hidden h-6 w-6 text-black dark:text-white lg:absolute lg:block" />
        <Icon className="-bottom-3 -right-3 hidden h-6 w-6 text-black dark:text-white lg:absolute lg:block" />
        <div className="flex  w-full flex-col gap-4">
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

          <div className="flex w-full max-w-6xl flex-col items-start gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start  ${
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
                {!message.text && <MessageLoading />}
                {message.text && (
                  <div
                    className={`w-full max-w-lg whitespace-pre-wrap rounded-2xl px-4 py-2 text-base shadow-md md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-4xl ${
                      message.role === "user"
                        ? "bg-black text-white shadow-gray-600"
                        : "prose  bg-white bg-opacity-60 text-gray-900 shadow-gray-200 prose-pre:bg-slate-400 "
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            ))}

            {error && (
              <div className="flex  flex-col gap-4">
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
                  onClick={() =>
                    handleRetry(messages[messages.length - 1].text as string)
                  }
                  className="w-20 self-end"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            )}
            {/** Dummy div for scrolling */}
            <div ref={messagesEndRef} className="invisible"></div>
          </div>
          {/* Scroll to Bottom Button */}
          {!isAtBottom && (
            <button
              className="fixed bottom-20 right-5 rounded-full bg-gray-200 p-2 shadow-lg"
              onClick={() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <ChevronsDown className="h-6 w-6 text-gray-900" />
            </button>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex w-full  items-center justify-center"
          >
            <div className="fixed bottom-0 mb-8 flex w-3/4 items-center  lg:w-1/3">
              <div className="relative w-full ">
                <Input
                  ref={inputRef}
                  className="h-11 w-full rounded-3xl bg-white bg-opacity-60 pr-10 text-gray-900 shadow-md shadow-gray-200"
                  value={input}
                  placeholder={inputPlaceholder}
                  onChange={onInputChage}
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

function MessageLoading() {
  return (
    <div className="flex self-start">
      <span className="relative flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-300 opacity-90"></span>
        <span className="relative inline-flex h-4 w-4 rounded-full bg-gray-300"></span>
      </span>
    </div>
  );
}
