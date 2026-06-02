"use client";

import {
  DayPicker,
  getDefaultClassNames,
  type DayButtonProps,
} from "react-day-picker";
import "react-day-picker/style.css";
import { es } from "date-fns/locale";
import { parseLocalDate, toISODateLocal, todayISO } from "@/shared/lib/utils";

interface Props {
  selectedDate: string; // YYYY-MM-DD
  visibleMonth: Date;
  countsByDay: Map<string, number>;
  onSelectDate: (iso: string) => void;
  onMonthChange: (month: Date) => void;
}

export function MesCalendario({
  selectedDate,
  visibleMonth,
  countsByDay,
  onSelectDate,
  onMonthChange,
}: Props) {
  const defaults = getDefaultClassNames();

  // Custom day cell: day number + a small badge with the task count.
  function DayButton(props: DayButtonProps) {
    const { day, modifiers, children, ...rest } = props;
    void modifiers;
    void children;
    const count = countsByDay.get(toISODateLocal(day.date)) ?? 0;
    return (
      <button {...rest}>
        <span>{day.date.getDate()}</span>
        {count > 0 && <span className="dtt-cal-count">{count}</span>}
      </button>
    );
  }

  function goToday() {
    const iso = todayISO();
    onSelectDate(iso);
    onMonthChange(parseLocalDate(iso));
  }

  return (
    <div
      className="dtt-calendar"
      style={
        {
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          padding: "12px",
          "--rdp-accent-color": "var(--color-petroleum)",
          "--rdp-accent-background-color": "var(--color-petroleum)",
          "--rdp-today-color": "var(--color-accent-orange)",
          "--rdp-font-family":
            '"Inter", "Segoe UI", "Roboto", system-ui, sans-serif',
        } as React.CSSProperties
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "4px",
        }}
      >
        <button
          type="button"
          onClick={goToday}
          className="dtt-cal-today-btn"
          style={{
            fontFamily: "var(--rdp-font-family)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--color-petroleum)",
            background: "transparent",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            padding: "4px 12px",
            cursor: "pointer",
          }}
        >
          Hoy
        </button>
      </div>

      <DayPicker
        mode="single"
        locale={es}
        month={visibleMonth}
        onMonthChange={onMonthChange}
        selected={parseLocalDate(selectedDate)}
        onSelect={(d) => {
          if (d) onSelectDate(toISODateLocal(d));
        }}
        showOutsideDays
        classNames={defaults}
        components={{ DayButton }}
      />
    </div>
  );
}
