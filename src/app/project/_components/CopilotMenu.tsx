import { History } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import CopilotHistoryList from "./CopilotHistoryList";

interface CopilotMenuProps {
  projectId: string;
}

export default function CopilotMenu({ projectId }: CopilotMenuProps) {
  return (
    <Popover>
      <div className="fixed z-10 flex flex-row items-center justify-center  gap-4 rounded bg-white  px-2 py-2   lg:flex-col lg:border lg:border-gray-200 lg:shadow-md lg:shadow-gray-200">
        <PopoverTrigger className="w-full">
          <Button
            variant="outline"
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
          >
            <History className="h-5 w-5" />
            History
          </Button>
        </PopoverTrigger>
        <PopoverTrigger className="w-full">
          <Button
            variant="outline"
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
          >
            <Brain className="h-5 w-5" />
            Model
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-80">
        <CopilotHistoryList projectId={projectId} />
      </PopoverContent>
    </Popover>
  );
}
