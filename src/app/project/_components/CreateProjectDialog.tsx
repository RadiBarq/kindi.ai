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
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function CreateProjectDialog() {
  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <InputForm />
      </DialogContent>
    </>
  );
}

function InputForm({ className }: React.ComponentProps<"form">) {
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const projectSchema = z.object({
    projectName: z
      .string()
      .min(1, "Project name is required")
      .max(100, "Project name must be at most 100 characters"),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const validation = projectSchema.safeParse({ projectName });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectName }),
      });

      const data = await response.json();
      if (!response.ok || !data.project) {
        throw new Error(data.message || "Something went wrong!");
      }
      setProjectName("");
      router.push(`/project/${data.project.id}/settings`);
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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
