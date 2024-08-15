import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProjectInvites() {
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
            <TableRow>
              <TableCell className="font-medium text-gray-900">
                radibaraq@gmail.com
              </TableCell>
              <TableCell className="text-gray-900">MEMBER</TableCell>
              <TableCell className="text-gray-900">Radi Barq</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-900">
                radibaraq@gmail.com
              </TableCell>
              <TableCell className="text-gray-900">MEMBER</TableCell>
              <TableCell className="text-gray-900">Radi Barq</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-900">
                radibaraq@gmail.com
              </TableCell>
              <TableCell className="text-gray-900">MEMBER</TableCell>
              <TableCell className="text-gray-900">Radi Barq</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
