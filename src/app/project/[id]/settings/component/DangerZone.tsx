"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteProject } from "../actions";
import { useRouter } from "next/navigation";

interface DangerZoneProps {
  projectId: string;
}

export default function DangerZone({ projectId }: DangerZoneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onClickDeleteProject = async () => {
    setIsLoading(true);
    try {
      await deleteProject(projectId);
      setIsLoading(false);
      router.replace("/project/getStarted");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-2xl font-bold">Danger Zone</div>
      <div className="flex flex-row flex-wrap items-center justify-between gap-10">
        <div className="flex-col gap-4">
          <div className="text-lg font-semibold">Delete project</div>
          <div className="text-sm">
            Once you delete a project, there is no going back. Please be
            certain.
          </div>
        </div>
        <Button
          variant="destructive"
          className="w-30"
          disabled={isLoading}
          type="submit"
          onClick={onClickDeleteProject}
        >
          {isLoading && <span className=" loading loading-spinner mr-1"></span>}
          Delete project
        </Button>
      </div>
    </div>
  );
}
