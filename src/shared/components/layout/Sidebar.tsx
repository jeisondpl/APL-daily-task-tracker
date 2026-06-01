"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";

const NAV_ITEMS = [
  { href: "/tareas", label: "Tareas" },
  { href: "/listas", label: "Listas" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="flex flex-col w-56 min-h-full bg-deep-navy px-3 py-5 gap-1"
    >
      {/* Brand */}
      <p
        className="text-sm font-semibold tracking-wide px-2 mb-4"
        style={{ color: "var(--color-text-invert)" }}
      >
        Daily Tracker
      </p>

      {NAV_ITEMS.map(({ href, label }) => {
        const isActive = pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-petroleum)]",
              isActive
                ? "bg-petroleum text-[var(--color-text-invert)]"
                : "hover:bg-[rgba(0,66,84,0.4)]"
            )}
            style={
              !isActive ? { color: "var(--color-warm-gray)" } : undefined
            }
          >
            {/* Active indicator dot */}
            {isActive && (
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: "var(--color-success)" }}
                aria-hidden="true"
              />
            )}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
