import type { ReactNode } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl } from "@/components/ui/form-control";
import { Switch } from "@/components/ui/switch";

interface Props<T extends FieldValues = FieldValues> {
  id?: string;
  name: Path<T>;
  label?: ReactNode;
  caption?: ReactNode;
  control: Control<T>;
  children?: ReactNode;
  disabled?: boolean;
  switchToggle?: boolean;
  onChange?: (value: boolean | "indeterminate") => void;
  className?: string;
  captionClassName?: string;
  labelClassName?: string;
}

export const CheckboxField = <T extends FieldValues = FieldValues>({
  id,
  name,
  label,
  caption,
  disabled,
  children,
  control,
  onChange,
  switchToggle,
  className,
  captionClassName,
  labelClassName,
  ...props
}: Props<T>) => {
  const { field, fieldState } = useController({ name, control });
  const hasError = !!fieldState.error;

  return (
    <FormControl
      caption={caption}
      captionClassName={captionClassName}
      className={className}
      error={hasError ? fieldState.error?.message : null}
      labelClassName={labelClassName}
      name={name}
    >
      <div className="flex items-center space-x-2">
        {switchToggle ? (
          <Switch
            checked={field.value as boolean}
            disabled={disabled}
            onCheckedChange={(value) => {
              field.onChange?.(value);
              onChange?.(value);
            }}
            {...props}
            {...field}
            id={id || name}
          />
        ) : (
          <Checkbox
            checked={field.value as boolean | "indeterminate"}
            disabled={disabled}
            onCheckedChange={(value) => {
              field.onChange?.(value);
              onChange?.(value);
            }}
            {...props}
            {...field}
            id={id || name}
          />
        )}

        <label
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor={name}
        >
          {label ?? children}
        </label>
      </div>
    </FormControl>
  );
};
