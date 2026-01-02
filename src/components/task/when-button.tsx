import { CalendarIcon } from "lucide-react";
import { useCallback, useContext } from "react";

import { Button } from "@/components/ui/button";
import { RootStoreContext } from "@/lib/stores/root-store";
import type { TaskRow } from "@/schema";

interface Props {
  task: TaskRow;
}

export const WhenButton = ({ task }: Props) => {
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
      <CalendarIcon className="size-4" />
    </Button>
  );
};
