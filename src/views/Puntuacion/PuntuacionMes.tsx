"use client";

import { formatFechaLarga } from "@/shared/lib/utils";
import type { IResumenPuntuacion } from "@/modules/puntuacion/domain/entities/Puntuacion.entities";

const FONT = '"Inter", "Segoe UI", system-ui, sans-serif';
const PENALTY_COLOR = "#c0392b";

const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--color-bg)",
  borderRadius: "10px",
  padding: "10px 12px",
};
const kpiLabel: React.CSSProperties = {
  fontSize: "0.72rem",
  color: "var(--color-text-soft)",
  fontWeight: 600,
};

interface Props {
  resumen: IResumenPuntuacion | null;
  loading: boolean;
  error: string | null;
}

/** Monthly score panel: total points + penalized days for the visible month. */
export function PuntuacionMes({ resumen, loading, error }: Props) {
  const penalizado = (resumen?.diasPenalizados ?? 0) > 0;

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
        Puntuación del mes
      </h3>

      {loading ? (
        <p style={{ color: "var(--color-text-soft)", fontSize: "0.875rem", margin: 0 }}>
          Cargando puntuación…
        </p>
      ) : error ? (
        <p style={{ color: PENALTY_COLOR, fontSize: "0.875rem", margin: 0 }}>{error}</p>
      ) : !resumen ? (
        <p style={{ color: "var(--color-text-soft)", fontSize: "0.875rem", margin: 0 }}>
          Sin datos de puntuación.
        </p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginBottom: penalizado ? "14px" : 0,
            }}
          >
            <div style={cardStyle}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: penalizado ? PENALTY_COLOR : "var(--color-petroleum)",
                }}
              >
                {resumen.totalPuntos}
              </div>
              <div style={kpiLabel}>Puntos</div>
            </div>
            <div style={cardStyle}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: penalizado ? PENALTY_COLOR : "var(--color-petroleum)",
                }}
              >
                {resumen.diasPenalizados}
              </div>
              <div style={kpiLabel}>Días penalizados</div>
            </div>
          </div>

          {!penalizado ? (
            <p
              style={{
                color: "var(--color-text-soft)",
                fontSize: "0.8rem",
                margin: "8px 0 0",
              }}
            >
              Sin penalizaciones en el período evaluado.
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                maxHeight: "160px",
                overflowY: "auto",
              }}
            >
              {resumen.penalizaciones.map((p) => (
                <li
                  key={p.fecha}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.8rem",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: PENALTY_COLOR,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: "var(--color-text)",
                      flex: 1,
                      textTransform: "capitalize",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatFechaLarga(p.fecha)}
                  </span>
                  <span style={{ color: PENALTY_COLOR, fontWeight: 700 }}>
                    {p.puntos}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
