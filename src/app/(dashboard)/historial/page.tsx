"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HistorialView } from "@/views/Historial/HistorialView";

export default function HistorialPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const rol = session?.user?.rol;
  const isAdmin = rol === "Administrador" || rol === "ADMIN";

  useEffect(() => {
    if (status === "authenticated" && isAdmin) {
      router.replace("/dashboard");
    }
  }, [status, isAdmin, router]);

  if (status === "loading") {
    return (
      <p style={{ color: "var(--color-text-soft)" }}>Cargando…</p>
    );
  }
  if (isAdmin) return null;

  return <HistorialView />;
}
