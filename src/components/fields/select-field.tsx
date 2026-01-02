import { type ReactNode, useRef } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useDimensions } from "@/hooks/use-dimensions";
import { useErrorState } from "@/hooks/use-error-state";

interface SelectOption {
  id: string | number;
  label: string | ReactNode;
  description?: string;
  caption?: string;
}

interface Props<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label?: ReactNode;
  caption?: ReactNode;
  control: Control<T>;
  placeholder?: ReactNode;
  className?: string;
  options: SelectOption[];
  maxDropdownHeight?: number;
  onValueChange?: (value: string | number) => void;
  clearable?: boolean;
  isInt?: boolean;
  disabled?: boolean;
}

export const SelectField = <T extends FieldValues = FieldValues>({
  name,
  label,
  caption,
  options,
  placeholder = "Please select an option",
  control,
  className,
  maxDropdownHeight = 250,
  onValueChange,
  clearable,
  isInt,
  ...props
}: Props<T>) => {
  const { field, fieldState } = useController({ name, control });
  const hasError = useErrorState(fieldState, control);
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(ref);

  return (
    <div ref={ref}>
      <FormControl
        caption={caption}
        className={className}
        error={hasError ? fieldState.error?.message : null}
        label={label}
        name={name}
      >
        <Select
          {...field}
          {...props}
          defaultValue={
            isInt ? String(field.value) : (field.value as string | undefined)
          }
          onValueChange={(value) => {
            field.onBlur();
            field.onChange(isInt ? Number.parseInt(value, 10) : value);
            onValueChange?.(isInt ? Number.parseInt(value, 10) : value);
          }}
          // error={hasError}
          value={
            isInt ? String(field.value) : (field.value as string | undefined)
          }
        >
          <SelectTrigger>
            {options.find((option) => option.id === field.value)?.label ||
              placeholder}
          </SelectTrigger>

          <SelectContent style={{ maxHeight: maxDropdownHeight }}>
            <SelectGroup>
              {options.map((option) => {
                return (
                  <SelectItem
                    id={String(option.id)}
                    key={String(option.id)}
                    style={{ maxWidth: width }}
                    value={String(option.id)}
                  >
                    {option.label && (
                      <div className="mb-1 text-wrap">{option.label}</div>
                    )}
                    {option.description && (
                      <div className="mb-1 text-wrap text-sm">
                        {option.description}
                      </div>
                    )}
                    {option.caption && (
                      <div className="text-wrap text-sm opacity-60">
                        {option.caption}
                      </div>
                    )}
                  </SelectItem>
                );
              })}
            </SelectGroup>

            {clearable && (
              <div>
                <Button
                  className="px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onBlur();
                    field.onChange("");
                    onValueChange?.("");
                  }}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Clear
                </Button>
              </div>
            )}
          </SelectContent>
        </Select>
      </FormControl>
    </div>
  );
};
