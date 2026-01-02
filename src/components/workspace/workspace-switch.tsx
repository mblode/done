"use client";

import { useQuery } from "@rocicorp/zero/react";
import { Pencil, User } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { type FC, type ReactNode, useContext } from "react";

import { H2 } from "@/components/shared/typography";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RootStoreContext } from "@/lib/stores/root-store";
import { queries } from "@/lib/zero/queries";
import type { UserRow, WorkspaceMemberRow, WorkspaceRow } from "@/schema";

import { Button } from "../ui/button";
import { WorkspaceSignout } from "./workspace-signout";

type ExtendedWorkspaceMemberRow = WorkspaceMemberRow & {
  workspace?: WorkspaceRow;
};

type ExtendedUserRow = UserRow & {
  workspaceMembers: readonly ExtendedWorkspaceMemberRow[];
};

interface Compound
  extends FC<{
    users?: readonly ExtendedUserRow[];
    selectedUserId?: string;
    selectedWorkspaceId?: string;
    onWorkspaceChange: (params: {
      userId: string;
      workspaceId: string;
    }) => void;
    onAllWorkspacesClick?: () => void;
    renderUserTitle?: (user: ExtendedUserRow) => ReactNode;
  }> {
  AllWorkspaces: FC<{
    active: boolean;
    onClick?: () => void;
  }>;
  Block: FC;
}

export const WorkspaceSwitch: Compound = ({
  users,
  selectedUserId,
  selectedWorkspaceId,
  onWorkspaceChange,
  onAllWorkspacesClick,
  renderUserTitle,
}) => (
  <div className="flex flex-col gap-2 p-2">
    <AllWorkspaces
      active={selectedUserId === undefined && selectedWorkspaceId === undefined}
      onClick={onAllWorkspacesClick}
    />
    {users?.map((user) => (
      <div className="flex flex-col gap-2" key={user.id}>
        {renderUserTitle ? renderUserTitle(user) : <H2>{user.username}</H2>}

        <RadioGroup
          onValueChange={(value) =>
            onWorkspaceChange({
              userId: user.id,
              workspaceId: value,
            })
          }
          value={selectedUserId === user.id ? selectedWorkspaceId : ""}
        >
          {user.workspaceMembers.map((workspaceMember) => (
            <div
              className="group/wmember flex items-center space-x-2 pl-2"
              key={workspaceMember.workspace_id}
            >
              <RadioGroupItem
                id={workspaceMember.workspace_id}
                value={workspaceMember.workspace_id}
              />
              <Label className="flex-1" htmlFor={workspaceMember.workspace_id}>
                {workspaceMember.workspace?.name}
              </Label>
              <Link href={"/workspace/general"}>
                <Button
                  className="invisible -my-2 group-hover/wmember:visible"
                  size="xs"
                  variant="ghost"
                >
                  <Pencil size={12} />
                </Button>
              </Link>
            </div>
          ))}
        </RadioGroup>
      </div>
    ))}
  </div>
);

const AllWorkspaces: Compound["AllWorkspaces"] = ({ active, onClick }) => (
  <RadioGroup onValueChange={onClick} value={active ? "all" : ""}>
    <div className="flex items-center space-x-2">
      <RadioGroupItem id="all" value="all" />
      <Label htmlFor="all">All Workspaces</Label>
    </div>
  </RadioGroup>
);

WorkspaceSwitch.AllWorkspaces = AllWorkspaces;

const Block: Compound["Block"] = observer(() => {
  const [users] = useQuery(queries.users.withWorkspaceMembers());

  const {
    localStore: {
      changeWorkspace,
      clearWorkspace,
      selectedWorkspaceId,
      selectedUserId,
    },
  } = useContext(RootStoreContext);

  return (
    <WorkspaceSwitch
      onAllWorkspacesClick={clearWorkspace}
      onWorkspaceChange={changeWorkspace}
      renderUserTitle={(user) => (
        <div className="group/workspace flex flex-row gap-2">
          <div className="flex flex-1 items-center gap-2 font-semibold">
            <User className="size-4" />
            {user.email}
          </div>
          <div className="invisible group-hover/workspace:visible">
            <WorkspaceSignout.Block userId={user.id} />
          </div>
        </div>
      )}
      selectedUserId={selectedUserId}
      selectedWorkspaceId={selectedWorkspaceId}
      users={users}
    />
  );
});

WorkspaceSwitch.Block = Block;
