"use client";

import { observer } from "mobx-react-lite";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkspaceDeleteModal } from "@/components/workspace/workspace-delete-modal";
import { WorkspaceInfoEditor } from "@/components/workspace/workspace-info-editor";
import { RootStoreContext } from "@/lib/stores/root-store";

const Page = observer(() => {
  const {
    localStore: { selectedWorkspaceId },
  } = useContext(RootStoreContext);

  return (
    <div className="container mx-auto max-w-3xl space-y-8 py-6">
      <SectionTitle />
      <SectionInfoEditor workspaceId={selectedWorkspaceId} />
      <SectionDangerZone workspaceId={selectedWorkspaceId} />
    </div>
  );
});

export default Page;

const SectionTitle = () => {
  return (
    <div>
      <h2 className="font-medium text-lg">General Settings</h2>
      <p className="text-muted-foreground text-sm">
        Manage your workspace settings and preferences.
      </p>
    </div>
  );
};

const SectionInfoEditor = ({ workspaceId }: { workspaceId?: string }) =>
  workspaceId && <WorkspaceInfoEditor.Block workspaceId={workspaceId} />;

const SectionDangerZone = ({ workspaceId }: { workspaceId?: string }) => {
  const fromWorkspaceDelete = WorkspaceDeleteModal.useBlock(workspaceId);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-sm">Delete Workspace</p>
              <p className="text-muted-foreground text-sm">
                Permanently delete this workspace and all of its contents.
              </p>
            </div>
            <Button
              disabled={!workspaceId}
              onClick={fromWorkspaceDelete.onOpen}
              variant="destructive"
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>

      {workspaceId && <WorkspaceDeleteModal {...fromWorkspaceDelete} />}
    </>
  );
};
