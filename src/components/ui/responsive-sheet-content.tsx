import type { MutableRefObject } from "react";

import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";

import { DialogContent } from "./dialog";
import { SheetContent } from "./sheet";

interface Props {
  children: React.ReactNode;
  ref?: MutableRefObject<any>;
  mobileClassName?: string;
  desktopClassName?: string;
  className?: string;
  overlayClassName?: string;
}

export const ResponsiveSheetContent = ({
  children,
  ref,
  mobileClassName,
  desktopClassName,
  overlayClassName,
  className,
}: Props) => {
  const breakpoint = useBreakpoint();
  const isDesktop = ["lg", "xl"].includes(breakpoint);

  if (!isDesktop) {
    return (
      <SheetContent
        className={cn(className, "rounded-t-[32px]", mobileClassName)}
        overlayClassName={overlayClassName}
        ref={ref}
        side="bottom"
      >
        {children}
      </SheetContent>
    );
  }

  return (
    <DialogContent
      className={cn(className, desktopClassName)}
      overlayClassName={overlayClassName}
      ref={ref}
    >
      {children}
    </DialogContent>
  );
};
