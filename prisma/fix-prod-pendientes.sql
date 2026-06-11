-- Fix producción: columnas de vigencia/origen para tareas-pendientes.
-- Idempotente y aditivo (no borra ni modifica datos existentes).

ALTER TABLE "tareas_pendientes" ADD COLUMN IF NOT EXISTS "fecha_inicio" DATE;
ALTER TABLE "tareas_pendientes" ADD COLUMN IF NOT EXISTS "fecha_fin" DATE;
ALTER TABLE "tareas_pendientes" ADD COLUMN IF NOT EXISTS "lista_id" INTEGER;
ALTER TABLE "tareas" ADD COLUMN IF NOT EXISTS "origen_pendiente_id" INTEGER;

-- Backfill de filas viejas para que las fechas no queden nulas
UPDATE "tareas_pendientes" SET "fecha_inicio" = CURRENT_DATE WHERE "fecha_inicio" IS NULL;
UPDATE "tareas_pendientes" SET "fecha_fin" = CURRENT_DATE WHERE "fecha_fin" IS NULL;

-- Foreign keys (guardadas: no fallan si ya existen)
DO $$ BEGIN
  ALTER TABLE "tareas_pendientes" ADD CONSTRAINT "tareas_pendientes_lista_id_fkey"
    FOREIGN KEY ("lista_id") REFERENCES "listas_tareas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "tareas" ADD CONSTRAINT "tareas_origen_pendiente_id_fkey"
    FOREIGN KEY ("origen_pendiente_id") REFERENCES "tareas_pendientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Índices
CREATE INDEX IF NOT EXISTS "tareas_pendientes_fecha_inicio_fecha_fin_idx"
  ON "tareas_pendientes"("fecha_inicio", "fecha_fin");
CREATE INDEX IF NOT EXISTS "tareas_origen_pendiente_id_idx"
  ON "tareas"("origen_pendiente_id");
