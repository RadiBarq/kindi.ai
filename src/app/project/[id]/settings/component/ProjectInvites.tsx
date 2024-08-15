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

interface ProjectInvitesProps {
  invites: ProjectUserInvitesWithSentByUser;
  hasDeleteAccess: boolean;
  projectId: string;
}

export default function ProjectInvites({
  invites,
  hasDeleteAccess,
  projectId,
}: ProjectInvitesProps) {
  const deleteInviteHandler = async (inviteId: string) => {
    try {
      await deleteProjectInvite(inviteId, projectId);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-lg font-bold">Project Invites</div>
      <div className="border-gray-1000 w-full rounded-lg border bg-white bg-opacity-60 shadow-md shadow-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className=" w-[400px] font-semibold text-gray-900">
                Email
              </TableHead>
              <TableHead className=" w-[100px] font-semibold text-gray-900">
                Role
              </TableHead>
              <TableHead className=" font-semibold text-gray-900">
                Sent by
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => (
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
                  {hasDeleteAccess && (
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
