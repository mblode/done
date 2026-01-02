import { useBreakpoint } from "@/hooks/use-breakpoint";

import { Dialog } from "./dialog";
import { Sheet } from "./sheet";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  modal?: boolean;
  defaultOpen?: boolean;
}

export const ResponsiveSheet = ({
  open,
  onOpenChange,
  children,
  modal,
  defaultOpen,
}: Props) => {
  const breakpoint = useBreakpoint();
  const isDesktop = ["lg", "xl"].includes(breakpoint);

  if (!isDesktop) {
    return (
      <Sheet
        defaultOpen={defaultOpen}
        modal={modal}
        onOpenChange={onOpenChange}
        open={open}
      >
        {children}
      </Sheet>
    );
  }

  return (
    <Dialog
      defaultOpen={defaultOpen}
      modal={modal}
      onOpenChange={onOpenChange}
      open={open}
    >
      {children}
    </Dialog>
  );
};
