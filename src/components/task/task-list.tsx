import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { observer } from "mobx-react-lite";
import { type MouseEvent, useContext, useMemo } from "react";

import { RootStoreContext } from "@/lib/stores/root-store";
import { cn } from "@/lib/utils";

import { type DndListData, useDndContext } from "../dnd/dnd-context";
import { TaskItemWrapper } from "./task-item-wrapper";
import type { Task } from "./types";

interface Props {
  tasks: readonly Task[];
  className?: string;
  showWhenIcon?: boolean;
  showDashedCheckbox?: boolean;
  listData: DndListData;
  onTaskClick: (id: string, e: MouseEvent<HTMLDivElement>) => void;
}

const findBorderRadiusGroups = (
  tasks: readonly Task[],
  selectedTaskIds: Set<string>
) => {
  const selectedTasks = tasks
    .filter((task) => selectedTaskIds.has(task.id))
    .sort((a, b) => tasks.indexOf(a) - tasks.indexOf(b));

  const noRadiusTop: string[] = [];
  const noRadiusBottom: string[] = [];

  selectedTasks.forEach((task, index) => {
    const prevTask = selectedTasks[index - 1];
    const nextTask = selectedTasks[index + 1];

    if (prevTask && tasks.indexOf(task) === tasks.indexOf(prevTask) + 1) {
      noRadiusTop.push(task.id);
    }
    if (nextTask && tasks.indexOf(nextTask) === tasks.indexOf(task) + 1) {
      noRadiusBottom.push(task.id);
    }
  });

  return { noRadiusTop, noRadiusBottom };
};

export const TaskList = observer(
  ({
    tasks,
    className,
    showWhenIcon,
    showDashedCheckbox,
    listData,
    onTaskClick,
  }: Props) => {
    const {
      localStore: { selectedTaskIds },
    } = useContext(RootStoreContext);

    const { isDragging } = useDndContext();

    const { noRadiusTop, noRadiusBottom } = useMemo(
      () => findBorderRadiusGroups(tasks, selectedTaskIds),
      [tasks, selectedTaskIds]
    );

    const { setNodeRef: setDroppableRef } = useDroppable({
      id: `list-${listData.id}-droppable`,
      data: {
        type: "list",
        listData,
      },
    });

    return (
      <SortableContext
        items={tasks.map((t) => t.id!)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={cn(
            "flex min-h-6 flex-col",
            isDragging && "cursor-grabbing",
            className
          )}
          ref={setDroppableRef}
        >
          {tasks.map((task) => (
            <TaskItemWrapper
              isSelected={selectedTaskIds.has(task.id)}
              key={task.id}
              listData={listData}
              noRadiusBottom={noRadiusBottom.includes(task.id)}
              noRadiusTop={noRadiusTop.includes(task.id)}
              onClick={(e) => onTaskClick(task.id, e)}
              showDashedCheckbox={showDashedCheckbox}
              showWhenIcon={showWhenIcon}
              task={task}
            />
          ))}
        </div>
      </SortableContext>
    );
  }
);
