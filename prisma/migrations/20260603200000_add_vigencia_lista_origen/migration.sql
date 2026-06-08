-- Add vigencia columns to tareas_pendientes
ALTER TABLE "tareas_pendientes" ADD COLUMN "fecha_inicio" DATE;
ALTER TABLE "tareas_pendientes" ADD COLUMN "fecha_fin" DATE;

-- Add lista_id (optional) to tareas_pendientes
ALTER TABLE "tareas_pendientes" ADD COLUMN "lista_id" INTEGER;

-- Add origen_pendiente_id to tareas
ALTER TABLE "tareas" ADD COLUMN "origen_pendiente_id" INTEGER;

-- CreateIndex
CREATE INDEX "tareas_pendientes_fecha_inicio_fecha_fin_idx" ON "tareas_pendientes"("fecha_inicio", "fecha_fin");

-- AddForeignKey
ALTER TABLE "tareas_pendientes" ADD CONSTRAINT "tareas_pendientes_lista_id_fkey" FOREIGN KEY ("lista_id") REFERENCES "listas_tareas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tareas" ADD CONSTRAINT "tareas_origen_pendiente_id_fkey" FOREIGN KEY ("origen_pendiente_id") REFERENCES "tareas_pendientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
