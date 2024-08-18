"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProjectInvites from "./ProjectInvites";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ProjectMembers,
  ProjectUserInvitesWithSentByUser,
  ProjectMember,
} from "../types/projects";
import { deleteProjectMember } from "../actions";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { ProjectUserInviteWithSentByUser } from "../types/projects";
import AddNewMemberDialog from "./AddNewMemberDialog";
import { ProjectRole, ProjectUser } from "@prisma/client";
import { boolean } from "zod";

interface ProjectMembersProps {
  members: ProjectMembers;
  invites: ProjectUserInvitesWithSentByUser;
  hasDeleteMembersAccess: boolean;
  hasCreateMembersAccess: boolean;
  currentUserId: string;
  isOwner: boolean;
  projectId: string;
}

export default function ProjectMembersProps({
  members,
  hasDeleteMembersAccess,
  hasCreateMembersAccess,
  currentUserId,
  isOwner,
  projectId,
  invites,
}: ProjectMembersProps) {
  const deleteMemberHandler = async (memeber: string) => {
    try {
      await deleteProjectMember(memeber, projectId);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const addNewMemberHandler = (
    newMemberInvite: ProjectUserInviteWithSentByUser,
  ) => {
    setMembersInvite((currentMembersInvite) => [
      ...currentMembersInvite,
      newMemberInvite,
    ]);

    setAddNewMemberDialogOpen(false);
  };

  const hasDeleteAccess = (member: ProjectMember): boolean => {
    if (!hasDeleteMembersAccess) {
      return false;
    }

    if (!isOwner) {
      return (
        (member.role === ProjectRole.MEMBER ||
          member.role === ProjectRole.VIEWER) &&
        member.userId !== currentUserId
      );
    }
    return member.userId !== currentUserId;
  };

  useEffect(() => {
    setMembersInvite(invites);
  }, [invites]);

  const [addNewMemberDialogOpen, setAddNewMemberDialogOpen] = useState(false);
  const [membersInvite, setMembersInvite] = useState(invites);

  return (
    <Dialog
      open={addNewMemberDialogOpen}
      onOpenChange={setAddNewMemberDialogOpen}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="text-2xl font-bold">Project Members</div>
        {addNewMemberDialogOpen && (
          <AddNewMemberDialog
            projectId={projectId}
            onNewMemberAdded={addNewMemberHandler}
            currentUserId={currentUserId}
            isOwner={isOwner}
          />
        )}
        <div className="border-gray-1000 w-full rounded-lg border bg-white bg-opacity-60 shadow-md shadow-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="w-[200px] font-semibold text-gray-900">
                  Name
                </TableHead>
                <TableHead className="w-[400px] font-semibold  text-gray-900">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Role
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium text-gray-900">
                    {member.user.name}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {member.user.email}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {hasDeleteAccess(member) && (
                      <Trash
                        className="h-5 w-5 cursor-pointer"
                        onClick={() => deleteMemberHandler(member.id)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {hasCreateMembersAccess && (
          <Button
            onClick={() => setAddNewMemberDialogOpen(true)}
            className="w-44 cursor-pointer"
          >
            <Plus className="mr-2" /> Add new member
          </Button>
        )}

        <ProjectInvites
          projectId={projectId}
          invites={membersInvite}
          hasDeleteMembersAccess={hasDeleteMembersAccess}
        />
      </div>
    </Dialog>
  );
}
