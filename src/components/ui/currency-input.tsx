import { CircleXFilledIcon } from "lucide-react";
import * as React from "react";
import CurrencyInputField, {
  CurrencyInputProps,
} from "react-currency-input-field";

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

export const CurrencyInput = ({
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
}: CurrencyInputProps & InputProps) => {
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
        <CurrencyInputField
          className={cn(
            "input flex h-[52px] w-full rounded-2xl border-[1.5px] border-input bg-card px-4 py-[14px] font-sans font-normal text-base leading-snug text-foreground ring-offset-background placeholder:text-placeholder-foreground focus:outline-none focus:border-ring disabled:cursor-not-allowed disabled:opacity-50",
            {
              "border-destructive-foreground": hasError,
              "pr-9": clearable && !!props.value,
            },
            className,
          )}
          {...props}
        />

        {clearable && !!props.value && (
          <div className="absolute right-0 top-0 flex flex-row gap-1 pr-3">
            <button
              tabIndex={-1}
              className={cn(
                "flex h-[52px] items-center justify-center !p-0 text-muted-foreground",
                clearClassName,
              )}
              type="button"
              onClick={() => onClear?.()}
              aria-label="clear input"
            >
              <CircleXFilledIcon
                width={20}
                height={20}
                className="text-muted-foreground/50"
              />
            </button>
          </div>
        )}
      </div>

      {rightControl && (
        <div className="absolute right-3 top-0 flex h-full flex-row place-items-center items-center justify-center">
          {rightControl}
        </div>
      )}

      {rightAddon && <span className="cursor-pointer">{rightAddon}</span>}
    </label>
  );
};
