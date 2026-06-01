export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-row items-start justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <h1
          className="text-xl font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm" style={{ color: "var(--color-text-soft)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
