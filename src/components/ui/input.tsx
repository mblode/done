import { CircleXIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  clearClassName?: string;
  leftAddon?: React.ReactNode | null;
  rightAddon?: React.ReactNode | null;
  leftControl?: React.ReactNode | null;
  rightControl?: React.ReactNode | null;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      clearClassName,
      hasError,
      clearable,
      onClear,
      leftAddon,
      rightAddon,
      leftControl,
      rightControl,
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={cn("relative w-full", {
          "input-group": !!leftAddon || !!rightAddon,
        })}
      >
        {leftAddon && (
          <span className="shrink-0 cursor-pointer">{leftAddon}</span>
        )}

        {leftControl && (
          <div className="absolute left-3 flex h-full flex-row place-items-center items-center justify-center">
            {leftControl}
          </div>
        )}

        <div className="w-full">
          <input
            className={cn(
              "input flex h-[52px] w-full rounded-2xl border-[1.5px] border-input bg-card px-4 py-[14px] font-normal font-sans text-base text-foreground leading-snug ring-offset-background transition-colors placeholder:text-placeholder-foreground hover:border-input-hover focus:border-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              {
                "border-destructive-foreground": hasError,
                "pr-9": clearable && !!props.value,
                "hover:!border-input focus:!border-input": props.readOnly,
              },
              className
            )}
            ref={ref}
            {...props}
          />

          {clearable && !!props.value && (
            <div className="absolute top-0 right-0 flex flex-row gap-1 pr-3">
              <button
                aria-label="clear input"
                className={cn(
                  "!p-0 flex h-[52px] items-center justify-center text-muted-foreground",
                  clearClassName
                )}
                onClick={() => onClear?.()}
                tabIndex={-1}
                type="button"
              >
                <CircleXIcon
                  className="text-muted-foreground/50"
                  height={20}
                  width={20}
                />
              </button>
            </div>
          )}
        </div>

        {rightControl && (
          <div className="absolute top-0 right-3 flex h-full flex-row place-items-center items-center justify-center">
            {rightControl}
          </div>
        )}

        {rightAddon && <span className="cursor-pointer">{rightAddon}</span>}
      </label>
    );
  }
);
Input.displayName = "Input";

export { Input };
