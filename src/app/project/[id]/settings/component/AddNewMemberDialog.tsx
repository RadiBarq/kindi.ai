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
import { ProjectRole } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProjectInvite } from "../actions";

interface AddNewMemberDialogProps {
  onNewMemberAdded: () => void;
  projectId: string;
  currentUserId: string;
}

export default function AddNewMemberDialog({
  onNewMemberAdded,
  projectId,
  currentUserId,
}: AddNewMemberDialogProps) {
  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new member to project</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <InputForm
          projectId={projectId}
          currentUserId={currentUserId}
          onNewMemberAdded={onNewMemberAdded}
        />
      </DialogContent>
    </>
  );
}

interface InputFormProps {
  projectId: string;
  currentUserId: string;
  onNewMemberAdded: () => void;
  className?: string;
}

function InputForm({
  onNewMemberAdded,
  className,
  projectId,
  currentUserId,
}: InputFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<ProjectRole>(ProjectRole.MEMBER);
  const emailSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email must be filled." })
      .email("This is not a valid email."),
  });

  const valdiateEmail = (email: string) => {
    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!valdiateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      await createProjectInvite(projectId, email, role, currentUserId);
    } catch (error: any) {
      setError(error.message ?? "An unexpected error occurred.");
      console.error(error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setEmail("");
    onNewMemberAdded();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-4 py-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jsdoe@example.com"
        />

        <Label htmlFor="role">Organization Role</Label>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as ProjectRole)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.values(ProjectRole).map((value) => (
                <SelectItem key={value} value={value}>
                  <div className="w-full text-start">
                    {value.charAt(0) + value.slice(1).toLowerCase()}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button disabled={isLoading} type="submit">
        {isLoading && <span className="loading loading-spinner mr-2"></span>}
        Grant access
      </Button>
    </form>
  );
}
