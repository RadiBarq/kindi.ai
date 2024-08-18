"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateProjectName } from "../actions";
import { useRouter } from "next/navigation";

interface ProjectNameProps {
  projectName: string;
  projectId: string;
}

export default function ProjectName({
  projectName,
  projectId,
}: ProjectNameProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentProjectName, setCurrentProjectName] = useState("");
  const router = useRouter();
  const onClickSave = async () => {
    setIsLoading(true);
    try {
      await updateProjectName(projectName, projectId);
      setIsLoading(false);
      setCurrentProjectName("");
      router.refresh();
    } catch (error) {
      setCurrentProjectName("");
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-2xl font-bold">Project Name</div>
      <div className="text-base">
        Your project is currently named
        <strong> &quot;{projectName}&quot;</strong>
      </div>
      <Input
        onChange={(e) => setCurrentProjectName(e.target.value)}
        className="w-1/3"
        type="text"
        placeholder={projectName}
      />
      <Button
        className="w-20"
        onClick={() => onClickSave()}
        disabled={isLoading || currentProjectName.length === 0}
        type="submit"
      >
        {isLoading && <span className=" loading loading-spinner mr-1"></span>}
        Save
      </Button>
    </div>
  );
}
