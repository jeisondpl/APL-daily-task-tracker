"use client";

import { useEffect, useMemo, useState } from "react";
import { useTareasController } from "@/modules/tareas/presentation/hooks/useTareasController";
import { useListasController } from "@/modules/listas-tareas/presentation/hooks/useListasController";
import { MesCalendario } from "@/views/Tareas/MesCalendario";
import { TareasGantt } from "@/views/Tareas/TareasGantt";
import { ResumenDia, HorasPorListaBar } from "@/views/Tareas/EstadisticasDia";
import { AgregarTareaModal } from "@/views/Tareas/AgregarTareaModal";
import { EditarTareaModal } from "@/views/Tareas/EditarTareaModal";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { Button } from "@/shared/components/ui/Button";
import {
  formatFechaLarga,
  todayISO,
  parseLocalDate,
  toISODateLocal,
  monthRangeISO,
} from "@/shared/lib/utils";
import type {
  ICreateTareaDTO,
  ITarea,
  IUpdateTareaDTO,
} from "@/modules/tareas/domain/entities/Tarea.entities";

function shiftDay(iso: string, delta: number): string {
  const d = parseLocalDate(iso);
  d.setDate(d.getDate() + delta);
  return toISODateLocal(d);
}

export default function TareasPage() {
  const tareasCtrl = useTareasController();
  const listasCtrl = useListasController();

  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [visibleMonth, setVisibleMonth] = useState<Date>(() =>
    parseLocalDate(todayISO()),
  );
  const [selected, setSelected] = useState<ITarea | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  // Load the whole visible month in one range request (powers the calendar dots
  // and the per-day filter). Refetched whenever the month changes.
  useEffect(() => {
    tareasCtrl._list(monthRangeISO(visibleMonth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleMonth]);

  useEffect(() => {
    listasCtrl._list();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dayTareas = useMemo(
    () => tareasCtrl.tareas.filter((t) => t.fecha === selectedDate),
    [tareasCtrl.tareas, selectedDate],
  );

  const countsByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tareasCtrl.tareas) {
      map.set(t.fecha, (map.get(t.fecha) ?? 0) + 1);
    }
    return map;
  }, [tareasCtrl.tareas]);

  function reloadMonth() {
    tareasCtrl._list(monthRangeISO(visibleMonth));
  }

  // Select a day; keep the calendar on that day's month.
  function selectDate(iso: string) {
    setSelectedDate(iso);
    const d = parseLocalDate(iso);
    if (
      d.getMonth() !== visibleMonth.getMonth() ||
      d.getFullYear() !== visibleMonth.getFullYear()
    ) {
      setVisibleMonth(d);
    }
  }

  async function handleCreate(dto: ICreateTareaDTO) {
    await tareasCtrl._create(dto);
    reloadMonth();
  }

  function handleSelectTarea(tarea: ITarea) {
    setSelected(tarea);
    setEditOpen(true);
  }

  async function handleSave(id: number, dto: IUpdateTareaDTO) {
    await tareasCtrl._update(id, dto);
    reloadMonth();
  }

  async function handleDelete(id: number) {
    await tareasCtrl._delete(id);
    reloadMonth();
  }

  const fechaLarga = formatFechaLarga(selectedDate);

  return (
    <div>
      <PageHeader title="Agenda" subtitle="Elegí un día para ver sus tareas" />

      {listasCtrl.error && (
        <p style={{ color: "#c0392b", fontSize: "0.875rem", marginBottom: "8px" }}>
          {listasCtrl.error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Left: month calendar + day summary */}
        <div
          style={{
            width: "340px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <MesCalendario
            selectedDate={selectedDate}
            visibleMonth={visibleMonth}
            countsByDay={countsByDay}
            onSelectDate={selectDate}
            onMonthChange={setVisibleMonth}
          />
          <ResumenDia tareas={dayTareas} listas={listasCtrl.listas} />
        </div>

        {/* Right: selected day's schedule */}
        <div style={{ flex: 1, minWidth: "320px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                aria-label="Día anterior"
                onClick={() => selectDate(shiftDay(selectedDate, -1))}
                className="dtt-cal-today-btn"
                style={dayNavBtn}
              >
                ‹
              </button>
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  textTransform: "capitalize",
                  margin: 0,
                }}
              >
                {fechaLarga}
              </h2>
              <button
                type="button"
                aria-label="Día siguiente"
                onClick={() => selectDate(shiftDay(selectedDate, 1))}
                className="dtt-cal-today-btn"
                style={dayNavBtn}
              >
                ›
              </button>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setCreateOpen(true)}
            >
              + Nueva tarea
            </Button>
          </div>

          {tareasCtrl.error && (
            <p style={{ color: "#c0392b", fontSize: "0.875rem", marginBottom: "8px" }}>
              {tareasCtrl.error}
            </p>
          )}

          {tareasCtrl.loading ? (
            <p style={{ color: "var(--color-text-soft)" }}>Cargando tareas…</p>
          ) : (
            <TareasGantt tareas={dayTareas} onSelectTarea={handleSelectTarea} />
          )}

          <div style={{ marginTop: "16px" }}>
            <HorasPorListaBar tareas={dayTareas} listas={listasCtrl.listas} />
          </div>
        </div>
      </div>

      <AgregarTareaModal
        open={createOpen}
        listas={listasCtrl.listas}
        fecha={selectedDate}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <EditarTareaModal
        tarea={selected}
        listas={listasCtrl.listas}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

const dayNavBtn: React.CSSProperties = {
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.25rem",
  lineHeight: 1,
  color: "var(--color-petroleum)",
  background: "transparent",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  cursor: "pointer",
};
