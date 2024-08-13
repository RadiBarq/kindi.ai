import { cn } from "@/lib/utils";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { z } from "zod";
import { Project } from "@prisma/client";

interface CreateProjectDialogProps {
  onProjectCreated: (projectId: string) => void;
}

export default function CreateProjectDialog({
  onProjectCreated,
}: CreateProjectDialogProps) {
  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <InputForm onCreateProject={onProjectCreated} />
      </DialogContent>
    </>
  );
}

interface InputFormProps {
  onCreateProject: (projectId: string) => void;
  className?: string;
}

function InputForm({ onCreateProject, className }: InputFormProps) {
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const projectSchema = z.object({
    projectName: z
      .string()
      .min(1, "Project name is required")
      .max(100, "Project name must be at most 100 characters"),
  });

  const createProject = async (name: string) => {
    try {
      const response = await fetch("/api/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectName: name }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Something went wrong!");
      }
      const project: Project = await response.json();
      onCreateProject(project.id);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  const valdiateProject = (name: string) => {
    const validation = projectSchema.safeParse({ projectName: name });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!valdiateProject(projectName)) {
      return;
    }

    setIsLoading(true);
    await createProject(projectName);
    setIsLoading(false);
    setProjectName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-4 py-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="email">Project name</Label>
        <Input
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="my-ai-support-project"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button disabled={isLoading} type="submit">
        {isLoading && <span className="loading loading-spinner mr-2"></span>}
        Create
      </Button>
    </form>
  );
}
