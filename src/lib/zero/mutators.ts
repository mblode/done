import { defineMutatorsWithType, defineMutatorWithType } from "@rocicorp/zero";
import { z } from "zod";

import type { Schema, ZeroContext } from "@/schema";

const defineMutator = defineMutatorWithType<Schema, ZeroContext>();
const defineMutators = defineMutatorsWithType<Schema>();
const anyArgs = z.record(z.string(), z.any()) as any;
const toArgs = (args: any) => args as any;

export const mutators = defineMutators({
  task: {
    insert: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.task.insert(toArgs(args));
    }),
    update: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.task.update(toArgs(args));
    }),
    delete: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.task.delete(toArgs(args));
    }),
  },
  tag: {
    insert: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.tag.insert(toArgs(args));
    }),
    update: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.tag.update(toArgs(args));
    }),
    delete: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.tag.delete(toArgs(args));
    }),
  },
  task_tag: {
    insert: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.task_tag.insert(toArgs(args));
    }),
    delete: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.task_tag.delete(toArgs(args));
    }),
  },
  checklist_item: {
    insert: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.checklist_item.insert(toArgs(args));
    }),
    update: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.checklist_item.update(toArgs(args));
    }),
    delete: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.checklist_item.delete(toArgs(args));
    }),
  },
  workspace: {
    update: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.workspace.update(toArgs(args));
    }),
    delete: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.workspace.delete(toArgs(args));
    }),
  },
  profile: {
    update: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.profile.update(toArgs(args));
    }),
  },
  team: {
    delete: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.team.delete(toArgs(args));
    }),
  },
  team_member: {
    delete: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.team_member.delete(toArgs(args));
    }),
  },
  session: {
    delete: defineMutator(anyArgs, async ({ tx, args }) => {
      await tx.mutate.session.delete(toArgs(args));
    }),
  },
});
