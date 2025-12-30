import type { UseComboboxStateChange } from "downshift";
import { type ReactNode, useCallback, useState } from "react";
import { type Control, useController } from "react-hook-form";

import type { OnChangeParams } from "@/components/ui/combobox";
import { FormControl } from "@/components/ui/form-control";
import { useErrorState } from "@/hooks/use-error-state";

import { Combobox, type ComboboxOption } from "../ui/combobox";

type Props = {
  name: string;
  label?: ReactNode;
  caption?: ReactNode;
  control: Control<Record<string, unknown>>;
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
  setValue?: (value: string) => void;
};

export const ComboboxFreeformField = ({
  name,
  label,
  caption,
  options,
  control,
  onChange,
  setValue,
  ...props
}: Props) => {
  const [items, setItems] = useState<ComboboxOption[]>(options);
  const { field, fieldState } = useController({ name, control });
  const hasError = useErrorState(fieldState, control);

  const handleInputChange = useCallback(
    (input: UseComboboxStateChange<ComboboxOption>) => {
      const value = input?.inputValue || "";
      const lowerCasedInputValue = value.toLowerCase();

      const lowerCasedSelectedValue = String(
        input.selectedItem?.id
      ).toLowerCase();

      const hasSelected = lowerCasedSelectedValue === lowerCasedInputValue;

      const newOptions = (options || []).filter((option) => {
        if (
          !(option.label || "").toLowerCase().includes(lowerCasedInputValue)
        ) {
          return hasSelected;
        }

        if ((option.label || "").toLowerCase() === value.toLowerCase()) {
          return false;
        }

        return true;
      });

      if (value) {
        newOptions.unshift({
          id: value,
          label: value,
        });
      }

      setItems(newOptions);

      setValue(value);
    },
    [options, setValue]
  );

  const handleClear = useCallback(() => {
    setItems(options);
  }, [options]);

  const handleChange = useCallback(
    (input: UseComboboxStateChange<ComboboxOption>) => {
      field.onBlur();
      field.onChange(input?.selectedItem ? input.selectedItem.id : null);
      onChange?.(input);

      const value = String(input?.selectedItem?.id || "");

      setValue(value);
    },
    [field, onChange, setValue]
  );

  const getSelectValue = useCallback(
    (
      fieldValue: string | number,
      options: ComboboxOption[]
    ): ComboboxOption | undefined => {
      if (!fieldValue) return undefined;

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

  const value = getSelectValue(field.value, options);

  return (
    <FormControl
      label={label}
      caption={caption}
      error={hasError ? fieldState.error?.message : null}
      name={name}
    >
      <Combobox
        {...field}
        {...props}
        id={name}
        options={items}
        value={value}
        onClear={handleClear}
        onInputChange={handleInputChange}
        onChange={handleChange}
      />
    </FormControl>
  );
};
