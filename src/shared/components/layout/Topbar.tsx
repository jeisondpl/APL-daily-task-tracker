"use client";

import { useSession, signOut } from "next-auth/react";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export function Topbar({ children }: { children?: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <header className="min-h-[56px] bg-surface border-b border-[var(--color-border)] flex items-center justify-between px-6">
      {/* Left slot */}
      <div>{children}</div>

      {/* Right: role chip + sign-out */}
      <div className="flex items-center gap-3">
        {session?.user?.rol && (
          <Badge variant="info">{session.user.rol as string}</Badge>
        )}
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
