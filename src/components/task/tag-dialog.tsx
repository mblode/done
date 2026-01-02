import { useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { TagRow } from "@/schema";

import { TagDialogForm } from "./tag-dialog-form";
import { TagDialogList } from "./tag-dialog-list";
import { TagDialogManage } from "./tag-dialog-manage";
import type { Task } from "./types";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  task: Task;
}

type View = "list" | "form" | "manage";

export const TagDialog = ({ open, setOpen, task }: Props) => {
  const [view, setView] = useState<View>("list");
  const [editingTag, setEditingTag] = useState<TagRow | null>(null);

  const handleClose = () => {
    setView("list");
    setEditingTag(null);
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        {view === "list" && (
          <TagDialogList
            onClose={handleClose}
            onManageTags={() => setView("manage")}
            onNewTag={() => setView("form")}
            task={task}
          />
        )}

        {view === "form" && (
          <TagDialogForm
            onCancel={() => {
              setEditingTag(null);
              setView(editingTag ? "manage" : "list");
            }}
            onSuccess={() => {
              setEditingTag(null);
              setView(editingTag ? "manage" : "list");
            }}
            tag={editingTag || undefined}
            task={task}
          />
        )}

        {view === "manage" && (
          <TagDialogManage
            onCancel={() => {
              setEditingTag(null);
              setView("list");
            }}
            onEditTag={(tag) => {
              setEditingTag(tag);
              setView("form");
            }}
            task={task}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
