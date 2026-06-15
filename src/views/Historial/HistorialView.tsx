"use client";

import { useEffect, useMemo, useState } from "react";
import { useTareasController } from "@/modules/tareas/presentation/hooks/useTareasController";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { Input } from "@/shared/components/ui/Input";
import { HistorialTabla } from "@/views/Historial/HistorialTabla";
import { HorasXDiaBar } from "@/views/Historial/HorasXDiaBar";
import { monthRangeISO, parseLocalDate, todayISO } from "@/shared/lib/utils";

const FONT = '"Inter", "Segoe UI", system-ui, sans-serif';

function initRange() {
  return monthRangeISO(parseLocalDate(todayISO()));
}

export function HistorialView() {
  const { desde: initDesde, hasta: initHasta } = initRange();

  const [desde, setDesde] = useState(initDesde);
  const [hasta, setHasta] = useState(initHasta);
  // Draft state: what's in the inputs before hitting "Buscar"
  const [draftDesde, setDraftDesde] = useState(initDesde);
  const [draftHasta, setDraftHasta] = useState(initHasta);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const tareasCtrl = useTareasController();

  useEffect(() => {
    tareasCtrl._list({ desde, hasta });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desde, hasta]);

  function handleBuscar() {
    if (draftDesde > draftHasta) {
      setRangeError("La fecha de inicio debe ser anterior o igual a la fecha de fin.");
      return;
    }
    setRangeError(null);
    setDesde(draftDesde);
    setHasta(draftHasta);
  }

  // Group tasks by date, descending (most recent first).
  const { tareas } = tareasCtrl;
  const grupos = useMemo(() => {
    const map = new Map<string, typeof tareas>();
    for (const t of tareas) {
      const arr = map.get(t.fecha) ?? [];
      arr.push(t);
      map.set(t.fecha, arr);
    }
    return [...map.entries()]
      .sort(([a], [b]) => (a > b ? -1 : 1))
      .map(([fecha, items]) => ({
        fecha,
        tareas: [...items].sort((a, b) =>
          a.horaInicio.localeCompare(b.horaInicio),
        ),
      }));
  }, [tareas]);

  return (
    <div>
      <PageHeader
        title="Historial de tareas"
        subtitle="Tus actividades registradas, organizadas por día"
      />

      {/* Date range filter */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <Input
          type="date"
          label="Desde"
          value={draftDesde}
          onChange={(e) => setDraftDesde(e.target.value)}
          style={{ maxWidth: "180px" }}
        />
        <Input
          type="date"
          label="Hasta"
          value={draftHasta}
          onChange={(e) => setDraftHasta(e.target.value)}
          style={{ maxWidth: "180px" }}
        />
        <button
          type="button"
          onClick={handleBuscar}
          className="dtt-cal-today-btn"
          style={{
            fontFamily: FONT,
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--color-text-invert)",
            background: "var(--color-petroleum)",
            border: "1px solid var(--color-petroleum)",
            borderRadius: "8px",
            padding: "8px 18px",
            cursor: "pointer",
            marginBottom: "1px",
          }}
        >
          Buscar
        </button>
      </div>

      {rangeError && (
        <p
          role="alert"
          style={{
            color: "#C0392B",
            fontSize: "0.8rem",
            marginBottom: "12px",
            fontFamily: FONT,
          }}
        >
          {rangeError}
        </p>
      )}

      {tareasCtrl.error && (
        <p
          style={{
            color: "#c0392b",
            fontSize: "0.875rem",
            marginBottom: "8px",
            fontFamily: FONT,
          }}
        >
          {tareasCtrl.error}
        </p>
      )}

      {tareasCtrl.loading ? (
        <p style={{ color: "var(--color-text-soft)", fontFamily: FONT }}>
          Cargando historial…
        </p>
      ) : (
        <>
          <HorasXDiaBar grupos={grupos} />
          <HistorialTabla grupos={grupos} />
        </>
      )}
    </div>
  );
}
