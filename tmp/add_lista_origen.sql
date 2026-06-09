ALTER TABLE "tareas_pendientes" ADD COLUMN IF NOT EXISTS "lista_id" INTEGER;
ALTER TABLE "tareas" ADD COLUMN IF NOT EXISTS "origen_pendiente_id" INTEGER;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tareas_pendientes_lista_id_fkey') THEN
    ALTER TABLE "tareas_pendientes" ADD CONSTRAINT "tareas_pendientes_lista_id_fkey" FOREIGN KEY ("lista_id") REFERENCES "listas_tareas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tareas_origen_pendiente_id_fkey') THEN
    ALTER TABLE "tareas" ADD CONSTRAINT "tareas_origen_pendiente_id_fkey" FOREIGN KEY ("origen_pendiente_id") REFERENCES "tareas_pendientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
