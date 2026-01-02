// components/tag-dialog/tag-list.tsx
import { useQuery } from "@rocicorp/zero/react";
import { Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useZero } from "@/hooks/use-zero";
import { mutators } from "@/lib/zero/mutators";
import { queries } from "@/lib/zero/queries";
import type { TagRow } from "@/schema";

import { DialogTitle } from "../ui/dialog";
import type { Task } from "./types";

interface Props {
  task: Task;
  onNewTag: () => void;
  onManageTags: () => void;
  onClose: () => void;
}

export const TagDialogList = ({
  task,
  onNewTag,
  onManageTags,
  onClose,
}: Props) => {
  const [search, setSearch] = useState("");
  const zero = useZero();
  const [availableTags] = useQuery(queries.tags.all());

  const filteredTags = availableTags?.filter((tag) =>
    tag.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleTag = async (tag: TagRow) => {
    const isSelected = task.tags.some((t) => t.id === tag.id);

    if (isSelected) {
      await zero.mutate(
        mutators.task_tag.delete({
          task_id: task.id,
          tag_id: tag.id,
        })
      );
    } else {
      await zero.mutate(
        mutators.task_tag.insert({
          task_id: task.id,
          tag_id: tag.id,
          created_at: Date.now(),
        })
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-[52px]" />
        <DialogTitle>Tags</DialogTitle>
        <Button onClick={onClose} variant="ghost">
          Done
        </Button>
      </div>

      <Input
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tags..."
        value={search}
      />

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {filteredTags?.map((tag) => (
            <button
              className="flex w-full cursor-pointer items-center justify-between rounded-md p-2 text-left hover:bg-accent"
              key={tag.id}
              onClick={() => handleToggleTag(tag)}
              type="button"
            >
              <span>{tag.title}</span>
              {task.tags.some((t) => t.id === tag.id) && (
                <Check className="size-4 text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-between gap-2">
        <Button className="w-full" onClick={onManageTags} variant="secondary">
          Manage Tags
        </Button>

        <Button className="w-full" onClick={onNewTag} variant="secondary">
          New Tag
        </Button>
      </div>
    </div>
  );
};
