import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DeleteProjectConfirmationDialogProps {
  onDeleteProject: () => void;
  projectName: string;
}

export default function DeleteProjectConfirmationDialog({
  onDeleteProject,
  projectName,
}: DeleteProjectConfirmationDialogProps) {
  const correctInput = `${projectName}/${projectName}`;
  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          To confirm type<strong> &quot;{correctInput}&quot; </strong> in the
          input box
        </DialogDescription>
        <InputForm
          correctInput={correctInput}
          onDeleteProject={onDeleteProject}
        />
      </DialogContent>
    </>
  );
}

interface InputFormProps {
  onDeleteProject: () => void;
  correctInput: string;
  className?: string;
}

function InputForm({
  onDeleteProject,
  correctInput,
  className,
}: InputFormProps) {
  const [validationInput, setValidationInput] = useState("");
  const [error, setError] = useState<String | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validationInput !== correctInput) {
      setError(`Please confirm with ${correctInput}`);
      return;
    }
    await onDeleteProject();
    setValidationInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-4 py-4", className)}
    >
      <Input
        onChange={(e) => setValidationInput(e.target.value)}
        value={validationInput}
        type="text"
        placeholder={correctInput}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        disabled={validationInput.length === 0}
        type="submit"
        variant={"destructive"}
      >
        Delete project
      </Button>
    </form>
  );
}
