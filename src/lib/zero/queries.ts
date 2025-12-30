import {
  createBuilder,
  defineQueriesWithType,
  defineQueryWithType,
} from "@rocicorp/zero";
import { z } from "zod";

import { type Schema, schema, type ZeroContext } from "@/schema";

export const zql = createBuilder(schema);

const defineQuery = defineQueryWithType<Schema, ZeroContext>();
const defineQueries = defineQueriesWithType<Schema>();

export const queries = defineQueries({
  tasks: {
    inbox: defineQuery(() =>
      zql.task
        .where("start", "=", "not_started")
        .where("archived_at", "IS", null)
        .where("completed_at", "IS", null)
        .orderBy("sort_order", "asc")
        .related("tags", (q) => q.orderBy("updated_at", "desc"))
        .related("checklistItems", (q) => q.orderBy("sort_order", "asc"))
    ),
    today: defineQuery(z.object({ tomorrow: z.number() }), ({ args }) =>
      zql.task
        .where("start", "=", "started")
        .where("start_date", "IS NOT", null)
        .where("start_date", "<", args.tomorrow)
        .where("archived_at", "IS", null)
        .where("completed_at", "IS", null)
        .orderBy("sort_order", "asc")
        .related("tags", (q) => q.orderBy("updated_at", "desc"))
        .related("checklistItems", (q) => q.orderBy("sort_order", "asc"))
    ),
    upcoming: defineQuery(z.object({ tomorrow: z.number() }), ({ args }) =>
      zql.task
        .where("start", "=", "started")
        .where("start_date", ">=", args.tomorrow)
        .where("archived_at", "IS", null)
        .where("completed_at", "IS", null)
        .orderBy("sort_order", "asc")
        .related("tags", (q) => q.orderBy("updated_at", "desc"))
        .related("checklistItems", (q) => q.orderBy("sort_order", "asc"))
    ),
    anytime: defineQuery(z.object({ tomorrow: z.number() }), ({ args }) =>
      zql.task
        .where("start", "=", "started")
        .where("archived_at", "IS", null)
        .where("completed_at", "IS", null)
        .where(({ or, cmp }) =>
          or(
            cmp("start_date", "IS", null),
            cmp("start_date", "<", args.tomorrow)
          )
        )
        .orderBy("start", "asc")
        .orderBy("start_bucket", "desc")
        .orderBy("sort_order", "asc")
        .related("tags", (q) => q.orderBy("updated_at", "desc"))
        .related("checklistItems", (q) => q.orderBy("sort_order", "asc"))
    ),
    someday: defineQuery(() =>
      zql.task
        .where("start", "=", "someday")
        .where("start_date", "IS", null)
        .where("archived_at", "IS", null)
        .where("completed_at", "IS", null)
        .orderBy("sort_order", "asc")
        .related("tags", (q) => q.orderBy("updated_at", "desc"))
        .related("checklistItems", (q) => q.orderBy("sort_order", "asc"))
    ),
    logbook: defineQuery(() =>
      zql.task
        .where("archived_at", "IS", null)
        .where("completed_at", "IS NOT", null)
        .orderBy("completed_at", "asc")
        .related("tags", (q) => q.orderBy("updated_at", "desc"))
        .related("checklistItems", (q) => q.orderBy("sort_order", "asc"))
    ),
    trash: defineQuery(() =>
      zql.task
        .where("archived_at", "IS NOT", null)
        .orderBy("archived_at", "asc")
        .related("tags", (q) => q.orderBy("updated_at", "desc"))
        .related("checklistItems", (q) => q.orderBy("sort_order", "asc"))
    ),
    allSorted: defineQuery(() => zql.task.orderBy("sort_order", "asc")),
    firstBySortOrder: defineQuery(() =>
      zql.task.orderBy("sort_order", "asc").one()
    ),
    byId: defineQuery(z.object({ id: z.string() }), ({ args }) =>
      zql.task
        .where("id", "=", args.id)
        .related("tags", (q) => q.orderBy("updated_at", "desc"))
        .related("checklistItems", (q) => q.orderBy("sort_order", "asc"))
        .one()
    ),
    search: defineQuery(z.object({ query: z.string() }), ({ args }) =>
      zql.task
        .where("title", "ILIKE", `%${args.query}%`)
        .where("archived_at", "IS", null)
        .where("completed_at", "IS", null)
    ),
  },
  tags: {
    all: defineQuery(() => zql.tag.orderBy("updated_at", "desc")),
  },
  workspaces: {
    all: defineQuery(() => zql.workspace),
    byId: defineQuery(z.object({ id: z.string().optional() }), ({ args }) => {
      let query = zql.workspace;
      if (args.id) {
        query = query.where("id", "=", args.id);
      } else {
        query = query.limit(0);
      }
      return query.one();
    }),
  },
  teams: {
    all: defineQuery(() => zql.team),
    bySlug: defineQuery(z.object({ slug: z.string() }), ({ args }) =>
      zql.team.where("slug", "=", args.slug).one()
    ),
  },
  teamMembers: {
    withUser: defineQuery(
      z.object({ teamId: z.string().optional() }),
      ({ args }) => {
        let query = zql.team_member.related("user", (q) =>
          q.one().related("profile", (q) => q.one())
        );

        if (args.teamId) {
          query = query.where("team_id", "=", args.teamId);
        } else {
          query = query.limit(0);
        }

        return query;
      }
    ),
  },
  workspaceMembers: {
    withUserProfile: defineQuery(
      z.object({ workspaceId: z.string().optional() }),
      ({ args }) => {
        let query = zql.workspace_member.related("user", (q) =>
          q.one().related("profile", (q) => q.one())
        );

        if (args.workspaceId) {
          query = query.where("workspace_id", "=", args.workspaceId);
        } else {
          query = query.limit(0);
        }

        return query;
      }
    ),
  },
  users: {
    withWorkspaceMembers: defineQuery(() =>
      zql.user.related("workspaceMembers", (q) => q.related("workspace"))
    ),
  },
  sessions: {
    all: defineQuery(() => zql.session),
    withUserProfile: defineQuery(() =>
      zql.session.related("user", (q) =>
        q.one().related("profile", (q) => q.one())
      )
    ),
  },
});
