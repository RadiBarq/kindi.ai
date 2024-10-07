import { CircleAlert, History, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import Link from "next/link";
import CopilotHistoryList from "./CopilotHistoryList";
import ConversationHistory from "../_types/conversationHistory";
import { AIModel } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

interface CopilotMenuProps {
  projectId: string;
  conversationsHistory: ConversationHistory[] | null;
  aiModels: AIModel[] | null;
  selectedModelName: string;
  onClickNewChat: () => void;
  onModelChange: (name: string) => void;
}

export default function CopilotMenu({
  projectId,
  conversationsHistory,
  aiModels,
  selectedModelName,
  onClickNewChat,
  onModelChange,
}: CopilotMenuProps) {
  const getModelTitle = useCallback(
    (modelName: string) => {
      return aiModels?.find((model) => model.name == modelName)?.title ?? "";
    },
    [aiModels],
  );
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false);
  const [selectedModelTitle, setSelectedModelTitle] = useState("");
  const modelChangeHandler = (name: string) => {
    onModelChange(name);
    setModelPopoverOpen(false);
  };

  useEffect(() => {
    setSelectedModelTitle(getModelTitle(selectedModelName));
  }, [selectedModelName, aiModels, getModelTitle]);

  return (
    <div className="fixed z-10 flex w-40 flex-row items-center justify-center  gap-4 rounded bg-white px-2 py-2 lg:flex-col lg:border lg:border-gray-200 lg:shadow-md lg:shadow-gray-200">
      <div className="w-full">
        <Link href={`/project/${projectId}`}>
          <Button
            onClick={() => onClickNewChat()}
            variant="outline"
            className="flex w-full justify-start gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
          >
            <Plus className="h-5 w-5" />
            New chat
          </Button>
        </Link>
      </div>
      <div className="w-full">
        <Popover>
          <PopoverTrigger className="w-full">
            <Button
              variant="outline"
              className="flex w-full items-center justify-start gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
            >
              <History className="h-5 w-5" />
              History
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <CopilotHistoryList
              projectId={projectId}
              conversationsHistory={conversationsHistory}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full">
        <Popover open={modelPopoverOpen} onOpenChange={setModelPopoverOpen}>
          <PopoverTrigger className="w-full">
            <Button
              variant="outline"
              onClick={() => setModelPopoverOpen(true)}
              className="flex w-full items-center justify-start gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
            >
              <Brain className="h-5 w-5 flex-shrink-0" />
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedModelTitle}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <ModelSelectBox
              allModels={aiModels ?? []}
              selectedModelName={selectedModelName}
              onModelChange={modelChangeHandler}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

interface ModelSelectBoxProps {
  selectedModelName: string;
  allModels: AIModel[];
  onModelChange: (projectId: string) => void;
}

function ModelSelectBox({
  selectedModelName,
  allModels,
  onModelChange,
}: ModelSelectBoxProps) {
  const onValueChange = (name: string) => {
    onModelChange(name);
  };

  return (
    <div className="mx-auto flex h-[350px] w-full max-w-sm flex-col gap-4">
      <div className="flex flex-row items-start justify-between">
        <Label className="text-md" htmlFor="model">
          Model
        </Label>
        <a
          target="_blank"
          href="https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4-gpt-4-turbo-gpt-4o-and-gpt-4o-mini"
        >
          <CircleAlert className="h-4 w-4 cursor-pointer" />
        </a>
      </div>

      <ScrollArea className=" w-full rounded-md border">
        <ul className="space-y-2 p-4">
          {allModels.map((model) => (
            <li
              key={model.id}
              onClick={() => onValueChange(model.name)}
              className={`flex cursor-pointer flex-col gap-0 rounded-lg p-3 transition-colors hover:bg-gray-100 ${model.name === selectedModelName ? "bg-gray-100" : ""}`}
            >
              <div>{model.title}</div>
              <div className="text-sm font-normal text-gray-400">
                {model.description}
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
