"use client";

import React, { useEffect, useId, useRef } from "react";
import { cn } from "@/shared/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // Store the element that was focused before the modal opened so we can restore it on close.
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    // Move focus into the panel on the next tick so the DOM is painted.
    const frame = requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(frame);
      // Restore focus when the modal unmounts or closes.
      previousFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0,37,50,0.55)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        zIndex: "var(--z-modal-backdrop)" as string,
      }}
      // Close when clicking the backdrop directly (not the panel).
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "bg-surface rounded-card shadow-card-hover",
          "w-full max-w-lg mx-4 flex flex-col",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-petroleum)]",
          // Suppress default outline from tabIndex — only show on keyboard nav.
          "outline-none focus:outline-none"
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2
            id={titleId}
            className="text-base font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {title}
          </h2>
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className={cn(
              "rounded-md p-1 transition-colors text-[var(--color-text-soft)] hover:bg-bg",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-petroleum)]"
            )}
          >
            {/* Simple X icon via SVG — no external dep needed */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-[var(--color-border)] flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
