"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery } from "@rocicorp/zero/react";
import { ArchiveIcon } from "lucide-react";
import { observer } from "mobx-react-lite";

import { PageContainer } from "@/components/shared/page-container";
import { TaskList } from "@/components/task/task-list";
import { useTaskSelection } from "@/hooks/use-task-selection";
import { queries } from "@/lib/zero/queries";

const Page = observer(() => {
  const [tasks] = useQuery(queries.tasks.someday());

  const { handleClick } = useTaskSelection(tasks.map((task) => task.id));

  return (
    <PageContainer>
      <div className="task-outside-click mx-4 flex items-center gap-2">
        <ArchiveIcon className="task-outside-click size-6" />
        <h1 className="h3 task-outside-click">Someday</h1>
      </div>

      {tasks.length === 0 && (
        <div className="flex items-center justify-center py-10">
          <ArchiveIcon className="size-16 opacity-30" />
        </div>
      )}

      <SortableContext
        items={[{ id: "someday" }]}
        strategy={verticalListSortingStrategy}
      >
        <TaskList
          listData={{ id: "someday" }}
          onTaskClick={handleClick}
          showDashedCheckbox
          tasks={tasks}
        />
      </SortableContext>
    </PageContainer>
  );
});

export default Page;
