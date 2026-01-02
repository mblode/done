import { useQuery } from "@rocicorp/zero/react";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePrompt } from "@/hooks/use-prompt";
import { useZero } from "@/hooks/use-zero";
import { mutators } from "@/lib/zero/mutators";
import { queries } from "@/lib/zero/queries";
import type { TagRow } from "@/schema";

import { DialogTitle } from "../ui/dialog";
import type { Task } from "./types";

interface Props {
  task: Task;
  onEditTag: (tag: TagRow) => void;
  onCancel: () => void;
}

export const TagDialogManage = ({ onEditTag, onCancel }: Props) => {
  const [search, setSearch] = useState("");
  const zero = useZero();
  const [availableTags] = useQuery(queries.tags.all());
  const dialog = usePrompt();

  const filteredTags = availableTags?.filter((tag) =>
    tag.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (tag: TagRow) => {
    const confirmed = await dialog({
      title: "Delete Tag",
      description:
        "This tag will be removed from any items that are currently using it. Are you sure you want to delete this tag?",
    });

    if (!confirmed) {
      return;
    }

    await zero.mutate(mutators.tag.delete({ id: tag.id }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-[52px]" />
        <DialogTitle>Manage Tags</DialogTitle>
        <Button onClick={onCancel} variant="ghost">
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
            <div
              className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
              key={tag.id}
            >
              <span>{tag.title}</span>
              <div className="space-x-2">
                <Button
                  onClick={() => onEditTag(tag)}
                  size="sm"
                  variant="ghost"
                >
                  <Pencil className="size-4" />
                </Button>

                <Button
                  onClick={() => handleDelete(tag)}
                  size="sm"
                  variant="ghost"
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
