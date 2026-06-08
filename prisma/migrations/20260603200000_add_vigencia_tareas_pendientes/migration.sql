-- Add vigencia columns with default for existing rows
ALTER TABLE "tareas_pendientes" ADD COLUMN "fecha_inicio" DATE NOT NULL DEFAULT '2026-06-03';
ALTER TABLE "tareas_pendientes" ADD COLUMN "fecha_fin" DATE NOT NULL DEFAULT '2026-06-30';
ALTER TABLE "tareas_pendientes" ALTER COLUMN "fecha_inicio" DROP DEFAULT;
ALTER TABLE "tareas_pendientes" ALTER COLUMN "fecha_fin" DROP DEFAULT;

-- Add origenPendienteId to tareas
ALTER TABLE "tareas" ADD COLUMN "origen_pendiente_id" INTEGER;
ALTER TABLE "tareas" ADD CONSTRAINT "tareas_origen_pendiente_id_fkey" FOREIGN KEY ("origen_pendiente_id") REFERENCES "tareas_pendientes"("id") ON DELETE SET NULL;

-- Indexes
CREATE INDEX "tareas_pendientes_fecha_inicio_fecha_fin_idx" ON "tareas_pendientes"("fecha_inicio", "fecha_fin");
CREATE INDEX "tareas_origen_pendiente_id_idx" ON "tareas"("origen_pendiente_id");
