"use client";
import React from "react";
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
import { ProjectMembers } from "../types/projects";

interface ProjectMembersProps {
  members: ProjectMembers;
}

export default function ProjectMembersProps({ members }: ProjectMembersProps) {
  const deleteMemberHandler = () => {};
  const addNewMemberHandler = () => {};

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-2xl font-bold">Project Members</div>
      <div className="border-gray-1000 w-full rounded-lg border bg-white bg-opacity-60 shadow-md shadow-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className="w-[200px] text-gray-900">Name</TableHead>
              <TableHead className="w-[400px] text-gray-900">Email</TableHead>
              <TableHead className="text-gray-900">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((memeber) => (
              <TableRow key={memeber.id}>
                <TableCell className="font-medium text-gray-600">
                  {memeber.user.name}
                </TableCell>
                <TableCell className="text-gray-600">
                  {memeber.user.email}
                </TableCell>
                <TableCell className="text-gray-600">{memeber.role}</TableCell>
                <TableCell className="text-gray-600">
                  <Trash
                    className="h-5 w-5 cursor-pointer"
                    onClick={deleteMemberHandler}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button onClick={addNewMemberHandler} className="w-44 cursor-pointer">
        <Plus className="mr-2" /> Add new member
      </Button>
      <ProjectInvites />
    </div>
  );
}
