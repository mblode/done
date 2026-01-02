import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";

import { RootStoreContext } from "@/lib/stores/root-store";

import { ChecklistButton } from "./checklist-button";
import { ChecklistList } from "./checklist-list";
import { TagButton } from "./tag-button";
import { TagDialog } from "./tag-dialog";
import { TagList } from "./tag-list";
import { TaskHeader } from "./task-header";
import { TaskNotes } from "./task-notes";
import type { Task } from "./types";
import { WhenButton } from "./when-button";
import { WhenLabel } from "./when-label";

interface Props {
  task: Task;
  checked: boolean;
  onComplete: (checked: boolean) => void;
  showDashedCheckbox?: boolean;
}

export const TaskItemDetails = observer(
  ({ task, checked, onComplete, showDashedCheckbox }: Props) => {
    const {
      localStore: { tempTask },
    } = useContext(RootStoreContext);
    const [tagOpen, setTagOpen] = useState(false);

    const newTask = tempTask || task;

    return (
      <div className="task-outside-click py-5">
        <div className="flex h-full flex-col rounded-lg bg-card shadow-lg">
          <TaskHeader
            checked={checked}
            onComplete={onComplete}
            showDashedCheckbox={showDashedCheckbox}
            task={task}
          />

          <TaskNotes task={task} />

          {(task?.checklistItems || []).length > 0 && (
            <ChecklistList task={task} />
          )}

          {(task?.tags || []).length > 0 && (
            <TagList setOpen={setTagOpen} task={task} />
          )}

          <div className="flex items-center gap-1 pr-3 pb-4 pl-9">
            <div className="flex-1">
              {newTask?.start !== "not_started" && <WhenLabel task={newTask} />}
            </div>

            {(task?.tags || []).length === 0 && (
              <TagButton setOpen={setTagOpen} task={task} />
            )}

            {(task?.checklistItems || []).length === 0 && (
              <ChecklistButton task={task} />
            )}

            {newTask?.start === "not_started" && <WhenButton task={newTask} />}
          </div>
        </div>

        {tagOpen && (
          <TagDialog open={tagOpen} setOpen={setTagOpen} task={task} />
        )}
      </div>
    );
  }
);
