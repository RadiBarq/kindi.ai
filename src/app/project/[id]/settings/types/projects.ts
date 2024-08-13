import { ProjectUser, User } from "@prisma/client";

export type ProjectMembers = (ProjectUser & {
  user: User;
})[];
