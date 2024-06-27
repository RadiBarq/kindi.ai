"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionCardProps {
  title: string;
  description?: string;
  actionString?: string;
  actionIcon?: LucideIcon;
  onActionClick?: () => void;
}

export default function ActionCard({
  title,
  description,
  actionString,
  actionIcon,
  onActionClick,
}: ActionCardProps) {
  return (
    <div className="flex w-full flex-col items-start justify-between gap-4 rounded border border-gray-200 bg-background p-4 font-bold  shadow-gray-200">
      <div className="text-2xl font-semibold">{title}</div>
      {description && (
        <div className="font-mono text-sm text-gray-900 md:h-14">
          {description}
        </div>
      )}
      {actionString && (
        <Button className="" onClick={onActionClick}>
          {actionString}
        </Button>
      )}
    </div>
  );
}
