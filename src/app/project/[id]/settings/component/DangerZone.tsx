"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteProject } from "../actions";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import DeleteProjectConfirmationDialog from "@/app/project/_components/DeleteProjectConfirmationDialog";

interface DangerZoneProps {
  projectId: string;
  projectName: string;
}

export default function DangerZone({
  projectId,
  projectName,
}: DangerZoneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [
    deleteProjectConfirmationDialogOpen,
    setDeleteProjectConfirmationDialogOpen,
  ] = useState(false);
  const router = useRouter();
  const deleteProjectConfirmationHandler = async () => {
    setDeleteProjectConfirmationDialogOpen(false);
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
    <Dialog
      open={deleteProjectConfirmationDialogOpen}
      onOpenChange={setDeleteProjectConfirmationDialogOpen}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="text-2xl font-bold">Danger Zone</div>

        {deleteProjectConfirmationDialogOpen && (
          <DeleteProjectConfirmationDialog
            onDeleteProject={deleteProjectConfirmationHandler}
            projectName={projectName}
          />
        )}

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
            onClick={() => setDeleteProjectConfirmationDialogOpen(true)}
          >
            {isLoading && (
              <span className=" loading loading-spinner mr-1"></span>
            )}
            Delete project
          </Button>
        </div>
      </div>
    </Dialog>
  );
}