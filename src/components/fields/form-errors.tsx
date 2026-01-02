import { useMemo } from "react";
import type { FieldError, FieldErrors } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface Props {
  className?: string;
  errors: FieldErrors<Record<string, unknown>>;
}

const renderError = (key: string, error: FieldError | unknown, prefix = "") => {
  // Handle nested array of errors
  if (Array.isArray(error)) {
    return error.map((e, index) => {
      const errorKey = `${prefix}${key}[${index}]`;
      return (
        <div key={errorKey}>
          {Object.entries(e).map(([nestedKey, nestedError]) =>
            renderError(nestedKey, nestedError, `${errorKey}.`)
          )}
        </div>
      );
    });
  }

  // Handle single error
  return (
    <li key={`${prefix}${key}`}>
      {prefix}
      {key}: {String((error as { message?: string })?.message)}
    </li>
  );
};

export const FormErrors = ({ className, errors }: Props) => {
  const errorEntries = useMemo(() => Object.entries(errors), [errors]);

  if (errorEntries.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertTitle>Errors</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {errorEntries.map(([key, error]) => renderError(key, error))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
