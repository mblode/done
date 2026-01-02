import { CircleXIcon } from "lucide-react";
import * as React from "react";
import TextareaAutosize from "react-textarea-autosize";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  hasError?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  clearClassName?: string;
  leftAddon?: React.ReactNode | null;
  rightAddon?: React.ReactNode | null;
  leftControl?: React.ReactNode | null;
  rightControl?: React.ReactNode | null;
  minRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      onClear,
      clearable,
      hasError,
      leftAddon,
      rightAddon,
      clearClassName,
      leftControl,
      rightControl,
      minRows,
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={cn("relative w-full", {
          "input-group": !!leftAddon || !!rightAddon,
        })}
        htmlFor={props.id}
      >
        {leftAddon && <span>{leftAddon}</span>}

        {leftControl && (
          <div className="absolute left-3 flex h-full flex-row place-items-center items-center justify-center">
            {leftControl}
          </div>
        )}

        <TextareaAutosize
          className={cn(
            "flex h-[52px] w-full rounded-2xl border-[1.5px] border-input bg-card px-4 py-[14px] font-normal font-sans text-base text-foreground leading-snug ring-offset-background transition-colors placeholder:text-placeholder-foreground hover:border-input-hover focus:border-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            {
              "border-destructive-foreground": hasError,
              "pr-9": clearable && !!props.value,
              "pr-12": clearable && !!props.value && rightControl,
            },
            className
          )}
          minRows={minRows}
          ref={ref}
          {...props}
        />

        {clearable && !!props.value && (
          <div className="absolute top-0 right-0">
            <button
              aria-label="clear input"
              className={cn(
                "!p-0 flex h-[52px] w-10 items-center justify-center text-muted-foreground",
                clearClassName
              )}
              onClick={() => onClear?.()}
              tabIndex={-1}
              type="button"
            >
              <CircleXIcon
                className="text-muted-foreground/50"
                height={16}
                width={16}
              />
            </button>
          </div>
        )}

        {rightControl && (
          <div
            className={cn("absolute top-4 right-3", {
              "right-9": clearable && !!props.value,
            })}
          >
            {rightControl}
          </div>
        )}

        {rightAddon && <span>{rightAddon}</span>}
      </label>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
