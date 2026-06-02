"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/shared/components/ui/Button";

function initials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

export function Topbar({ children }: { children?: React.ReactNode }) {
  const { data: session } = useSession();
  const name = session?.user?.name ?? session?.user?.email ?? "Usuario";
  const rol = session?.user?.rol as string | undefined;

  return (
    <header className="min-h-[56px] bg-surface border-b border-[var(--color-border)] flex items-center justify-between px-6">
      {/* Left slot */}
      <div>{children}</div>

      {/* Right: user identity + sign-out */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              backgroundColor: "var(--color-petroleum)",
              color: "var(--color-text-invert)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials(name)}
          </span>
          <span className="flex flex-col leading-tight">
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--color-text)",
              }}
            >
              {name}
            </span>
            {rol && (
              <span
                style={{ fontSize: "0.72rem", color: "var(--color-text-soft)" }}
              >
                {rol}
              </span>
            )}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Salir
        </Button>
      </div>
    </header>
  );
}
