"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTareaSchema } from "@/shared/validation/tarea.schema";
import type { ICreateTareaDTO } from "@/modules/tareas/domain/entities/Tarea.entities";
import type { IListaTarea } from "@/modules/listas-tareas/domain/entities/ListaTarea.entities";
import { Modal } from "@/shared/components/ui/Modal";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Textarea } from "@/shared/components/ui/Textarea";
import { Button } from "@/shared/components/ui/Button";
import type { z } from "zod";

// Slot helpers — built once at module level so they don't recreate on each render.
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

const DESDE_OPTIONS = buildSlotOptions("05:00", "22:30", 30);
const HASTA_OPTIONS = buildSlotOptions("05:30", "23:00", 30);

// Add minutes to a "HH:MM" slot, clamped to the 23:00 end of day.
function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = Math.min(h * 60 + m + mins, 23 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
    total % 60,
  ).padStart(2, "0")}`;
}

type FormValues = z.infer<typeof createTareaSchema>;

interface Props {
  open: boolean;
  listas: IListaTarea[];
  fecha: string;
  onClose: () => void;
  onCreate: (dto: ICreateTareaDTO) => Promise<void> | void;
}

export function AgregarTareaModal({
  open,
  listas,
  fecha,
  onClose,
  onCreate,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createTareaSchema),
    defaultValues: {
      fecha,
      horaInicio: "05:00",
      horaFin: "05:30",
      listaId: listas[0]?.id,
    },
  });

  // Start each "Nueva tarea" fresh when the modal opens.
  useEffect(() => {
    if (open) {
      reset({
        fecha,
        nombre: "",
        descripcion: "",
        horaInicio: "05:00",
        horaFin: "05:30",
        listaId: listas[0]?.id,
      });
    }
  }, [open, fecha, listas, reset]);

  async function onSubmit(values: FormValues) {
    await onCreate(values as ICreateTareaDTO);
    onClose();
  }

  const horaInicio = watch("horaInicio");
  const desdeReg = register("horaInicio");

  const listaOptions = listas.map((l) => ({
    value: String(l.id),
    label: l.nombre,
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva tarea"
      footer={
        <>
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando…" : "Agregar tarea"}
          </Button>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <Input
          label="Tarea"
          type="text"
          placeholder="Nombre de la tarea"
          error={errors.nombre?.message}
          {...register("nombre")}
        />

        <Textarea
          label="Descripción (opcional)"
          rows={3}
          placeholder="Notas o detalles de la tarea…"
          error={errors.descripcion?.message}
          {...register("descripcion")}
        />

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

        <div style={{ display: "flex", gap: "12px" }}>
          <Select
            label="Desde"
            options={DESDE_OPTIONS}
            error={errors.horaInicio?.message}
            {...desdeReg}
            onChange={(e) => {
              desdeReg.onChange(e);
              setValue("horaFin", addMinutes(e.target.value, 30), {
                shouldValidate: true,
              });
            }}
          />
          <Select
            label="Hasta"
            options={HASTA_OPTIONS.filter((o) => o.value > (horaInicio ?? ""))}
            error={errors.horaFin?.message}
            {...register("horaFin")}
          />
        </div>

        {/* Hidden submit so pressing Enter inside the form submits it. */}
        <button
          type="submit"
          style={{ display: "none" }}
          aria-hidden="true"
          tabIndex={-1}
        />
      </form>
    </Modal>
  );
}
