"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ITarea } from "@/modules/tareas/domain/entities/Tarea.entities";

const FONT = '"Inter", "Segoe UI", system-ui, sans-serif';

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
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

export function HorasXDiaBar({ grupos }: Props) {
  // Aggregate all tasks in the range by nombre, summing minutes across days.
  const data = useMemo(() => {
    const map = new Map<string, { nombre: string; color: string; minutes: number; count: number }>();
    for (const { tareas } of grupos) {
      for (const t of tareas) {
        const dur = Math.max(0, toMin(t.horaFin) - toMin(t.horaInicio));
        const existing = map.get(t.nombre);
        if (existing) {
          existing.minutes += dur;
          existing.count += 1;
        } else {
          map.set(t.nombre, {
            nombre: t.nombre,
            color: t.color ?? "var(--color-petroleum)",
            minutes: dur,
            count: 1,
          });
        }
      }
    }
    return [...map.values()]
      .map((e) => ({ ...e, horas: +(e.minutes / 60).toFixed(2) }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [grupos]);

  if (data.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "16px",
        fontFamily: FONT,
        marginBottom: "20px",
      }}
    >
      <h3
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "var(--color-text)",
          margin: "0 0 12px",
        }}
      >
        Horas por tarea en el período
      </h3>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 46)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 40, bottom: 4, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
          <XAxis
            type="number"
            tickFormatter={(v: number) => `${v}h`}
            tick={{ fontSize: 12, fontFamily: FONT, fill: "var(--color-text-soft)" }}
          />
          <YAxis
            type="category"
            dataKey="nombre"
            width={170}
            tick={{ fontSize: 12, fontFamily: FONT, fill: "var(--color-text)" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,66,84,0.06)" }}
            formatter={(_value, _name, item) => {
              const p = item?.payload as { minutes: number; count: number } | undefined;
              return [
                `${fmtHoras(p?.minutes ?? 0)} · ${p?.count ?? 0} registro(s)`,
                "Tiempo total",
              ];
            }}
            contentStyle={{ fontFamily: FONT, fontSize: "0.8rem", borderRadius: 8 }}
          />
          <Bar dataKey="horas" radius={[0, 6, 6, 0]} barSize={22}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
