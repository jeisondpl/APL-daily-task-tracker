"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Button } from "@/shared/components/ui/Button";
import type {
  ITarea,
  IUpdateTareaDTO,
} from "@/modules/tareas/domain/entities/Tarea.entities";
import type { IListaTarea } from "@/modules/listas-tareas/domain/entities/ListaTarea.entities";

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

const SLOTS_INICIO = generateSlots("08:00", "18:00", 30); // 08:00 … 17:30
const SLOTS_FIN = generateSlots("08:30", "18:30", 30); // 08:30 … 18:00

interface Props {
  tarea: ITarea | null;
  listas: IListaTarea[];
  open: boolean;
  onClose: () => void;
  onSave: (id: number, dto: IUpdateTareaDTO) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function EditarTareaModal({
  tarea,
  listas,
  open,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [listaId, setListaId] = useState<number>(0);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFin, setHoraFin] = useState("08:30");
  const [color, setColor] = useState("#10B981");
  const [completada, setCompletada] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync local form state whenever a different task is selected.
  useEffect(() => {
    if (!tarea) return;
    setNombre(tarea.nombre);
    setListaId(tarea.listaId);
    setHoraInicio(tarea.horaInicio);
    setHoraFin(tarea.horaFin);
    setColor(tarea.color ?? "#10B981");
    setCompletada(tarea.completada);
    setError(null);
  }, [tarea]);

  if (!tarea) return null;

  async function handleSave() {
    if (!tarea) return;
    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }
    if (horaFin <= horaInicio) {
      setError("La hora de fin debe ser mayor a la de inicio");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(tarea.id, {
        nombre: nombre.trim(),
        listaId,
        horaInicio,
        horaFin,
        color,
        completada,
      });
      onClose();
    } catch {
      setError("No se pudo guardar la tarea");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!tarea) return;
    if (!window.confirm(`¿Eliminar la tarea "${tarea.nombre}"?`)) return;
    setSaving(true);
    try {
      await onDelete(tarea.id);
      onClose();
    } catch {
      setError("No se pudo eliminar la tarea");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar tarea"
      footer={
        <>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={saving}
            style={{ marginRight: "auto" }}
          >
            Eliminar
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Input
          label="Tarea"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <Select
          label="Lista"
          value={listaId}
          onChange={(e) => setListaId(Number(e.target.value))}
          options={listas.map((l) => ({ value: l.id, label: l.nombre }))}
        />

        <div style={{ display: "flex", gap: "12px" }}>
          <Select
            label="Desde"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            options={SLOTS_INICIO.map((s) => ({ value: s, label: s }))}
          />
          <Select
            label="Hasta"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            options={SLOTS_FIN.map((s) => ({ value: s, label: s }))}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.875rem",
              color: "var(--color-text)",
            }}
          >
            Color
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: "40px",
                height: "28px",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
                cursor: "pointer",
                background: "none",
              }}
            />
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.875rem",
              color: "var(--color-text)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={completada}
              onChange={(e) => setCompletada(e.target.checked)}
            />
            Completada
          </label>
        </div>

        {error && (
          <p
            role="alert"
            style={{ color: "#C0392B", fontSize: "0.8125rem", margin: 0 }}
          >
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
