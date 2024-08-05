import { ProjectRole } from "@prisma/client";

const scopes = [
  "members:read",
  "members:create",
  "members:delete",

  "apiKeys:read",
  "apiKeys:create",
  "apiKeys:delete",

  "objects:publish",
  "objects:bookmark",
  "objects:tag",

  "traces:delete",

  "scores:CUD",

  "scoreConfigs:CUD",
  "scoreConfigs:read",

  "project:delete",
  "project:update",
  "project:transfer",
  "integrations:CRUD",

  "datasets:CUD",

  "prompts:CUD",
  "prompts:read",

  "models:CUD",

  "batchExport:create",

  "evalTemplate:create",
  "evalTemplate:read",
  "evalJob:read",
  "evalJob:CUD",
  "evalJobExecution:read",

  "llmApiKeys:read",
  "llmApiKeys:create",
  "llmApiKeys:delete",
] as const;

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
