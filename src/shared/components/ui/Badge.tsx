import { cn } from "@/shared/lib/utils";

export interface BadgeProps {
  variant?: "success" | "warning" | "info" | "neutral" | "danger";
  children: React.ReactNode;
  className?: string;
}

type StyleMap = {
  [K in NonNullable<BadgeProps["variant"]>]: React.CSSProperties;
};

const variantStyles: StyleMap = {
  success: { backgroundColor: "rgba(68,183,87,0.12)", color: "#2D8A3E" },
  warning: { backgroundColor: "rgba(229,104,19,0.12)", color: "#B85210" },
  info: { backgroundColor: "rgba(134,97,245,0.12)", color: "#6B45D4" },
  neutral: { backgroundColor: "rgba(170,170,159,0.2)", color: "#646459" },
  danger: { backgroundColor: "rgba(192,57,43,0.12)", color: "#C0392B" },
};

export function Badge({
  variant = "neutral",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      style={variantStyles[variant]}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}
