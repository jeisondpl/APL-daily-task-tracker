"use client";

import type { ITarea } from "@/modules/tareas/domain/entities/Tarea.entities";
import { formatFechaLarga } from "@/shared/lib/utils";

function generateSlots(from: string, to: string, stepMin: number): string[] {
  const out: string[] = [];
  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);
  let cur = fh * 60 + fm;
  const end = th * 60 + tm;
  while (cur < end) {
    const h = Math.floor(cur / 60),
      m = cur % 60;
    out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    cur += stepMin;
  }
  return out;
}

const SLOTS = generateSlots("08:00", "18:00", 30);

function slotInRange(slot: string, hIni: string, hFin: string): boolean {
  return slot >= hIni && slot < hFin;
}

interface Props {
  tareas: ITarea[];
}

export function TareasTimelineView({ tareas }: Props) {
  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: "0.5rem",
        border: "1px solid var(--color-border)",
      }}
    >
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          minWidth: `${80 + 180 + SLOTS.length * 52}px`,
          fontSize: "0.75rem",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "var(--color-petroleum)",
                color: "var(--color-text-invert)",
                padding: "8px 12px",
                textAlign: "left",
                whiteSpace: "nowrap",
                border: "1px solid var(--color-border)",
                fontWeight: 600,
              }}
            >
              Fecha
            </th>
            <th
              style={{
                backgroundColor: "var(--color-petroleum)",
                color: "var(--color-text-invert)",
                padding: "8px 12px",
                textAlign: "left",
                whiteSpace: "nowrap",
                border: "1px solid var(--color-border)",
                fontWeight: 600,
                minWidth: "180px",
              }}
            >
              Tarea
            </th>
            {SLOTS.map((slot) => (
              <th
                key={slot}
                style={{
                  backgroundColor: "var(--color-petroleum)",
                  color: "var(--color-text-invert)",
                  padding: "6px 4px",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  border: "1px solid var(--color-border)",
                  fontWeight: 500,
                  width: "52px",
                }}
              >
                {slot}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tareas.length === 0 ? (
            <tr>
              <td
                colSpan={2 + SLOTS.length}
                style={{
                  padding: "32px",
                  textAlign: "center",
                  color: "var(--color-text-soft)",
                  border: "1px solid var(--color-border)",
                }}
              >
                No hay tareas para este día. ¡Agregá una arriba!
              </td>
            </tr>
          ) : (
            tareas.map((t) => (
              <tr
                key={t.id}
                style={{
                  backgroundColor: t.completada
                    ? "var(--color-warm-gray)"
                    : "var(--color-surface)",
                }}
              >
                <td
                  style={{
                    padding: "8px 12px",
                    whiteSpace: "nowrap",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-soft)",
                    fontSize: "0.7rem",
                  }}
                >
                  {formatFechaLarga(t.fecha)}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                    fontWeight: 500,
                    textDecoration: t.completada ? "line-through" : "none",
                  }}
                >
                  {t.nombre}
                  {t.listaNombre && (
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.65rem",
                        color: "var(--color-text-soft)",
                        fontWeight: 400,
                      }}
                    >
                      {t.listaNombre}
                    </span>
                  )}
                </td>
                {SLOTS.map((slot) => {
                  const active =
                    t.horaInicio && t.horaFin
                      ? slotInRange(slot, t.horaInicio, t.horaFin)
                      : false;
                  return (
                    <td
                      key={slot}
                      aria-label={
                        active ? `${t.nombre} — ${slot}` : undefined
                      }
                      style={{
                        border: "1px solid var(--color-border)",
                        backgroundColor: active
                          ? (t.color ?? "var(--color-accent-purple)")
                          : "transparent",
                        transition: "background-color 0.1s",
                      }}
                    />
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
