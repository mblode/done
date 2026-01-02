import { Badge } from "../ui/badge";
import type { Task } from "./types";

interface Props {
  task: Task;
  setOpen: (open: boolean) => void;
}

export const TagList = ({ task, setOpen }: Props) => {
  return (
    <button
      className="flex w-full cursor-pointer flex-wrap items-center gap-1 pr-3 pb-3 pl-10 text-left"
      onClick={() => setOpen(true)}
      type="button"
    >
      {(task?.tags || []).map((tag) => (
        <Badge className="rounded-full text-xs" key={tag.id} variant="blue">
          <span>{tag.title}</span>
        </Badge>
      ))}
    </button>
  );
};
