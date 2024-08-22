import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectUserInvitesWithSentByUser } from "../types/projects";
import { Trash } from "lucide-react";
import { deleteProjectInvite } from "../actions";
import { useState } from "react";
import { useEffect } from "react";

interface ProjectInvitesProps {
  invites: ProjectUserInvitesWithSentByUser;
  hasDeleteMembersAccess: boolean;
  projectId: string;
}

export default function ProjectInvites({
  invites,
  hasDeleteMembersAccess,
  projectId,
}: ProjectInvitesProps) {
  const [projectInvites, setProjectInvites] = useState(invites);
  const deleteInviteHandler = async (inviteId: string) => {
    try {
      await deleteProjectInvite(inviteId, projectId);
      setProjectInvites((currentInvites) =>
        currentInvites.filter((invite) => invite.id !== inviteId),
      );
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    setProjectInvites(invites);
  }, [invites]);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full text-lg font-bold">Project Invites</div>
      <div className="border-gray-1000 w-full rounded-lg border bg-white bg-opacity-60 shadow-md shadow-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-gray-900">
                Email
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Role
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Sent by
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectInvites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell className="font-medium text-gray-900">
                  {invite.email}
                </TableCell>
                <TableCell className="text-gray-900">
                  {invite.role.charAt(0) + invite.role.slice(1).toLowerCase()}
                </TableCell>
                <TableCell className="text-gray-900">
                  {invite.sentByUser?.name}
                </TableCell>

                <TableCell className="text-gray-900">
                  {hasDeleteMembersAccess && (
                    <Trash
                      className="h-5 w-5 cursor-pointer"
                      onClick={() => deleteInviteHandler(invite.id)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
