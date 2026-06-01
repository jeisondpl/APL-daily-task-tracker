import { cn } from "@/shared/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-card shadow-card border border-[var(--color-border)] p-5",
        hoverable && "hover:shadow-card-hover transition-shadow cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
