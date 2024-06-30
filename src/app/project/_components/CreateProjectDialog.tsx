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
  return (
    <form className={cn("grid items-start gap-4 py-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Project name</Label>
        <Input
          type="text"
          id="projectName"
          placeholder="my-ai-support-project"
        />
      </div>
      <Button type="submit">Create</Button>
    </form>
  );
}
