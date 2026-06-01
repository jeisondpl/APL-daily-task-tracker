"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTareaSchema } from "@/shared/validation/tarea.schema";
import type { ICreateTareaDTO } from "@/modules/tareas/domain/entities/Tarea.entities";
import type { IListaTarea } from "@/modules/listas-tareas/domain/entities/ListaTarea.entities";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Button } from "@/shared/components/ui/Button";
import type { z } from "zod";

// Slot helpers — generated once at module level so they don't recreate on each render
function buildSlotOptions(from: string, to: string, stepMin: number) {
  const options: { value: string; label: string }[] = [];
  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);
  let cur = fh * 60 + fm;
  const end = th * 60 + tm;
  while (cur <= end) {
    const h = Math.floor(cur / 60),
      m = cur % 60;
    const v = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    options.push({ value: v, label: v });
    cur += stepMin;
  }
  return options;
}

// 08:00 .. 17:30 for horaInicio (last valid start = 17:30 so the task fits in range)
const DESDE_OPTIONS = buildSlotOptions("08:00", "17:30", 30);
// 08:30 .. 18:00 for horaFin
const HASTA_OPTIONS = buildSlotOptions("08:30", "18:00", 30);

type FormValues = z.infer<typeof createTareaSchema>;

interface Props {
  listas: IListaTarea[];
  fecha: string;
  onCreate: (dto: ICreateTareaDTO) => Promise<void> | void;
}

export function AgregarTareaForm({ listas, fecha, onCreate }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createTareaSchema),
    defaultValues: {
      fecha,
      horaInicio: "08:00",
      horaFin: "08:30",
      listaId: listas[0]?.id,
    },
  });

  async function onSubmit(values: FormValues) {
    await onCreate(values as ICreateTareaDTO);
    // Only reset the per-task fields; keep fecha and lista selection
    reset((prev) => ({
      ...prev,
      nombre: "",
      descripcion: "",
      horaInicio: "08:00",
      horaFin: "08:30",
      color: undefined,
    }));
  }

  const listaOptions = listas.map((l) => ({
    value: String(l.id),
    label: l.nombre,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "grid",
        gridTemplateColumns:
          "minmax(160px,1fr) 140px minmax(200px,2fr) 110px 110px auto",
        gap: "8px",
        alignItems: "flex-start",
        marginBottom: "16px",
      }}
    >
      <Select
        label="Lista"
        options={listaOptions}
        error={errors.listaId?.message}
        {...register("listaId", { valueAsNumber: true })}
      />

      <Input
        label="Fecha"
        type="date"
        error={errors.fecha?.message}
        {...register("fecha")}
      />

      <Input
        label="Tarea"
        type="text"
        placeholder="Nombre de la tarea"
        error={errors.nombre?.message}
        {...register("nombre")}
      />

      <Select
        label="Desde"
        options={DESDE_OPTIONS}
        error={errors.horaInicio?.message}
        {...register("horaInicio")}
      />

      <Select
        label="Hasta"
        options={HASTA_OPTIONS}
        error={errors.horaFin?.message}
        {...register("horaFin")}
      />

      <div style={{ paddingTop: "22px" }}>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
        >
          {isSubmitting ? "..." : "+ Agregar"}
        </Button>
      </div>
    </form>
  );
}
