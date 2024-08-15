import { ProjectUser, ProjectUserInvite, User } from "@prisma/client";

export type ProjectMembers = (ProjectUser & {
  user: User;
})[];

export type ProjectUserInvitesWithSentByUser = (ProjectUserInvite & {
  sentByUser: User | null;
})[];
