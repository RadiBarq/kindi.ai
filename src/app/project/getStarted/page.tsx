"use client";

import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import ActionCard from "../_components/ActionCard";
import { useSession } from "next-auth/react";
import CreateProjectDialog from "../_components/CreateProjectDialog";

export default function GetStartedPage() {
  const { data: session, status } = useSession();
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
  if (!session || status != "authenticated") {
    return <div>Loading</div>;
  }

  const handleCreateNewProject = () => {
    setCreateProjectDialogOpen(true);
  };

  const handleGoToDemoProject = () => {};

  const handleScheduleCallWithFounder = () => {};

  console.log(`User id is ${session.user.id}`);
  return (
    <Dialog
      open={createProjectDialogOpen}
      onOpenChange={setCreateProjectDialogOpen}
    >
      <CreateProjectDialog
        onCreateProjectSucceeded={() => setCreateProjectDialogOpen(false)}
      />

      <div className="flex max-w-7xl flex-col items-start justify-start gap-10 p-10">
        {/* Header */}
        <div className="text-4xl font-bold">Get started</div>
        {/* Content */}
        {/* First row */}
        <div className="flex flex-col items-center justify-center gap-10 md:flex-row">
          {/* Create new project card */}
          {/* <DialogTrigger asChild> */}
          <ActionCard
            title="Create new project"
            description="Begin by creating a new project. Feel free
            to reach out to us or join our Discord community."
            actionString="Create a new project"
            onActionClick={handleCreateNewProject}
          />
          {/* </DialogTrigger> */}

          <ActionCard
            title="View demo project"
            description="Checkout the kindi-support demo project that has fake customer support converstations and manuals."
            actionString="Go to demo project"
            onActionClick={handleGoToDemoProject}
          />
        </div>
        {/* Content */}
        {/* Second row */}
        <div className="flex w-full flex-row items-center justify-center gap-10">
          {/* Create new project card */}
          <ActionCard
            title="Guided onboarding"
            description="If you need 1:1 support, we are always available for you."
            actionString="Schedule a call with our founder"
            onActionClick={handleScheduleCallWithFounder}
          />
        </div>
      </div>
    </Dialog>
  );
}
