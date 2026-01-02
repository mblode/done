import { useCallback, useEffect, useRef } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useZero } from "@/hooks/use-zero";
import { cn } from "@/lib/utils";
import { mutators } from "@/lib/zero/mutators";
import type { TaskRow } from "@/schema";

interface Props {
  task: TaskRow;
  checked: boolean;
  onComplete: (checked: boolean) => void;
  showDashedCheckbox?: boolean;
}

export const TaskHeader = ({
  task,
  checked,
  onComplete,
  showDashedCheckbox,
}: Props) => {
  const zero = useZero();

  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      zero.mutate(
        mutators.task.update({
          id: task.id,
          title: e.target.value,
        })
      );
    },
    [task.id, zero]
  );

  useEffect(() => {
    firstInputRef?.current?.focus();
  }, []);

  return (
    <div className="flex gap-2 px-4">
      <div className="pt-4 pb-1">
        <div className="flex h-[20px] w-4 items-center">
          <Checkbox
            checked={checked}
            className={cn("shrink-0", {
              "ft-checkbox-dashed": showDashedCheckbox,
            })}
            id={`task-${task.id}-status`}
            onCheckedChange={onComplete}
          />
        </div>
      </div>

      <Input
        className="!rounded-none h-auto border-none bg-transparent p-0 pt-4 pb-1 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
        id={`task-${task.id}-title`}
        onChange={handleTitleChange}
        placeholder="New To-Do"
        ref={firstInputRef}
        value={task.title}
      />
    </div>
  );
};
