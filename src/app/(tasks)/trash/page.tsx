"use client";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery } from "@rocicorp/zero/react";
import { TrashIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import { PageContainer } from "@/components/shared/page-container";
import { Section } from "@/components/shared/section";
import { TaskList } from "@/components/task/task-list";
import { Button } from "@/components/ui/button";
import { useTaskSelection } from "@/hooks/use-task-selection";
import { useZero } from "@/hooks/use-zero";
import { mutators } from "@/lib/zero/mutators";
import { queries } from "@/lib/zero/queries";

const Page = observer(() => {
  return (
    <PageContainer>
      <SectionTrash />
    </PageContainer>
  );
});

const SectionTrash = () => {
  const zero = useZero();

  const [tasks] = useQuery(queries.tasks.trash());

  const { handleClick } = useTaskSelection(tasks.map((task) => task.id));

  const handleEmptyTrash = useCallback(async () => {
    await Promise.all(
      tasks.map((task) => zero.mutate(mutators.task.delete({ id: task.id })))
    );
  }, [tasks, zero]);

  return (
    <Section>
      <div className="task-outside-click mx-4 flex items-center gap-2">
        <TrashIcon className="task-outside-click size-6" />
        <h1 className="h3 task-outside-click">Trash</h1>
      </div>

      {tasks.length === 0 ? (
        <div className="task-outside-click flex items-center justify-center py-10">
          <TrashIcon className="task-outside-click size-16 opacity-30" />
        </div>
      ) : (
        <div className="mx-4">
          <Button onClick={handleEmptyTrash} size="xs" variant="destructive">
            Empty Trash
          </Button>
        </div>
      )}

      <SortableContext
        items={[{ id: "trash" }]}
        strategy={verticalListSortingStrategy}
      >
        <TaskList
          tasks={tasks}
          listData={{ id: "trash" }}
          onTaskClick={handleClick}
        />
      </SortableContext>
    </Section>
  );
};

export default Page;
