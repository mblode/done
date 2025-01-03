"use client";
import * as React from "react";
import { observer } from "mobx-react-lite";
import { useQuery } from "@rocicorp/zero/react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Schema, WorkspaceRow, UserRow, WorkspaceMemberRow } from "@/schema";
import { RootStoreContext } from "@/lib/stores/root-store";
import { H2 } from "@/components/shared/typography";
import { WorkspaceSignout } from "./workspace-signout";
import { useZero } from "@/hooks/use-zero";

type ExtendedWorkspaceMemberRow = WorkspaceMemberRow & {
  workspace: readonly WorkspaceRow[];
};

type ExtendedUserRow = UserRow & {
  workspaceMembers: readonly ExtendedWorkspaceMemberRow[];
};

interface Compound
  extends React.FC<{
    users?: readonly ExtendedUserRow[];
    selectedUserId?: string;
    selectedWorkspaceId?: string;
    onWorkspaceChange: (params: {
      userId: string;
      workspaceId: string;
    }) => void;
    onAllWorkspacesClick?: () => void;
    renderUserTitle?: (user: ExtendedUserRow) => React.ReactNode;
  }> {
  AllWorkspaces: React.FC<{
    active: boolean;
    onClick?: () => void;
  }>;
  Block: React.FC;
}

export const WorkspaceSwitch: Compound = ({
  users,
  selectedUserId,
  selectedWorkspaceId,
  onWorkspaceChange,
  onAllWorkspacesClick,
  renderUserTitle,
}) => (
  <>
    <AllWorkspaces
      active={selectedUserId === undefined && selectedWorkspaceId === undefined}
      onClick={onAllWorkspacesClick}
    />
    {users?.map((user) => (
      <div key={user.id}>
        {renderUserTitle ? renderUserTitle(user) : <H2>{user.email}</H2>}

        <RadioGroup
          value={selectedUserId === user.id ? selectedWorkspaceId : ``}
          onValueChange={(value) =>
            onWorkspaceChange({
              userId: user.id,
              workspaceId: value,
            })
          }
        >
          {user.workspaceMembers.map((workspaceMember) => (
            <div
              key={workspaceMember.workspace_id}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem
                value={workspaceMember.workspace_id}
                id={workspaceMember.workspace_id}
              />
              <Label htmlFor={workspaceMember.workspace_id}>
                {workspaceMember.workspace[0]?.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    ))}
  </>
);

const AllWorkspaces: Compound["AllWorkspaces"] = ({ active, onClick }) => (
  <RadioGroup value={active ? `all` : ``} onValueChange={onClick}>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="all" id="all" />
      <Label htmlFor="all">All Workspaces</Label>
    </div>
  </RadioGroup>
);

WorkspaceSwitch.AllWorkspaces = AllWorkspaces;

const Block: Compound["Block"] = observer(() => {
  const zero = useZero();

  const [users] = useQuery(
    zero.query.user.related("workspaceMembers", (q) => q.related("workspace")),
  );

  const {
    localStore: {
      changeWorkspace,
      clearWorkspace,
      selectedWorkspaceId,
      selectedUserId,
    },
  } = React.useContext(RootStoreContext);

  return (
    <WorkspaceSwitch
      selectedWorkspaceId={selectedWorkspaceId}
      selectedUserId={selectedUserId}
      users={users}
      onWorkspaceChange={changeWorkspace}
      onAllWorkspacesClick={clearWorkspace}
      renderUserTitle={(user) => (
        <div className="flex flex-row gap-2">
          <H2>{user.email}</H2>
          <WorkspaceSignout.Block userId={user.id} />
        </div>
      )}
    />
  );
});

WorkspaceSwitch.Block = Block;
