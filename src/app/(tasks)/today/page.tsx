"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery } from "@rocicorp/zero/react";
import { addDays, startOfDay } from "date-fns";
import { MoonIcon, StarIcon } from "lucide-react";
import { observer } from "mobx-react-lite";

import { useDndContext } from "@/components/dnd/dnd-context";
import { PageContainer } from "@/components/shared/page-container";
import { TaskList } from "@/components/task/task-list";
import { useTaskSelection } from "@/hooks/use-task-selection";
import { queries } from "@/lib/zero/queries";

const Page = observer(() => {
  const { dragOverId, activeId } = useDndContext();

  const tomorrow = addDays(startOfDay(new Date()), 1).getTime();

  const [tasks] = useQuery(queries.tasks.today({ tomorrow }));

  const initialTodayTasks = tasks.filter(
    (task) => task.start_bucket !== "evening"
  );

  const todayTasks = tasks.filter((task) => {
    if (dragOverId && task.id === activeId) {
      // Show dragged task in the list it's over
      return dragOverId === "today";
    }
    return task.start_bucket !== "evening";
  });

  const initialEveningTasks = tasks.filter(
    (task) => task.start_bucket === "evening"
  );

  const eveningTasks = tasks.filter((task) => {
    if (dragOverId && task.id === activeId) {
      return dragOverId === "evening";
    }
    return task.start_bucket === "evening";
  });

  const { handleClick } = useTaskSelection(
    [initialTodayTasks, initialEveningTasks].flatMap((tasks) =>
      tasks.map((task) => task.id)
    )
  );

  return (
    <PageContainer>
      <div>
        <div className="task-outside-click mx-4 flex items-center gap-2">
          <StarIcon className="task-outside-click size-6" />
          <h1 className="h3 task-outside-click">Today</h1>
        </div>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <StarIcon className="size-16 opacity-30" />
          </div>
        )}
      </div>

      <SortableContext
        items={[{ id: "today" }, { id: "evening" }]}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col">
          {initialTodayTasks.length > 0 && (
            <div className="task-outside-click h-6" />
          )}

          <TaskList
            tasks={todayTasks}
            listData={{ id: "today", start: "started", start_bucket: "today" }}
            onTaskClick={handleClick}
          />

          {initialEveningTasks.length > 0 && (
            <>
              <div className="task-outside-click mx-4 pb-2">
                <div className="task-outside-click flex items-center gap-2 border-b border-border py-1 pt-6">
                  <MoonIcon className="task-outside-click size-4" />
                  <h1 className="task-outside-click text-base font-bold tracking-tight">
                    This Evening
                  </h1>
                </div>
              </div>

              <TaskList
                tasks={eveningTasks}
                listData={{
                  id: "evening",
                  start: "started",
                  start_bucket: "evening",
                }}
                onTaskClick={handleClick}
              />
            </>
          )}
        </div>
      </SortableContext>
    </PageContainer>
  );
});

export default Page;
