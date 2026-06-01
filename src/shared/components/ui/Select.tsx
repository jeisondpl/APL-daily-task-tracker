"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, className, children, ...props }, ref) => {
    const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const errorId = selectId ? `${selectId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error && errorId ? errorId : undefined}
          className={cn(
            "rounded-lg border border-[var(--color-border)] bg-surface px-3 py-2 text-sm",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-petroleum)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[#C0392B]",
            className
          )}
          {...props}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {children}
        </select>
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

Select.displayName = "Select";
