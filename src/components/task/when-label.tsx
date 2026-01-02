import { useCallback, useContext } from "react";

import { RootStoreContext } from "@/lib/stores/root-store";
import type { TaskRow } from "@/schema";

import { Button } from "../ui/button";
import { getButtonIcon, getButtonText } from "./when-dialog";

interface Props {
  task: TaskRow;
}

export const WhenLabel = ({ task }: Props) => {
  const {
    localStore: { setWhenOpen, setWhenState },
  } = useContext(RootStoreContext);

  const handleClick = useCallback(() => {
    setWhenState({ type: "single", task });
    setWhenOpen(true);
  }, [setWhenOpen, setWhenState, task]);

  return (
    <Button
      className="h-auto gap-1.5 rounded-md p-1"
      onClick={handleClick}
      size="sm"
      variant="ghost"
    >
      {getButtonIcon(task)} {getButtonText(task)}
    </Button>
  );
};
