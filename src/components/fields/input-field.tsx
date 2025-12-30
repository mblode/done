import type { ReactNode } from "react";
import { type Control, useController } from "react-hook-form";

import { FormControl } from "@/components/ui/form-control";
import { Input, type InputProps } from "@/components/ui/input";
import { useErrorState } from "@/hooks/use-error-state";

type Props = InputProps & {
  name: string;
  label?: ReactNode;
  caption?: ReactNode;
  control: Control<Record<string, unknown>>;
  className?: string;
  captionClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

export const InputField = ({
  label,
  name,
  control,
  caption,
  className,
  inputClassName,
  labelClassName,
  captionClassName,
  disabled,
  ...rest
}: Props) => {
  const { field, fieldState } = useController({ control, name });
  const hasError = useErrorState(fieldState, control);

  return (
    <FormControl
      label={label}
      caption={caption}
      error={hasError ? fieldState.error?.message : null}
      name={name}
      className={className}
      captionClassName={captionClassName}
      labelClassName={labelClassName}
    >
      <Input
        {...field}
        {...rest}
        id={name}
        hasError={hasError}
        className={inputClassName}
        disabled={disabled}
      />
    </FormControl>
  );
};
