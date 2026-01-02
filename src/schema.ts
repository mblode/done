import {
  createSchema,
  number,
  type Row,
  relationships,
  string,
  table,
} from "@rocicorp/zero";

export const enterpriseSchema = table("enterprise")
  .columns({
    id: string(),
    name: string(),
    slug: string(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id");

export const workspaceSchema = table("workspace")
  .columns({
    id: string(),
    name: string(),
    slug: string(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id");

export const teamSchema = table("team")
  .columns({
    id: string(),
    name: string(),
    slug: string(),
    workspace_id: string(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id");

export const workspaceMemberSchema = table("workspace_member")
  .columns({
    id: string(),
    workspace_id: string(),
    user_id: string(),
    role: string(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id");

export const teamMemberSchema = table("team_member")
  .columns({
    id: string(),
    team_id: string(),
    user_id: string(),
    role: string(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id");

export const projectSchema = table("project")
  .columns({
    id: string(),
    name: string(),
    slug: string(),
    description: string().optional(),
    workspace_id: string(),
    team_id: string().optional(),
    sort_order: number(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id");

export const userSchema = table("user")
  .columns({
    id: string(),
    username: string(),
    email: string().optional(),
    role: string(),
    github_id: number(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id");

export const profileSchema = table("profile")
  .columns({
    id: string(),
    user_id: string(),
    name: string(),
    avatar: string().optional(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id");

export const taskSchema = table("task")
  .columns({
    id: string(),
    title: string(),
    description: string(),
    sort_order: number(),
    today_sort_order: number(),
    today_index_reference_date: number().optional(),
    created_at: number(),
    updated_at: number(),
    completed_at: number().optional(),
    archived_at: number().optional(),
    start: string(),
    start_date: number().optional(),
    start_bucket: string(),
    deadline_at: number().optional(),
    deadline_suppression_at: number().optional(),
    reminder_at: number().optional(),
    last_reminder_interaction_at: number().optional(),
    creator_id: string(),
    workspace_id: string(),
    assignee_id: string().optional(),
    project_id: string().optional(),
    team_id: string().optional(),
  })
  .primaryKey("id");

export const viewStateSchema = table("view_state")
  .columns({
    id: string(),
    task_id: string(),
    user_id: string(),
    viewed_at: number(),
  })
  .primaryKey("id");

export const taskCommentSchema = table("task_comment")
  .columns({
    id: string(),
    task_id: string(),
    created_at: number(),
    body: string(),
    creator_id: string(),
  })
  .primaryKey("id");

export const checklistItemSchema = table("checklist_item")
  .columns({
    id: string(),
    task_id: string(),
    title: string(),
    sort_order: number(),
    completed_at: number().optional(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id");

export const tagSchema = table("tag")
  .columns({
    id: string(),
    title: string(),
    workspace_id: string(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id");

export const taskTagSchema = table("task_tag")
  .columns({
    task_id: string(),
    tag_id: string(),
    created_at: number(),
  })
  .primaryKey("tag_id", "task_id");

export const emojiSchema = table("emoji")
  .columns({
    id: string(),
    value: string(),
    annotation: string(),
    subject_id: string(),
    creator_id: string(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id");

export const sessionSchema = table("session")
  .columns({
    id: string(),
    user_id: string(),
    created_at: number(),
    updated_at: number(),
  })
  .primaryKey("id", "user_id");

const workspaceRelationships = relationships(workspaceSchema, ({ many }) => ({
  sessionMembers: many(
    {
      sourceField: ["id"],
      destField: ["workspace_id"],
      destSchema: workspaceMemberSchema,
    },
    {
      sourceField: ["user_id"],
      destField: ["user_id"],
      destSchema: sessionSchema,
    }
  ),
}));

const teamRelationships = relationships(teamSchema, ({ one }) => ({
  workspace: one({
    sourceField: ["workspace_id"],
    destField: ["id"],
    destSchema: workspaceSchema,
  }),
}));

const projectRelationships = relationships(projectSchema, ({ one }) => ({
  workspace: one({
    sourceField: ["workspace_id"],
    destField: ["id"],
    destSchema: workspaceSchema,
  }),
  team: one({
    sourceField: ["team_id"],
    destField: ["id"],
    destSchema: teamSchema,
  }),
}));

const workspaceMemberRelationships = relationships(
  workspaceMemberSchema,
  ({ one, many }) => ({
    workspace: one({
      sourceField: ["workspace_id"],
      destField: ["id"],
      destSchema: workspaceSchema,
    }),
    session: many({
      sourceField: ["user_id"],
      destField: ["user_id"],
      destSchema: sessionSchema,
    }),
    user: one({
      sourceField: ["user_id"],
      destField: ["id"],
      destSchema: userSchema,
    }),
  })
);

const teamMemberRelationships = relationships(teamMemberSchema, ({ one }) => ({
  team: one({
    sourceField: ["team_id"],
    destField: ["id"],
    destSchema: teamSchema,
  }),
  user: one({
    sourceField: ["user_id"],
    destField: ["id"],
    destSchema: userSchema,
  }),
}));

const userRelationships = relationships(userSchema, ({ one, many }) => ({
  session: many({
    sourceField: ["id"],
    destField: ["user_id"],
    destSchema: sessionSchema,
  }),
  workspaceMembers: many({
    sourceField: ["id"],
    destField: ["user_id"],
    destSchema: workspaceMemberSchema,
  }),
  workspaces: many(
    {
      sourceField: ["id"],
      destField: ["user_id"],
      destSchema: workspaceMemberSchema,
    },
    {
      sourceField: ["workspace_id"],
      destField: ["id"],
      destSchema: workspaceSchema,
    }
  ),
  profile: one({
    sourceField: ["id"],
    destField: ["user_id"],
    destSchema: profileSchema,
  }),
}));

const profileRelationships = relationships(profileSchema, ({ many }) => ({
  session: many({
    sourceField: ["user_id"],
    destField: ["user_id"],
    destSchema: sessionSchema,
  }),
}));

const taskRelationships = relationships(taskSchema, ({ one, many }) => ({
  session: many({
    sourceField: ["creator_id"],
    destField: ["user_id"],
    destSchema: sessionSchema,
  }),
  workspace: one({
    sourceField: ["workspace_id"],
    destField: ["id"],
    destSchema: workspaceSchema,
  }),
  tags: many(
    {
      sourceField: ["id"],
      destField: ["task_id"],
      destSchema: taskTagSchema,
    },
    {
      sourceField: ["tag_id"],
      destField: ["id"],
      destSchema: tagSchema,
    }
  ),
  comments: many({
    sourceField: ["id"],
    destField: ["task_id"],
    destSchema: taskCommentSchema,
  }),
  checklistItems: many({
    sourceField: ["id"],
    destField: ["task_id"],
    destSchema: checklistItemSchema,
  }),
  creator: one({
    sourceField: ["creator_id"],
    destField: ["id"],
    destSchema: userSchema,
  }),
  assignee: one({
    sourceField: ["assignee_id"],
    destField: ["id"],
    destSchema: userSchema,
  }),
  view_state: many({
    sourceField: ["id"],
    destField: ["task_id"],
    destSchema: viewStateSchema,
  }),
  emoji: many({
    sourceField: ["id"],
    destField: ["subject_id"],
    destSchema: emojiSchema,
  }),
  project: one({
    sourceField: ["project_id"],
    destField: ["id"],
    destSchema: projectSchema,
  }),
  team: one({
    sourceField: ["team_id"],
    destField: ["id"],
    destSchema: teamSchema,
  }),
}));

const taskCommentRelationships = relationships(
  taskCommentSchema,
  ({ one, many }) => ({
    creator: one({
      sourceField: ["creator_id"],
      destField: ["id"],
      destSchema: userSchema,
    }),
    emoji: many({
      sourceField: ["id"],
      destField: ["subject_id"],
      destSchema: emojiSchema,
    }),
    task: one({
      sourceField: ["task_id"],
      destField: ["id"],
      destSchema: taskSchema,
    }),
  })
);

const checklistItemRelationships = relationships(
  checklistItemSchema,
  ({ one }) => ({
    task: one({
      sourceField: ["task_id"],
      destField: ["id"],
      destSchema: taskSchema,
    }),
  })
);

const taskTagRelationships = relationships(taskTagSchema, ({ one }) => ({
  task: one({
    sourceField: ["task_id"],
    destField: ["id"],
    destSchema: taskSchema,
  }),
}));

const emojiRelationships = relationships(emojiSchema, ({ one }) => ({
  creator: one({
    sourceField: ["creator_id"],
    destField: ["id"],
    destSchema: userSchema,
  }),
  task: one({
    sourceField: ["subject_id"],
    destField: ["id"],
    destSchema: taskSchema,
  }),
  task_comment: one({
    sourceField: ["subject_id"],
    destField: ["id"],
    destSchema: taskCommentSchema,
  }),
}));

const sessionRelationships = relationships(sessionSchema, ({ one }) => ({
  user: one({
    sourceField: ["user_id"],
    destField: ["id"],
    destSchema: userSchema,
  }),
}));

export const schema = createSchema({
  tables: [
    enterpriseSchema,
    workspaceSchema,
    teamSchema,
    projectSchema,
    workspaceMemberSchema,
    teamMemberSchema,
    userSchema,
    profileSchema,
    taskSchema,
    taskCommentSchema,
    tagSchema,
    taskTagSchema,
    viewStateSchema,
    emojiSchema,
    sessionSchema,
    checklistItemSchema,
  ],
  relationships: [
    workspaceRelationships,
    teamRelationships,
    projectRelationships,
    workspaceMemberRelationships,
    teamMemberRelationships,
    userRelationships,
    profileRelationships,
    taskRelationships,
    taskCommentRelationships,
    checklistItemRelationships,
    taskTagRelationships,
    emojiRelationships,
    sessionRelationships,
  ],
});

export type EnterpriseRow = Row<typeof schema.tables.enterprise>;
export type WorkspaceRow = Row<typeof schema.tables.workspace>;
export type TeamRow = Row<typeof schema.tables.team>;
export type WorkspaceMemberRow = Row<typeof schema.tables.workspace_member>;
export type TeamMemberRow = Row<typeof schema.tables.team_member>;
export type ProjectRow = Row<typeof schema.tables.project>;
export type TaskRow = Row<typeof schema.tables.task>;
export type TagRow = Row<typeof schema.tables.tag>;
export type ChecklistItemRow = Row<typeof schema.tables.checklist_item>;
export type CommentRow = Row<typeof schema.tables.task_comment>;
export type UserRow = Row<typeof schema.tables.user>;
export type ProfileRow = Row<typeof schema.tables.profile>;
export type Schema = typeof schema;

export interface ZeroContext {
  userID: string;
}

declare module "@rocicorp/zero" {
  interface DefaultTypes {
    schema: typeof schema;
    context: ZeroContext;
  }
}
