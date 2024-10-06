import { History, Plus } from "lucide-react";
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
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface CopilotMenuProps {
  projectId: string;
  conversationsHistory: ConversationHistory[] | null;
  aiModels: AIModel[] | null;
  onClickNewChat: () => void;
  onModelChange: (name: string) => void;
}

export default function CopilotMenu({
  projectId,
  conversationsHistory,
  aiModels,
  onClickNewChat,
  onModelChange,
}: CopilotMenuProps) {
  return (
    <div className="fixed z-10 flex flex-row items-center justify-center  gap-4 rounded bg-white  px-2 py-2   lg:flex-col lg:border lg:border-gray-200 lg:shadow-md lg:shadow-gray-200">
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
        <Popover>
          <PopoverTrigger className="w-full">
            <Button
              variant="outline"
              className="flex w-full items-center justify-start gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
            >
              <Brain className="h-5 w-5" />
              {"GPT-4o"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <ModelSelectBox
              allModels={aiModels ?? []}
              selectedModelName="gpt-4o"
              onModelChange={onModelChange}
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
  const onValueChange = (value: string) => {
    // Map title to name and call on model change name
    onModelChange(value);
  };

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border">
      <ul className="space-y-2 p-4">
        {allModels.map((model) => (
          <li
            key={model.id}
            onClick={() => {}}
            className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-100"
          >
            {model.title}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
