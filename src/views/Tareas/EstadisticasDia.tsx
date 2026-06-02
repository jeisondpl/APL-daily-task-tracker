"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ITarea } from "@/modules/tareas/domain/entities/Tarea.entities";
import type { IListaTarea } from "@/modules/listas-tareas/domain/entities/ListaTarea.entities";

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

interface Grupo {
  listaId: number;
  nombre: string;
  color: string;
  count: number;
  minutes: number;
}

function useGrupos(tareas: ITarea[], listas: IListaTarea[]): Grupo[] {
  return useMemo(() => {
    const byId = new Map(listas.map((l) => [l.id, l]));
    const groups = new Map<number, Grupo>();
    for (const t of tareas) {
      const lista = byId.get(t.listaId);
      const g =
        groups.get(t.listaId) ??
        ({
          listaId: t.listaId,
          nombre: t.listaNombre ?? lista?.nombre ?? "Sin lista",
          color: lista?.colorDefault ?? t.color ?? "#8661F5",
          count: 0,
          minutes: 0,
        } satisfies Grupo);
      g.count += 1;
      g.minutes += durMin(t);
      groups.set(t.listaId, g);
    }
    return [...groups.values()].sort((a, b) => b.minutes - a.minutes);
  }, [tareas, listas]);
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--color-bg)",
  borderRadius: "10px",
  padding: "10px 12px",
};
const kpiNumber: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 800,
  color: "var(--color-petroleum)",
  lineHeight: 1.1,
};
const kpiLabel: React.CSSProperties = {
  fontSize: "0.72rem",
  color: "var(--color-text-soft)",
  fontWeight: 600,
};

function EmptyBox({ height }: { height: number }) {
  return (
    <div
      style={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-text-soft)",
        fontFamily: FONT,
        fontSize: "0.875rem",
      }}
    >
      Sin tareas para este día.
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "16px",
        fontFamily: FONT,
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
        {title}
      </h3>
      {children}
    </div>
  );
}

/** Left box: KPIs + donut (tasks per list). */
export function ResumenDia({
  tareas,
  listas,
}: {
  tareas: ITarea[];
  listas: IListaTarea[];
}) {
  const grupos = useGrupos(tareas, listas);
  const total = tareas.length;
  const totalMin = tareas.reduce((acc, t) => acc + durMin(t), 0);
  const completadas = tareas.filter((t) => t.completada).length;
  const pct = total ? Math.round((completadas / total) * 100) : 0;

  return (
    <Panel title="Resumen del día">
      {total === 0 ? (
        <EmptyBox height={260} />
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginBottom: "14px",
            }}
          >
            <div style={cardStyle}>
              <div style={kpiNumber}>{total}</div>
              <div style={kpiLabel}>Tareas</div>
            </div>
            <div style={cardStyle}>
              <div style={kpiNumber}>{fmtHoras(totalMin)}</div>
              <div style={kpiLabel}>Horas</div>
            </div>
            <div style={cardStyle}>
              <div style={kpiNumber}>
                {completadas}
                <span style={{ fontSize: "0.9rem", color: "var(--color-text-soft)" }}>
                  /{total}
                </span>
              </div>
              <div style={kpiLabel}>Completadas</div>
            </div>
            <div style={cardStyle}>
              <div style={kpiNumber}>{pct}%</div>
              <div style={kpiLabel}>Avance</div>
            </div>
          </div>

          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-soft)", marginBottom: 4 }}>
            Tareas por lista
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={grupos}
                dataKey="count"
                nameKey="nombre"
                innerRadius={42}
                outerRadius={72}
                paddingAngle={2}
                stroke="var(--color-surface)"
              >
                {grupos.map((g) => (
                  <Cell key={g.listaId} fill={g.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _name, item) => {
                  const g = item?.payload as Grupo | undefined;
                  return [
                    `${value} tarea(s) · ${fmtHoras(g?.minutes ?? 0)}`,
                    g?.nombre ?? "",
                  ];
                }}
                contentStyle={{ fontFamily: FONT, fontSize: "0.8rem", borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>

          <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {grupos.map((g) => (
              <li key={g.listaId} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: g.color, flexShrink: 0 }} />
                <span style={{ color: "var(--color-text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {g.nombre}
                </span>
                <span style={{ color: "var(--color-text-soft)", fontWeight: 600 }}>{g.count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}

/** Bottom box: horizontal bar chart (hours per list). */
export function HorasPorListaBar({
  tareas,
  listas,
}: {
  tareas: ITarea[];
  listas: IListaTarea[];
}) {
  const grupos = useGrupos(tareas, listas);
  const data = grupos.map((g) => ({
    nombre: g.nombre,
    horas: +(g.minutes / 60).toFixed(2),
    minutes: g.minutes,
    count: g.count,
    color: g.color,
  }));

  return (
    <Panel title="Horas por lista">
      {data.length === 0 ? (
        <EmptyBox height={200} />
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(180, data.length * 46)}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fontFamily: FONT, fill: "var(--color-text-soft)" }}
              tickFormatter={(v: number) => `${v}h`}
            />
            <YAxis
              type="category"
              dataKey="nombre"
              width={140}
              tick={{ fontSize: 12, fontFamily: FONT, fill: "var(--color-text)" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,66,84,0.06)" }}
              formatter={(_value, _name, item) => {
                const p = item?.payload as
                  | { minutes: number; count: number }
                  | undefined;
                return [
                  `${fmtHoras(p?.minutes ?? 0)} · ${p?.count ?? 0} tarea(s)`,
                  "Tiempo",
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
      )}
    </Panel>
  );
}
