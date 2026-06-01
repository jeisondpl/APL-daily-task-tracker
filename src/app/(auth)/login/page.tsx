"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/shared/components/ui/Card";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMsg("Credenciales inválidas. Verificá tu email y contraseña.");
      setLoading(false);
      return;
    }

    router.push("/tareas");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg)",
        padding: "24px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px 32px",
        }}
      >
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--color-deep-navy)",
          }}
        >
          APL Tacks
        </h1>
        <p
          style={{
            margin: "0 0 28px",
            color: "var(--color-text-soft)",
            fontSize: "0.875rem",
          }}
        >
          Iniciá sesión para continuar
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {errorMsg && (
            <p
              role="alert"
              style={{
                color: "var(--color-danger, #c0392b)",
                fontSize: "0.875rem",
                margin: 0,
              }}
            >
              {errorMsg}
            </p>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@local"
            required
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            style={{ width: "100%", marginTop: "4px" }}
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </Button>
        </form>

        <p
          style={{
            marginTop: "20px",
            fontSize: "0.75rem",
            color: "var(--color-text-soft)",
            textAlign: "center",
          }}
        >
          Demo: <strong>admin@local</strong> / <strong>Demo2026!</strong>
        </p>
      </Card>
    </div>
  );
}
