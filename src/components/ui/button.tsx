import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center whitespace-nowrap font-normal font-sans text-base transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:bg-primary/80",
        secondary:
          "border border-neutral-300 bg-background text-foreground hover:bg-neutral-200 active:bg-neutral-200 dark:border-neutral-600 dark:active:bg-neutral-600 dark:hover:bg-neutral-700",
        outline:
          "border border-foreground text-foreground hover:bg-neutral-200 active:bg-neutral-200 dark:active:bg-neutral-700 dark:hover:bg-neutral-800",
        muted:
          "border border-neutral-200 bg-neutral-200 text-foreground hover:border-neutral-200 hover:bg-neutral-200 active:border-neutral-300 active:bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-700 dark:active:border-neutral-600 dark:active:bg-neutral-600 dark:hover:border-neutral-700 dark:hover:bg-neutral-700",
        ghost:
          "text-neutral-700 hover:bg-neutral-200 active:bg-neutral-200 dark:text-neutral-300 dark:active:bg-neutral-700 dark:hover:bg-neutral-800",
        input:
          "!font-normal border-[1.5px] border-input bg-card text-base text-foreground ring-offset-background focus:border-ring focus:outline-none",
        link: "border border-transparent text-primary underline-offset-4 hover:underline",
        destructive:
          "border-red-600 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 dark:bg-red-500 dark:active:bg-red-300 dark:hover:bg-red-400",
        destructiveSecondary:
          "border border-red-300 bg-background text-red-600 hover:bg-red-100 active:bg-red-200 dark:border-red-600 dark:text-red-300 dark:active:bg-red-800 dark:hover:bg-red-900",
        success:
          "border-green-600 bg-green-500 text-white hover:bg-green-600 active:bg-green-700 dark:bg-green-500 dark:active:bg-green-300 dark:hover:bg-green-400",
        successSecondary:
          "border border-green-300 bg-background text-green-600 hover:bg-green-100 active:bg-green-200 dark:border-green-600 dark:text-green-300 dark:active:bg-green-800 dark:hover:bg-green-900",
        warning:
          "border-yellow-600 bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-500 dark:active:bg-yellow-300 dark:hover:bg-yellow-400",
        warningSecondary:
          "border border-yellow-300 bg-background text-yellow-600 hover:bg-yellow-100 active:bg-yellow-200 dark:border-yellow-600 dark:text-yellow-300 dark:active:bg-yellow-800 dark:hover:bg-yellow-900",
        info: "border-blue-600 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-500 dark:active:bg-blue-300 dark:hover:bg-blue-400",
        infoSecondary:
          "border border-blue-300 bg-background text-blue-600 hover:bg-blue-100 active:bg-blue-200 dark:border-blue-600 dark:text-blue-300 dark:active:bg-blue-800 dark:hover:bg-blue-900",
      },
      size: {
        lg: "h-[60px] rounded-[18px] px-4 font-semibold text-lg tracking-tight md:text-xl",
        default: "h-[52px] rounded-[16px] px-4 py-2 font-semibold",
        sm: "h-[36px] rounded-[12px] px-3 font-medium text-sm",
        xs: "h-[30px] rounded-[8px] px-2 font-medium text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), {
          "cursor-wait": loading,
        })}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <span
            className="invisible opacity-0"
            data-testid="button-is-loading-children"
          >
            {children}
          </span>
        ) : (
          children
        )}

        {loading && (
          <span
            className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
            data-testid="button-is-loading"
          >
            <Spinner size={20} strokeWidth={4} />
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

const ButtonDiv = ({
  className,
  variant,
  size,
  loading,
  children,
  style,
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <div
      className={cn("truncate", buttonVariants({ variant, size, className }), {
        "cursor-wait": loading,
        "pointer-events-none opacity-50": disabled,
      })}
      onClick={onClick as any}
      style={style}
    >
      {loading ? (
        <span
          className="invisible opacity-0"
          data-testid="button-is-loading-children"
        >
          {children}
        </span>
      ) : (
        children
      )}

      {loading && (
        <span
          className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
          data-testid="button-is-loading"
        >
          <Spinner size={20} strokeWidth={4} />
        </span>
      )}
    </div>
  );
};

export { Button, buttonVariants, ButtonDiv };
