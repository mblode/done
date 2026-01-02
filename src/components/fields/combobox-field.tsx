import type { UseComboboxStateChange } from "downshift";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

import type { OnChangeParams } from "@/components/ui/combobox";
import { FormControl } from "@/components/ui/form-control";
import { useErrorState } from "@/hooks/use-error-state";

import { Combobox, type ComboboxOption } from "../ui/combobox";

interface Props<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label?: ReactNode;
  caption?: ReactNode;
  control: Control<T>;
  ariaLabel?: string;
  className?: string;
  placeholder?: string;
  options: ComboboxOption[];
  isLoading?: boolean;
  value?: ComboboxOption | undefined;
  onChange?: OnChangeParams;
  onInputChange?: OnChangeParams;
  clearable?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  error?: boolean;
  positive?: boolean;
  startOpen?: boolean;
  autoFocus?: boolean;
  maxDropdownHeight?: number;
  labelClassName?: string;
}

export const ComboboxField = <T extends FieldValues = FieldValues>({
  name,
  label,
  caption,
  options,
  control,
  onInputChange,
  onChange,
  ...props
}: Props<T>) => {
  const [items, setItems] = useState<ComboboxOption[]>(options);
  const { field, fieldState } = useController({ name, control });
  const hasError = useErrorState(fieldState, control);

  const handleInputChange = useCallback(
    (input: UseComboboxStateChange<ComboboxOption>) => {
      const lowerCasedInputValue = (input?.inputValue || "").toLowerCase();

      setItems(
        (options || []).filter(
          (option) =>
            !input?.inputValue ||
            (option.label || "").toLowerCase().includes(lowerCasedInputValue)
        )
      );
    },
    [options]
  );

  const handleClear = useCallback(() => {
    setItems(options);
  }, [options]);

  useEffect(() => {
    setItems(options);
  }, [options]);

  const getSelectValue = useCallback(
    (
      fieldValue: string | number,
      options: ComboboxOption[]
    ): ComboboxOption | undefined => {
      if (!fieldValue) {
        return undefined;
      }

      // value exists in options, render the option itself
      const existingOption = options.find(
        (option) => option && option.id === fieldValue
      );

      if (existingOption) {
        return existingOption;
      }

      return {
        id: fieldValue,
        label: String(fieldValue),
      };
    },
    []
  );

  const value = getSelectValue(field.value as string | number, options);

  return (
    <FormControl
      caption={caption}
      error={hasError ? fieldState.error?.message : null}
      label={label}
      name={name}
    >
      <Combobox
        {...field}
        {...props}
        id={name}
        onChange={(input) => {
          field.onBlur();
          field.onChange(input?.selectedItem ? input.selectedItem.id : null);
          onChange?.(input);
        }}
        onClear={handleClear}
        onInputChange={onInputChange ? onInputChange : handleInputChange}
        options={items}
        value={value}
      />
    </FormControl>
  );
};
