import { Triangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/evervault-card";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { type CoreMessage } from "ai";
import Image from "next/image";
import logo from "@/assets/main_logo@1x.svg";
import { FormEvent, useState } from "react";
import { continueConversation } from "@/app/project/actions/actions";
import { readStreamableValue } from "ai/rsc";

export const maxDuration = 30;

interface AICopilotProps {
  conversationId: string | null;
}

export default function AICopilot({ conversationId }: AICopilotProps) {
  const [currentConversationId, setCurrentConversationId] =
    useState(conversationId);
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  const initialMessage =
    "Hello! How can I assist you today? I'm Kindi, your AI copilot";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: "user" },
    ];
    setMessages(newMessages);
    setInput("");

    const { message, conversationId } = await continueConversation(
      newMessages,
      currentConversationId,
    );

    setCurrentConversationId(conversationId);

    console.log("Retruned conersation id is: ", conversationId);

    for await (const content of readStreamableValue(message)) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: content as string,
        },
      ]);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl border border-black/[0.2] p-16 dark:border-white/[0.2]">
      <Icon className="absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white" />
      {conversationId && <pre>{JSON.stringify(conversationId, null, 2)}</pre>}
      <div className="flex w-full max-w-7xl flex-col gap-4">
        {(messages.length === 0 || currentConversationId === null) && (
          <div className="flex w-full justify-center text-xl font-medium">
            <EvervaultCard
              className="hidden w-full text-sm sm:max-w-sm md:flex md:max-w-md lg:max-w-lg xl:max-w-xl"
              text={initialMessage}
            />
            <div className="flex text-center md:hidden">{initialMessage}</div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start ${
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
              className={` whitespace-pre-wrap rounded-2xl px-4 py-2 shadow-md  ${
                m.role === "user"
                  ? "bg-black text-white shadow-gray-600"
                  : "bg-white bg-opacity-60 text-gray-900 shadow-gray-200"
              }`}
            >
              {m.content as String}
            </div>
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex w-full justify-center">
          <div className="fixed bottom-0 mb-8 flex w-full max-w-2xl items-center">
            <div className="relative w-full">
              <Input
                className="h-11 w-full rounded-3xl bg-white bg-opacity-60 pr-10 text-gray-900 shadow-md shadow-gray-200"
                value={input}
                placeholder="Chat with Kindi"
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-600 hover:text-gray-900"
              >
                <Triangle className="h-6 w-6 rotate-90" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
