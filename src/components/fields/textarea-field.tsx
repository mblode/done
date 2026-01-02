import type { ReactNode } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

import { FormControl } from "@/components/ui/form-control";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { useErrorState } from "@/hooks/use-error-state";

interface Props<T extends FieldValues = FieldValues> extends TextareaProps {
  name: Path<T>;
  label?: ReactNode;
  caption?: ReactNode;
  control: Control<T>;
  minRows?: number;
  className?: string;
  captionClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export const TextareaField = <T extends FieldValues = FieldValues>({
  label,
  name,
  caption,
  control,
  disabled,
  className,
  labelClassName,
  inputClassName,
  captionClassName,
  ...rest
}: Props<T>) => {
  const { field, fieldState } = useController({ name, control });
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
      <Textarea
        {...field}
        {...rest}
        className={inputClassName}
        disabled={disabled}
        hasError={hasError}
        id={name}
        value={field.value as string}
      />
    </FormControl>
  );
};
