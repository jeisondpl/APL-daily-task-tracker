"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const STATS = [
  { value: "18h", label: "Jornada" },
  { value: "∞", label: "Listas" },
  { value: "30m", label: "Slots" },
];

function Wordmark({ invert = false }: { invert?: boolean }) {
  const color = invert ? "var(--color-text-invert)" : "var(--color-petroleum)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span
        aria-hidden="true"
        className="bg-petroleum"
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 800,
          fontSize: "1rem",
          ...(invert
            ? { backgroundColor: "rgba(255,255,255,0.12)" }
            : {}),
        }}
      >
        DT
      </span>
      <span style={{ fontWeight: 800, fontSize: "1.05rem", color, letterSpacing: -0.3 }}>
        Daily Task Tracker
      </span>
    </span>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("Credenciales incorrectas. Verificá tu email y contraseña.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: branding (desktop only) ── */}
      <aside
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between bg-deep-navy"
        style={{ padding: "48px" }}
      >
        {/* Decorative circles (purely visual) */}
        <span
          aria-hidden="true"
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-petroleum opacity-10"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-petroleum opacity-10"
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 -right-10 w-40 h-40 rounded-full bg-white opacity-5"
        />

        {/* Logo */}
        <div className="relative z-10">
          <Wordmark invert />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-6 max-w-md">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
              aria-hidden="true"
            />
            Daily Task Tracker
          </span>

          <h1 className="text-4xl font-bold text-white leading-tight">
            Organizá tu día
            <br />
            <span style={{ color: "var(--color-warm-gray)" }}>hora por hora</span>
          </h1>

          <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Planificá tus tareas en un timeline visual, organizalas por listas y
            mantené el foco en lo que importa.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl px-4 py-3 text-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          © {new Date().getFullYear()} INDRA · APL — Todos los derechos reservados
        </p>
      </aside>

      {/* ── Right panel: form ── */}
      <main
        className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Wordmark />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
              Bienvenido de nuevo
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-soft)" }}>
              Iniciá sesión para continuar con tu trabajo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ backgroundColor: "rgba(192,57,43,0.08)", color: "#C0392B" }}
              >
                <span aria-hidden="true">⚠</span>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@daily.com"
                className="rounded-xl px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-petroleum)]"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-petroleum)]"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-petroleum)] mt-2"
              style={{ backgroundColor: "var(--color-petroleum)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  Verificando…
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
