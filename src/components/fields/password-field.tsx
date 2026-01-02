import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

import { FormControl } from "@/components/ui/form-control";
import { Input, type InputProps } from "@/components/ui/input";
import { useErrorState } from "@/hooks/use-error-state";

interface Props<T extends FieldValues = FieldValues>
  extends Exclude<InputProps, "type"> {
  name: Path<T>;
  label?: ReactNode;
  labelRight?: ReactNode;
  caption?: ReactNode;
  controlLeft?: ReactNode;
  control: Control<T>;
}

export const PasswordField = <T extends FieldValues = FieldValues>({
  label,
  labelRight,
  name,
  caption,
  controlLeft,
  control,
  ...rest
}: Props<T>) => {
  const { field, fieldState } = useController({ name, control });
  const hasError = useErrorState(fieldState, control);

  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );

  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <FormControl
      caption={caption}
      controlLeft={controlLeft}
      error={hasError ? fieldState.error?.message : null}
      label={label}
      labelRight={labelRight}
      name={name}
    >
      <div className="relative">
        <Input
          {...field}
          {...rest}
          hasError={hasError}
          id={name}
          style={{
            width: "calc(100% - 49px)",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
          type={passwordType}
        />

        <button
          className="absolute inset-y-0 right-0 flex h-[52px] items-center rounded-r-2xl border border-input bg-muted px-3 text-foreground text-sm"
          onClick={togglePassword}
          type="button"
        >
          {passwordType === "password" ? (
            <EyeIcon className="size-6" />
          ) : (
            <EyeOffIcon className="size-6" />
          )}
        </button>
      </div>
    </FormControl>
  );
};
