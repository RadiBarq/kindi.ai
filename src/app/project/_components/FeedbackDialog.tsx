import { cn } from "@/lib/utils";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackDialog() {
  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Provide feedback</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          What do you think about KindiAI? What can be improved?
        </DialogDescription>
        <TextAreaForm />
      </DialogContent>
    </>
  );
}

function TextAreaForm({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-4 py-4", className)}>
      <div className="grid gap-2">
        {/* <Label htmlFor="email">Provide feedback</Label> */}
        <Textarea id="feedbackText" />
      </div>
      <Button onClick={onClickSubmit} type="submit">
        Submit
      </Button>
    </form>
  );

  function onClickSubmit() {}
}
