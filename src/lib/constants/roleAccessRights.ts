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

  // Copilot
  "copilot:create",
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
    "copilot:create",
  ],
  ADMIN: [
    "project:update",
    "members:read",
    "members:create",
    "members:delete",
    "copilot:create",
  ],
  MEMBER: ["members:read", "copilot:create"],
  VIEWER: ["copilot:create"],
};
