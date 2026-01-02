import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCallback, useState } from "react";
import { v4 } from "uuid";

import { useZero } from "@/hooks/use-zero";
import { mutators } from "@/lib/zero/mutators";
import type { ChecklistItemRow, TaskRow } from "@/schema";

import { ChecklistItem } from "./checklist-item";

interface Props {
  task: TaskRow & { checklistItems: readonly ChecklistItemRow[] };
}

export const ChecklistList = ({ task }: Props) => {
  const zero = useZero();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [isEndMode, setIsEndMode] = useState(false);

  const handleFocusChange = useCallback((id: string | null) => {
    setFocusedId(id);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleUpdateSortOrders = useCallback(
    (items: readonly ChecklistItemRow[], excludeId?: string) => {
      items.forEach((item, index) => {
        if (item.id !== excludeId) {
          zero.mutate(
            mutators.checklist_item.update({
              id: item.id,
              sort_order: index,
            })
          );
        }
      });
    },
    [zero]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = task.checklistItems.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = task.checklistItems.findIndex(
        (item) => item.id === over.id
      );

      const newChecklist = arrayMove(
        [...task.checklistItems],
        oldIndex,
        newIndex
      ).map((item, index) => ({ ...item, sort_order: index }));

      handleUpdateSortOrders(newChecklist);
    },
    [task.checklistItems, handleUpdateSortOrders]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleAddItem = useCallback(
    (afterId: string) => {
      const items = [...task.checklistItems];
      const currentIndex = items.findIndex((item) => item.id === afterId);
      const currentItem = items[currentIndex];
      const newSortOrder = currentItem ? currentItem.sort_order + 1 : 0;

      // Insert new item
      const newItem = {
        id: v4(),
        task_id: task.id,
        title: "",
        completed_at: null,
        sort_order: newSortOrder,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      // Insert the new item at the correct position
      items.splice(currentIndex + 1, 0, newItem);

      // Update all sort orders
      handleUpdateSortOrders(items, newItem.id);

      // Create the new item
      zero.mutate(mutators.checklist_item.insert(newItem));
    },
    [task.id, task.checklistItems, zero, handleUpdateSortOrders]
  );

  const focusedIndex = task.checklistItems.findIndex(
    (item) => focusedId === item.id
  );

  return (
    <div className="pr-3 pb-3 pl-9">
      <DndContext
        collisionDetection={closestCenter}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <SortableContext
          items={task.checklistItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {task.checklistItems.map((item, index) => (
            <ChecklistItem
              isDragging={activeId === item.id}
              isEndMode={isEndMode}
              isFocused={focusedId === item.id}
              item={item}
              key={item.id}
              onAddItem={handleAddItem}
              onFocusChange={handleFocusChange}
              setIsEndMode={setIsEndMode}
              showBottomLine={
                focusedId !== item.id &&
                focusedIndex - 1 !== index &&
                activeId !== item.id
              }
              showTopLine={index === 0 && activeId !== item.id}
              task={task}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
