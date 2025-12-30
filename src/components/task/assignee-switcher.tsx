import { useCombobox } from "downshift";
import { Check, ChevronDown, User } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { UserRow } from "@/schema";

type Props = {
  members: readonly UserRow[];
  selectedAssigneeId?: string | null;
  onAssigneeChange: (member: string | null) => void;
};

export const AssigneeSwitcher = ({
  members,
  selectedAssigneeId,
  onAssigneeChange,
}: Props) => {
  const [inputValue, setInputValue] = React.useState("");
  const membersList = React.useMemo(() => [...members], [members]);
  const filteredMembers = React.useMemo(() => {
    const normalizedInput = inputValue.trim().toLowerCase();
    if (!normalizedInput) return membersList;

    return membersList.filter((member) =>
      member.username.toLowerCase().includes(normalizedInput)
    );
  }, [inputValue, membersList]);

  const items = React.useMemo<Array<UserRow | null>>(() => {
    if (inputValue.length === 0) {
      return [null, ...filteredMembers];
    }
    return [...filteredMembers];
  }, [filteredMembers, inputValue]);

  const selectedItem =
    membersList.find((member) => selectedAssigneeId === member?.id) ?? null;

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox<UserRow | null>({
    items,
    selectedItem,
    inputValue,
    onSelectedItemChange: ({ selectedItem }) => {
      onAssigneeChange(selectedItem?.id ?? null);
    },
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue || "");
    },
    itemToString: (item) => item?.username ?? "",
  });

  return (
    <div className="relative w-[200px]">
      <div className="flex flex-col gap-1">
        {/* biome-ignore lint/a11y/noLabelWithoutControl: downshift getLabelProps handles association */}
        <label {...getLabelProps()} className="sr-only">
          Assign to
        </label>
        <div className="relative">
          <div
            className={cn(
              "flex items-center rounded-lg border border-input bg-background",
              isOpen && "ring-2 ring-ring ring-offset-2"
            )}
          >
            <input
              {...getInputProps()}
              className="w-full rounded-lg bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search assignee..."
            />
            <button
              {...getToggleButtonProps()}
              aria-label="toggle menu"
              className="flex h-full items-center border-l border-input px-2"
            >
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        {...getMenuProps()}
        className={cn(
          "absolute z-50 mt-1 max-h-[300px] w-full overflow-auto rounded-lg border border-input bg-popover shadow-md",
          "animate-in fade-in-0 zoom-in-95",
          !isOpen && "hidden"
        )}
      >
        <div className="p-1">
          {items.map((member, index) => {
            if (!member) {
              return (
                <div
                  key="no-assignee"
                  {...getItemProps({
                    item: null,
                    index,
                  })}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    highlightedIndex === index
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <User className="size-4" />
                  <span>No Assignee</span>
                  {!selectedAssigneeId && <Check className="ml-auto size-4" />}
                </div>
              );
            }

            const initials = member.username
              .split(" ")
              .filter(Boolean)
              .map((word) => word[0]?.toUpperCase() ?? "")
              .join("");

            return (
              <div
                key={member.id}
                {...getItemProps({
                  item: member,
                  index,
                })}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                  highlightedIndex === index
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div className="relative size-6 rounded-full bg-muted">
                  <span className="flex size-full items-center justify-center text-xs">
                    {initials}
                  </span>
                </div>
                <span>{member.username}</span>
                {selectedAssigneeId === member.id && (
                  <Check className="ml-auto size-4" />
                )}
              </div>
            );
          })}

          {inputValue.length > 0 && filteredMembers.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
