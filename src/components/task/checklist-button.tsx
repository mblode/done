import { ListIcon } from "lucide-react";
import { useCallback } from "react";
import { v4 } from "uuid";

import { Button } from "@/components/ui/button";
import { useZero } from "@/hooks/use-zero";
import { mutators } from "@/lib/zero/mutators";
import type { ChecklistItemRow, TaskRow } from "@/schema";

interface Props {
  task: TaskRow & { checklistItems: readonly ChecklistItemRow[] };
}

export const ChecklistButton = ({ task }: Props) => {
  const zero = useZero();

  const handleAddItem = useCallback(() => {
    zero.mutate(
      mutators.checklist_item.insert({
        id: v4(),
        task_id: task.id,
        title: "",
        completed_at: null,
        sort_order: 0,
        created_at: Date.now(),
        updated_at: Date.now(),
      })
    );
  }, [task.id, zero]);

  return (
    <Button
      className="h-auto gap-1.5 rounded-md p-1"
      onClick={handleAddItem}
      size="sm"
      variant="ghost"
    >
      <ListIcon className="size-4" />
    </Button>
  );
};
