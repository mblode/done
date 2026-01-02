import { TagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Task } from "./types";

interface Props {
  task: Task;
  setOpen: (open: boolean) => void;
}

export const TagButton = ({ setOpen }: Props) => {
  return (
    <Button
      className="h-auto gap-1.5 rounded-md p-1"
      onClick={() => setOpen(true)}
      size="sm"
      variant="ghost"
    >
      <TagIcon className="size-4" />
    </Button>
  );
};
