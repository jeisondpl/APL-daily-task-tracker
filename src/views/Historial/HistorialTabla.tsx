"use client";

import { Fragment, useState } from "react";
import {
  Table,
  THead,
  TBody,
  Tr,
  Th,
  Td,
} from "@/shared/components/ui/Table";
import { Badge } from "@/shared/components/ui/Badge";
import { formatFechaLarga } from "@/shared/lib/utils";
import type { ITarea } from "@/modules/tareas/domain/entities/Tarea.entities";

const FONT = '"Inter", "Segoe UI", system-ui, sans-serif';

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function durMin(t: ITarea): number {
  return Math.max(0, toMin(t.horaFin) - toMin(t.horaInicio));
}
function fmtHoras(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

interface DiaGroup {
  fecha: string;
  tareas: ITarea[];
}

interface Props {
  grupos: DiaGroup[];
}

export function HistorialTabla({ grupos }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(fecha: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(fecha)) {
        next.delete(fecha);
      } else {
        next.add(fecha);
      }
      return next;
    });
  }

  if (grupos.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 200,
          color: "var(--color-text-soft)",
          fontFamily: FONT,
          fontSize: "0.875rem",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
        }}
      >
        Sin tareas registradas en este período.
      </div>
    );
  }

  return (
    <Table>
      <THead>
        <Tr className="border-0">
          <Th style={{ width: 32 }} />
          <Th>Fecha</Th>
          <Th style={{ width: 180 }}>Lista</Th>
          <Th style={{ textAlign: "center", width: 90 }}>Horas</Th>
          <Th style={{ textAlign: "center", width: 110 }}>Completadas</Th>
        </Tr>
      </THead>
      <TBody>
        {grupos.map(({ fecha, tareas }) => {
          const isOpen = expanded.has(fecha);
          const totalMin = tareas.reduce((acc, t) => acc + durMin(t), 0);
          const completadas = tareas.filter((t) => t.completada).length;

          return (
            <Fragment key={fecha}>
              {/* Parent row — day summary */}
              <Tr
                style={{
                  backgroundColor: "var(--color-surface)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => toggle(fecha)}
              >
                <Td
                  style={{
                    color: "var(--color-petroleum)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textAlign: "center",
                  }}
                >
                  {isOpen ? "▼" : "▶"}
                </Td>
                <Td
                  style={{
                    fontWeight: 600,
                    color: "var(--color-text)",
                    fontFamily: FONT,
                    textTransform: "capitalize",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {formatFechaLarga(fecha)}
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--color-text-soft)",
                        backgroundColor: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "999px",
                        padding: "1px 8px",
                      }}
                    >
                      {tareas.length} tarea{tareas.length !== 1 ? "s" : ""}
                    </span>
                  </span>
                </Td>
                <Td />
                <Td
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-soft)",
                    fontFamily: FONT,
                  }}
                >
                  {fmtHoras(totalMin)}
                </Td>
                <Td style={{ textAlign: "center" }}>
                  <Badge
                    variant={
                      completadas === tareas.length ? "success" : "warning"
                    }
                  >
                    {completadas}/{tareas.length}
                  </Badge>
                </Td>
              </Tr>

              {/* Child rows — individual tasks */}
              {isOpen &&
                tareas.map((t) => (
                  <Tr
                    key={t.id}
                    style={{ backgroundColor: "var(--color-bg)" }}
                  >
                    <Td />
                    <Td style={{ paddingLeft: "2rem" }}>
                      <span
                        style={{ display: "flex", alignItems: "center", gap: 8 }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: t.color ?? "var(--color-petroleum)",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            color: "var(--color-text)",
                            fontFamily: FONT,
                            fontSize: "0.8rem",
                          }}
                        >
                          {t.nombre}
                        </span>
                      </span>
                    </Td>
                    <Td
                      style={{
                        textAlign: "center",
                        color: "var(--color-text-soft)",
                        fontSize: "0.78rem",
                        fontFamily: FONT,
                      }}
                    >
                      {t.listaNombre ?? "—"}
                    </Td>
                    <Td
                      style={{
                        textAlign: "center",
                        color: "var(--color-text-soft)",
                        fontSize: "0.78rem",
                        fontFamily: FONT,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.horaInicio}–{t.horaFin}{" "}
                      <span style={{ opacity: 0.6 }}>
                        ({fmtHoras(durMin(t))})
                      </span>
                    </Td>
                    <Td style={{ textAlign: "center" }}>
                      <Badge variant={t.completada ? "success" : "neutral"}>
                        {t.completada ? "Completada" : "Pendiente"}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
            </Fragment>
          );
        })}
      </TBody>
    </Table>
  );
}
