import { ProjectUser, ProjectUserInvite, User } from "@prisma/client";

export type ProjectMembers = ProjectMember[];

export type ProjectMember = ProjectUser & {
  user: User;
};

export type ProjectUserInvitesWithSentByUser =
  ProjectUserInviteWithSentByUser[];

export type ProjectUserInviteWithSentByUser = ProjectUserInvite & {
  sentByUser: User | null;
};
