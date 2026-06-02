"use client";

import { Gantt, ViewMode, type Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import type { ITarea } from "@/modules/tareas/domain/entities/Tarea.entities";

const FONT = '"Inter", "Segoe UI", "Roboto", system-ui, sans-serif';

function toDate(fecha: string, hhmm: string): Date {
  const [y, m, d] = fecha.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

interface Props {
  tareas: ITarea[];
  onSelectTarea?: (tarea: ITarea) => void;
}

export function TareasGantt({ tareas, onSelectTarea }: Props) {
  if (tareas.length === 0) {
    return (
      <div
        style={{
          padding: "32px",
          textAlign: "center",
          color: "var(--color-text-soft)",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
        }}
      >
        No hay tareas para este día. ¡Agregá una con “+ Nueva tarea”!
      </div>
    );
  }

  const byId = new Map(tareas.map((t) => [String(t.id), t]));

  const tasks: Task[] = tareas.map((t) => ({
    id: String(t.id),
    // Bar label shows the LIST name; the task name lives in the left column.
    name: t.listaNombre ?? t.nombre,
    start: toDate(t.fecha, t.horaInicio),
    end: toDate(t.fecha, t.horaFin),
    type: "task",
    progress: t.completada ? 100 : 0,
    isDisabled: false,
    styles: {
      backgroundColor: t.color,
      backgroundSelectedColor: t.color,
      progressColor: "rgba(255,255,255,0.4)",
      progressSelectedColor: "rgba(255,255,255,0.55)",
    },
  }));

  // Custom left header — single "Tarea" column (drops the redundant From/To).
  const ListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }> = ({ headerHeight, rowWidth, fontFamily, fontSize }) => (
    <div
      style={{
        height: headerHeight,
        width: rowWidth,
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        boxSizing: "border-box",
        fontFamily,
        fontSize,
        fontWeight: 700,
        color: "var(--color-text-invert)",
        backgroundColor: "var(--color-petroleum)",
      }}
    >
      Tarea
    </div>
  );

  // Custom left table — shows the real TASK name (not the list) + color dot.
  const ListTable: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
  }> = ({ rowHeight, rowWidth, fontFamily, fontSize, tasks: rows, selectedTaskId }) => (
    <div>
      {rows.map((task) => {
        const tarea = byId.get(task.id);
        const selected = task.id === selectedTaskId;
        return (
          <div
            key={task.id}
            onClick={() => tarea && onSelectTarea?.(tarea)}
            title="Editar tarea"
            style={{
              height: rowHeight,
              width: rowWidth,
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingLeft: 16,
              boxSizing: "border-box",
              fontFamily,
              fontSize,
              color: "var(--color-text)",
              backgroundColor: selected ? "rgba(0,66,84,0.06)" : "transparent",
              borderBottom: "1px solid var(--color-border)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: tarea?.color ?? "var(--color-border)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textDecoration: tarea?.completada ? "line-through" : "none",
              }}
            >
              {tarea?.nombre ?? task.name}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Hour}
        locale="es"
        columnWidth={58}
        listCellWidth="200px"
        rowHeight={46}
        barCornerRadius={6}
        barFill={62}
        handleWidth={0}
        fontFamily={FONT}
        fontSize="13px"
        todayColor="rgba(0,66,84,0.10)"
        TaskListHeader={ListHeader}
        TaskListTable={ListTable}
        onClick={(task) => {
          const tarea = byId.get(task.id);
          if (tarea) onSelectTarea?.(tarea);
        }}
        TooltipContent={({ task }) => {
          const tarea = byId.get(task.id);
          if (!tarea) return null;
          return (
            <div
              style={{
                background: "var(--color-deep-navy)",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "8px",
                fontFamily: FONT,
                fontSize: "12px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              }}
            >
              <strong>{tarea.nombre}</strong>
              <div style={{ opacity: 0.85 }}>
                {tarea.horaInicio} – {tarea.horaFin}
                {tarea.listaNombre ? ` · ${tarea.listaNombre}` : ""}
              </div>
              <div style={{ opacity: 0.7, marginTop: 2 }}>
                {tarea.completada ? "✓ Completada" : "Click para editar"}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
