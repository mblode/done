"use client";

import { useQuery } from "@rocicorp/zero/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useZero } from "@/hooks/use-zero";
import { mutators } from "@/lib/zero/mutators";
import { queries } from "@/lib/zero/queries";
import type { WorkspaceRow } from "@/schema";

type Compound = typeof View & {
  useBlock: typeof useBlock;
  Block: typeof Block;
};

export const View = ({
  workspace,
  isOpen,
  onClose,
  onDelete,
}: {
  workspace?: WorkspaceRow;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
}) => {
  const [confirmName, setConfirmName] = useState("");

  const handleDelete = async () => {
    if (!workspace) {
      return;
    }

    if (confirmName !== workspace.name) {
      toast.error("Workspace name does not match");
      return;
    }

    try {
      await onDelete();
      onClose();
      toast.success("Workspace deleted successfully");
    } catch {
      toast.error("Failed to delete workspace");
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Workspace</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            workspace and remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-muted-foreground text-sm">
            Please type{" "}
            <span className="font-medium text-foreground">
              {workspace?.name}
            </span>{" "}
            to confirm.
          </p>
          <Input
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder="Enter workspace name"
            value={confirmName}
          />
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={!workspace || confirmName !== workspace.name}
            onClick={handleDelete}
            variant="destructive"
          >
            Delete Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const useBlock = (workspaceId?: string) => {
  const zero = useZero();

  const [workspace] = useQuery(queries.workspaces.byId({ id: workspaceId }));

  const [isOpen, setIsOpen] = useState(false);
  const onDelete = async () => {
    if (!workspaceId) {
      return;
    }

    await zero.mutate(mutators.workspace.delete({ id: workspaceId }));
  };

  return {
    workspace,
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onDelete,
  };
};

const Block = ({ workspaceId }: { workspaceId: string }) => {
  const fromWorkspaceDelete = WorkspaceDeleteModal.useBlock(workspaceId);
  return <WorkspaceDeleteModal {...fromWorkspaceDelete} />;
};

// @ts-expect-error compound
export const WorkspaceDeleteModal: Compound = View;
WorkspaceDeleteModal.useBlock = useBlock;
WorkspaceDeleteModal.Block = Block;
