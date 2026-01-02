import { CalendarIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useCallback, useContext } from "react";

import { Button } from "@/components/ui/button";
import { RootStoreContext } from "@/lib/stores/root-store";
import type { TaskRow } from "@/schema";

interface Props {
  task: TaskRow;
}

export const WhenHoverButton = observer(({ task }: Props) => {
  const {
    localStore: { setWhenOpen, setWhenState, selectedTaskIds },
  } = useContext(RootStoreContext);

  const handleClick = useCallback(() => {
    if (selectedTaskIds.has(task.id)) {
      setWhenState({ type: "multiple" });
    } else {
      setWhenState({ type: "single", task, immediate: true });
    }

    setWhenOpen(true);
  }, [selectedTaskIds, setWhenOpen, setWhenState, task]);

  return (
    <Button
      className="hover:!bg-transparent h-auto gap-1.5 rounded-md p-1 opacity-0 hover:opacity-60"
      onClick={handleClick}
      size="sm"
      variant="ghost"
    >
      <CalendarIcon className="size-4" />
    </Button>
  );
});
