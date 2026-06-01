import { cn } from "@/shared/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-petroleum text-[var(--color-text-invert)] hover:opacity-90",
  secondary:
    "bg-surface border border-[var(--color-border)] text-petroleum hover:bg-bg",
  ghost:
    "bg-transparent text-petroleum hover:bg-bg",
  danger:
    "text-white hover:opacity-90",
};

const dangerStyle = { backgroundColor: "#C0392B" } as const;

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "text-xs px-3 py-1.5 rounded-md",
  md: "text-sm px-4 py-2 rounded-lg",
  lg: "text-base px-5 py-2.5 rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  style,
  children,
  ...props
}: ButtonProps) {
  const isDanger = variant === "danger";

  return (
    <button
      style={isDanger ? { ...dangerStyle, ...style } : style}
      className={cn(
        "font-medium transition-colors inline-flex items-center justify-center gap-2",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-petroleum)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
