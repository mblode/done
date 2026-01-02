"use client";

import { useQuery } from "@rocicorp/zero/react";
import { X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type FC, useContext } from "react";

import { Button } from "@/components/ui/button";
import { useZero } from "@/hooks/use-zero";
import { RootStoreContext } from "@/lib/stores/root-store";
import { mutators } from "@/lib/zero/mutators";
import { queries } from "@/lib/zero/queries";

interface Compound
  extends FC<{
    onSignout: () => void;
  }> {
  Block: FC<{
    userId: string;
  }>;
}

export const WorkspaceSignout: Compound = ({ onSignout }) => (
  <Button className="-my-2" onClick={onSignout} size="xs" variant="ghost">
    <X size={12} />
  </Button>
);

const Block: Compound["Block"] = observer(({ userId }) => {
  const zero = useZero();

  const [sessions] = useQuery(queries.sessions.all());

  const {
    localStore: { clearWorkspace, selectedUserId },
  } = useContext(RootStoreContext);

  const onSignout = () => {
    const sessionId = sessions[0]?.id;
    if (sessionId) {
      if (selectedUserId === userId) {
        clearWorkspace();
      }
      zero.mutate(mutators.session.delete({ id: sessionId, user_id: userId }));
    }
  };

  return <WorkspaceSignout onSignout={onSignout} />;
});

WorkspaceSignout.Block = Block;
