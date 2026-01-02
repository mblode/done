import * as PopoverPrimitive from "@radix-ui/react-popover";
import { type UseComboboxStateChange, useCombobox } from "downshift";
import { ChevronDownIcon } from "lucide-react";
import type React from "react";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

import { Input, type InputProps } from "./input";

export interface ComboboxOption {
  id?: string | number;
  label?: string;
  description?: string; // Added description field
}

export type OnChangeParams =
  | ((changes: UseComboboxStateChange<ComboboxOption>) => void)
  | undefined;

export interface ComboboxProps extends Omit<InputProps, "value" | "onChange"> {
  options: ComboboxOption[] | undefined;
  value?: ComboboxOption | undefined;
  onChange?: OnChangeParams;
  onInputChange?: OnChangeParams;
  isLoading?: boolean;
  startOpen?: boolean;
  leftIcon?: ReactNode;
  clearable?: boolean;
  children?: ReactNode;
  noResults?: ReactNode;
  clearInputValue?: () => void;
  ref?: any;
}

export interface ComboboxRef {
  clearInput: () => void;
  closeMenu: () => void;
  selectItem: (option: ComboboxOption) => void;
  inputValue: string;
}

export const Combobox: React.FC<ComboboxProps> = forwardRef(
  (
    {
      options,
      value,
      onChange,
      onInputChange,
      startOpen = false,
      onClear,
      leftIcon,
      clearable = false,
      noResults,
      children,
      ...inputProps
    },
    ref
  ) => {
    const {
      isOpen,
      getInputProps,
      getMenuProps,
      highlightedIndex,
      getItemProps,
      selectItem,
      inputValue,
      setInputValue,
      closeMenu,
    } = useCombobox({
      items: options || [],
      itemToString: (item: ComboboxOption | null) => item?.label || "",
      initialSelectedItem: value,
      onInputValueChange: onInputChange,
      onSelectedItemChange: onChange,
      initialIsOpen: startOpen,
      defaultHighlightedIndex: 0,
    });

    const comboboxRef = useRef<HTMLInputElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);

    const clearInput = useCallback(() => {
      setInputValue("");
      if (onClear) {
        onClear();
      }
    }, [onClear, setInputValue]);

    useImperativeHandle(
      ref,
      () =>
        ({
          clearInput,
          closeMenu,
          selectItem,
          inputValue,
        }) as ComboboxRef,
      [clearInput, closeMenu, inputValue, selectItem]
    );

    return (
      <PopoverPrimitive.Root defaultOpen={startOpen} open={isOpen}>
        <PopoverPrimitive.Anchor asChild>
          <div className="relative w-full">
            <Input
              className={cn({
                "pl-10": !!leftIcon,
              })}
              clearable={clearable}
              onClear={() => {
                selectItem({});
                onClear?.();
              }}
              {...getInputProps({}, { suppressRefError: true })}
              {...inputProps}
              ref={comboboxRef}
            />
            <div className="absolute top-4 right-3">
              {((clearable && inputValue.length === 0) || !clearable) && (
                <ChevronDownIcon height={20} width={20} />
              )}
            </div>

            <div className="absolute top-4 left-3">{leftIcon}</div>
          </div>
        </PopoverPrimitive.Anchor>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            asChild
            className="fade-in-80 relative z-[110] max-h-[250px] min-w-32 translate-y-1 animate-in overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg"
            onInteractOutside={(event) => {
              const target = event.target as Element | null;
              const isCombobox = target === comboboxRef.current;
              const inListbox = target && listboxRef.current?.contains(target);
              if (isCombobox || inListbox) {
                event.preventDefault();
              }
            }}
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <div
              className="w-full overflow-y-auto p-1"
              {...getMenuProps({}, { suppressRefError: true })}
            >
              {children}

              {(options || []).map((item, index) => {
                const escapeRegExp = (string: string) => {
                  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                };

                const labelParts = item.label?.split(
                  new RegExp(`(${escapeRegExp(inputValue)})`, "gi")
                );

                return (
                  <div
                    className={cn("cursor-pointer rounded-lg px-4 py-2", {
                      "bg-accent text-accent-foreground":
                        highlightedIndex === index,
                    })}
                    key={`${item.id}${index}`}
                    {...getItemProps({
                      item,
                      index,
                    })}
                  >
                    <div>
                      {labelParts?.map((part, i) =>
                        part.toLowerCase() === inputValue.toLowerCase() ? (
                          <strong key={i}>{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                    {item.description && (
                      <div className="text-muted-foreground text-sm">
                        {item.description}
                      </div>
                    )}
                  </div>
                );
              })}

              {(options || []).length === 0 &&
                (noResults ? (
                  noResults
                ) : (
                  <div className="cursor-not-allowed px-4 py-3 text-center">
                    <div className="text-muted-foreground">No results</div>
                  </div>
                ))}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  }
);
