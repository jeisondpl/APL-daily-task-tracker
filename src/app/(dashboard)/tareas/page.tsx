"use client";

import { useEffect, useState } from "react";
import { useTareasController } from "@/modules/tareas/presentation/hooks/useTareasController";
import { useListasController } from "@/modules/listas-tareas/presentation/hooks/useListasController";
import { AgregarTareaForm } from "@/views/Tareas/AgregarTareaForm";
import { TareasTimelineView } from "@/views/Tareas/TareasTimelineView";
import { EditarTareaModal } from "@/views/Tareas/EditarTareaModal";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { formatFechaLarga } from "@/shared/lib/utils";
import type {
  ICreateTareaDTO,
  ITarea,
  IUpdateTareaDTO,
} from "@/modules/tareas/domain/entities/Tarea.entities";

const today = new Date().toISOString().slice(0, 10);

export default function TareasPage() {
  const tareasCtrl = useTareasController();
  const listasCtrl = useListasController();
  const [selected, setSelected] = useState<ITarea | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    tareasCtrl._list({ fecha: today });
    listasCtrl._list();
    // Run once on mount — controllers are stable references (objects, not primitives)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(dto: ICreateTareaDTO) {
    await tareasCtrl._create(dto);
    // Re-list to get server-sorted order including the new task
    await tareasCtrl._list({ fecha: today });
  }

  function handleSelect(tarea: ITarea) {
    setSelected(tarea);
    setEditOpen(true);
  }

  async function handleSave(id: number, dto: IUpdateTareaDTO) {
    await tareasCtrl._update(id, dto);
    await tareasCtrl._list({ fecha: today });
  }

  async function handleDelete(id: number) {
    await tareasCtrl._delete(id);
  }

  return (
    <div>
      <PageHeader
        title="Tareas del día"
        subtitle={formatFechaLarga(today)}
      />

      {listasCtrl.error && (
        <p style={{ color: "var(--color-danger, #c0392b)", fontSize: "0.875rem", marginBottom: "8px" }}>
          {listasCtrl.error}
        </p>
      )}

      <AgregarTareaForm
        listas={listasCtrl.listas}
        fecha={today}
        onCreate={handleCreate}
      />

      {tareasCtrl.error && (
        <p style={{ color: "var(--color-danger, #c0392b)", fontSize: "0.875rem", marginBottom: "8px" }}>
          {tareasCtrl.error}
        </p>
      )}

      {tareasCtrl.loading ? (
        <p style={{ color: "var(--color-text-soft)" }}>Cargando tareas…</p>
      ) : (
        <TareasTimelineView
          tareas={tareasCtrl.tareas}
          onSelectTarea={handleSelect}
        />
      )}

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
