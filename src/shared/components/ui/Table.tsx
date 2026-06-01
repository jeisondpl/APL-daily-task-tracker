import { cn } from "@/shared/lib/utils";

// --- Table root ---
export function Table({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table
        className={cn("w-full text-sm border-collapse", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

// --- THead ---
export function THead({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("bg-petroleum text-[var(--color-text-invert)]", className)}
      {...props}
    >
      {children}
    </thead>
  );
}

// --- TBody ---
export function TBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn(className)} {...props}>
      {children}
    </tbody>
  );
}

// --- Tr ---
export function Tr({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("border-t border-[var(--color-border)]", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

// --- Th ---
export function Th({
  className,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn("px-3 py-2 text-left font-medium", className)}
      {...props}
    >
      {children}
    </th>
  );
}

// --- Td ---
export function Td({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-3 py-2", className)} {...props}>
      {children}
    </td>
  );
}
