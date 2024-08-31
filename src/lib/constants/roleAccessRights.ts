import { ProjectRole } from "@prisma/client";

const scopes = [
  // Members
  "members:read",
  "members:create",
  "members:delete",

  // Projects
  "project:delete",
  "project:update",
  "project:transfer",

  // Conversations
  "conversations:create",
];

export type Scope = (typeof scopes)[number];

export const roleAccessRights: Record<ProjectRole, Scope[]> = {
  OWNER: [
    "members:read",
    "members:create",
    "members:delete",
    "project:delete",
    "project:update",
    "project:transfer",
    "conversations:create",
  ],
  ADMIN: [
    "project:update",
    "members:read",
    "members:create",
    "members:delete",
    "conversations:create",
  ],
  MEMBER: ["members:read", "conversations:create"],
  VIEWER: [],
};
