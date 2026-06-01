"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    // Derive a stable id for label/aria associations when caller doesn't provide one.
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error && errorId ? errorId : undefined}
          className={cn(
            "rounded-lg border border-[var(--color-border)] bg-surface px-3 py-2 text-sm",
            "placeholder:text-[var(--color-text-soft)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-petroleum)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[#C0392B]",
            className
          )}
          {...props}
        />
        {error && errorId && (
          <p
            id={errorId}
            role="alert"
            className="text-xs"
            style={{ color: "#C0392B" }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
