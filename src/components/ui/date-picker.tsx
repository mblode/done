import { format } from "date-fns";
import { Calendar1Icon, CircleXIcon } from "lucide-react";
import * as React from "react";
import { useCallback } from "react";
import type { SelectSingleEventHandler } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = CalendarProps & {
  date?: Date;
  setDate: (value: Date | undefined) => void;
  isClearable?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
};

export const DatePicker = ({
  date,
  setDate,
  isClearable,
  disabled,
  children,
  ...props
}: Props) => {
  const [open, setOpen] = React.useState(false);

  const onDateSelect = useCallback(
    (date: Date | undefined) => {
      setDate(date);
      setOpen(false);
    },
    [setDate]
  ) as SelectSingleEventHandler;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      {children ? (
        <PopoverTrigger asChild>{children}</PopoverTrigger>
      ) : (
        <PopoverTrigger asChild>
          <div className="relative flex items-center">
            <Button
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={disabled}
              type="button"
              variant="input"
            >
              <Calendar1Icon className="mr-2 size-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>

            {!!date && isClearable && (
              <Button
                className="absolute top-0 right-0 flex flex-row gap-1 pr-3"
                onClick={() => setDate(undefined)}
                type="button"
                variant="ghost"
              >
                <CircleXIcon
                  className="text-muted-foreground/50"
                  height={20}
                  width={20}
                />
              </Button>
            )}
          </div>
        </PopoverTrigger>
      )}

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          {...props}
          mode="single"
          onSelect={onDateSelect}
          selected={date}
        />
      </PopoverContent>
    </Popover>
  );
};
