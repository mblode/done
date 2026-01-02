import type { ReactNode } from "react";

import { PopoverContent } from "@/components/ui/popover";

interface PopoverWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const PopoverWrapper = ({
  title,
  description,
  children,
  className,
}: PopoverWrapperProps) => {
  return (
    <PopoverContent
      align="start"
      className={`w-80 rounded-lg p-4 shadow-lg ${className}`}
      sideOffset={5}
    >
      <div className="space-y-4">
        <h3 className="font-medium text-sm">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
        <div className="grid gap-2">{children}</div>
      </div>
    </PopoverContent>
  );
};
