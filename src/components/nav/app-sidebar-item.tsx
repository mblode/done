import { useDroppable } from "@dnd-kit/core";
import type { LucideProps } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

import { cn } from "@/lib/utils";

import { useDndContext } from "../dnd/dnd-context";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export interface AppSidebarItemType {
  id: string;
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

interface Props {
  item: AppSidebarItemType;
  count: number | undefined;
  isActive?: boolean;
}

export const AppSidebarItem = observer(({ item, count, isActive }: Props) => {
  const { isDragging } = useDndContext();
  const { setNodeRef, isOver } = useDroppable({
    disabled: isActive,
    id: item.id,
    data: {
      type: "bucket",
      listData: { id: item.id },
    },
  });

  return (
    <SidebarMenuItem
      className={cn("w-full rounded-[8px]", {
        "ring-2 ring-blue-200": isOver && isDragging,
        "hover:bg-muted": !isOver,
      })}
      ref={setNodeRef}
    >
      <SidebarMenuButton asChild isActive={isActive}>
        <Link className="flex items-center gap-2" href={item.url}>
          <item.icon className="size-4" />

          <div className="flex-1">
            <span className="font-medium">{item.title}</span>
          </div>

          {(count || 0) > 0 && (
            <span className="font-medium text-muted-foreground text-xs">
              {count}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});
