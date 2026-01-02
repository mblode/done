import type { ReactNode } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

import { FormControl } from "@/components/ui/form-control";
import { Input, type InputProps } from "@/components/ui/input";
import { useErrorState } from "@/hooks/use-error-state";

type Props<T extends FieldValues = FieldValues> = InputProps & {
  name: Path<T>;
  label?: ReactNode;
  caption?: ReactNode;
  control: Control<T>;
  className?: string;
  captionClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

export const InputField = <T extends FieldValues = FieldValues>({
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
}: Props<T>) => {
  const { field, fieldState } = useController({ control, name });
  const hasError = useErrorState(fieldState, control);

  return (
    <FormControl
      caption={caption}
      captionClassName={captionClassName}
      className={className}
      error={hasError ? fieldState.error?.message : null}
      label={label}
      labelClassName={labelClassName}
      name={name}
    >
      <Input
        {...field}
        {...rest}
        className={inputClassName}
        disabled={disabled}
        hasError={hasError}
        id={name}
      />
    </FormControl>
  );
};
