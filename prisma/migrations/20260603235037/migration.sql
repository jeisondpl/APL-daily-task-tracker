-- DropForeignKey
ALTER TABLE "tareas" DROP CONSTRAINT "tareas_origen_pendiente_id_fkey";

-- AddForeignKey
ALTER TABLE "tareas" ADD CONSTRAINT "tareas_origen_pendiente_id_fkey" FOREIGN KEY ("origen_pendiente_id") REFERENCES "tareas_pendientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
