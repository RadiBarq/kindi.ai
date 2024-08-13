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
  ],
  ADMIN: ["project:update", "members:read", "members:create", "members:delete"],
  MEMBER: ["members:read"],
  VIEWER: [],
};
