import { addMonths, format } from "date-fns";
import { Calendar1Icon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
  date: DateRange | undefined;
  setDate: (value: DateRange | undefined) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const DateRangePicker = ({ className, date, setDate }: Props) => {
  const [currentDate, setCurrentDate] = React.useState(date);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "!font-normal justify-start text-left",
              !currentDate && "text-muted-foreground"
            )}
            id="date"
            variant="secondary"
          >
            <Calendar1Icon className="mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            defaultMonth={currentDate?.from}
            initialFocus
            mode="range"
            numberOfMonths={1}
            onSelect={setCurrentDate}
            selected={currentDate}
            toDate={addMonths(new Date(), 6)}
          />

          <div className="mb-2 px-4">
            <Button onClick={() => setDate(currentDate)} size="sm">
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
