"use client";

import { useSession } from "next-auth/react";
import { UsuariosView } from "@/views/Usuarios/UsuariosView";
import { PageHeader } from "@/shared/components/ui/PageHeader";

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const rol = session?.user?.rol;
  const isAdmin = rol === "Administrador" || rol === "ADMIN";

  if (status === "loading") {
    return <p style={{ color: "var(--color-text-soft)" }}>Cargando…</p>;
  }

  if (!isAdmin) {
    return (
      <div>
        <PageHeader title="Usuarios" />
        <p style={{ color: "#C0392B", fontSize: "0.95rem" }}>
          No tenés permiso para acceder a esta sección. Requiere rol
          Administrador.
        </p>
      </div>
    );
  }

  return <UsuariosView />;
}
