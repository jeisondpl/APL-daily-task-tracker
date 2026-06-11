"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useUsuariosController } from "@/modules/usuarios/presentation/hooks/useUsuariosController";
import { useTareasController } from "@/modules/tareas/presentation/hooks/useTareasController";
import { useListasController } from "@/modules/listas-tareas/presentation/hooks/useListasController";
import { usePuntuacionController } from "@/modules/puntuacion/presentation/hooks/usePuntuacionController";
import { MesCalendario } from "@/views/Tareas/MesCalendario";
import { PuntuacionMes } from "@/views/Puntuacion/PuntuacionMes";
import { TareasGantt } from "@/views/Tareas/TareasGantt";
import {
  ResumenDia,
  HorasPorListaBar,
} from "@/views/Tareas/EstadisticasDia";
import { EditarTareaModal } from "@/views/Tareas/EditarTareaModal";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import {
  formatFechaLarga,
  todayISO,
  parseLocalDate,
  monthRangeISO,
} from "@/shared/lib/utils";
import type {
  ITarea,
  IUpdateTareaDTO,
} from "@/modules/tareas/domain/entities/Tarea.entities";
import type { IUsuario } from "@/modules/usuarios/domain/entities/Usuario.entities";

function initials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const rol = session?.user?.rol;
  const isAdmin = rol === "Administrador" || rol === "ADMIN";
  const meId = session?.user?.userId;

  const usuariosCtrl = useUsuariosController();
  const tareasCtrl = useTareasController();
  const listasCtrl = useListasController();
  const puntuacionCtrl = usePuntuacionController();

  const [collabId, setCollabId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [visibleMonth, setVisibleMonth] = useState<Date>(() =>
    parseLocalDate(todayISO()),
  );
  const [selectedTarea, setSelectedTarea] = useState<ITarea | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) usuariosCtrl._list();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // Collaborators = every user except the logged-in admin (can't self-assign).
  const collaborators = useMemo<IUsuario[]>(
    () => usuariosCtrl.usuarios.filter((u) => u.id !== meId),
    [usuariosCtrl.usuarios, meId],
  );
  const collab = collaborators.find((c) => c.id === collabId) ?? null;

  // Load the selected collaborator's month (tasks + score) + lists.
  useEffect(() => {
    if (collabId) {
      tareasCtrl._list({ owner: collabId, ...monthRangeISO(visibleMonth) });
      listasCtrl._list(collabId);
      puntuacionCtrl._load({
        usuarioId: collabId,
        mes: visibleMonth.getMonth() + 1,
        anio: visibleMonth.getFullYear(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collabId, visibleMonth]);

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

  const penalizedDays = useMemo(
    () =>
      new Set(
        (puntuacionCtrl.resumen?.penalizaciones ?? []).map((p) => p.fecha),
      ),
    [puntuacionCtrl.resumen],
  );

  function reloadMonth() {
    if (collabId) {
      tareasCtrl._list({ owner: collabId, ...monthRangeISO(visibleMonth) });
      puntuacionCtrl._load({
        usuarioId: collabId,
        mes: visibleMonth.getMonth() + 1,
        anio: visibleMonth.getFullYear(),
      });
    }
  }

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

  async function handleSave(id: number, dto: IUpdateTareaDTO) {
    await tareasCtrl._update(id, dto);
    reloadMonth();
  }
  async function handleDelete(id: number) {
    await tareasCtrl._delete(id);
    reloadMonth();
  }

  if (status === "loading") {
    return <p style={{ color: "var(--color-text-soft)" }}>Cargando…</p>;
  }
  if (!isAdmin) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <p style={{ color: "#C0392B" }}>
          No tenés permiso para acceder. Requiere rol Administrador.
        </p>
      </div>
    );
  }

  const completadas = dayTareas.filter((t) => t.completada).length;

  return (
    <div>
      <PageHeader
        title="Panel de administración"
        subtitle="Seguí el avance y la agenda de tus colaboradores"
      />

      {/* KPI strip */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        <Kpi label="Colaboradores" value={String(collaborators.length)} />
        <Kpi
          label={collab ? `Tareas · ${collab.nombre}` : "Tareas del día"}
          value={collab ? String(dayTareas.length) : "—"}
        />
        <Kpi
          label="Completadas"
          value={collab ? `${completadas}/${dayTareas.length}` : "—"}
        />
        <Kpi
          label={collab ? `Puntos del mes · ${collab.nombre}` : "Puntos del mes"}
          value={
            collab && puntuacionCtrl.resumen
              ? String(puntuacionCtrl.resumen.totalPuntos)
              : "—"
          }
        />
      </div>

      {/* Collaborator selector */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {collaborators.length === 0 ? (
          <p style={{ color: "var(--color-text-soft)" }}>
            No hay colaboradores todavía. Creá usuarios en la sección Usuarios.
          </p>
        ) : (
          collaborators.map((c) => {
            const active = c.id === collabId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCollabId(c.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  backgroundColor: active
                    ? "var(--color-petroleum)"
                    : "var(--color-surface)",
                  border: `1px solid ${active ? "var(--color-petroleum)" : "var(--color-border)"}`,
                  color: active
                    ? "var(--color-text-invert)"
                    : "var(--color-text)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    backgroundColor: active
                      ? "rgba(255,255,255,0.2)"
                      : "var(--color-petroleum)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  {initials(c.nombre)}
                </span>
                <span style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1.2 }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    {c.nombre}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: active
                        ? "rgba(255,255,255,0.75)"
                        : "var(--color-text-soft)",
                    }}
                  >
                    {c.rolNombre}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Selected collaborator's agenda */}
      {!collab ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--color-text-soft)",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
          }}
        >
          Seleccioná un colaborador arriba para ver su agenda y su avance.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
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
              penalizedDays={penalizedDays}
              onSelectDate={selectDate}
              onMonthChange={setVisibleMonth}
            />
            <PuntuacionMes
              resumen={puntuacionCtrl.resumen}
              loading={puntuacionCtrl.loading}
              error={puntuacionCtrl.error}
            />
            <ResumenDia tareas={dayTareas} listas={listasCtrl.listas} />
          </div>

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
              <h2
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  textTransform: "capitalize",
                  margin: 0,
                }}
              >
                {collab.nombre} — {formatFechaLarga(selectedDate)}
              </h2>
            </div>

            {tareasCtrl.loading ? (
              <p style={{ color: "var(--color-text-soft)" }}>Cargando…</p>
            ) : (
              <TareasGantt
                tareas={dayTareas}
                onSelectTarea={(t) => {
                  setSelectedTarea(t);
                  setEditOpen(true);
                }}
              />
            )}

            <div style={{ marginTop: "16px" }}>
              <HorasPorListaBar tareas={dayTareas} listas={listasCtrl.listas} />
            </div>
          </div>
        </div>
      )}

      <EditarTareaModal
        tarea={selectedTarea}
        listas={listasCtrl.listas}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "12px 18px",
        minWidth: "130px",
      }}
    >
      <p
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "var(--color-petroleum)",
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: "0.72rem",
          color: "var(--color-text-soft)",
          fontWeight: 600,
          margin: 0,
        }}
      >
        {label}
      </p>
    </div>
  );
}
