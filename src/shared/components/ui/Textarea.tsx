"use client";

import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

// Multi-line text field. forwardRef so react-hook-form's register() works.
// Focus ring is handled globally by the :focus-visible rule in globals.css.
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, id, style, ...rest }, ref) {
    const autoId = React.useId();
    const fieldId = id ?? autoId;
    const errorId = `${fieldId}-error`;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {label && (
          <label
            htmlFor={fieldId}
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--color-text)",
            }}
          >
            {label}
          </label>
        )}
        <textarea
          id={fieldId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          style={{
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            padding: "8px 12px",
            fontSize: "0.875rem",
            fontFamily: "inherit",
            color: "var(--color-text)",
            resize: "vertical",
            ...style,
          }}
          {...rest}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            style={{ color: "#C0392B", fontSize: "0.8125rem", margin: 0 }}
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
