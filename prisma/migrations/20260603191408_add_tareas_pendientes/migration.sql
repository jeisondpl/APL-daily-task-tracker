-- CreateTable
CREATE TABLE "tareas_pendientes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(300) NOT NULL,
    "descripcion" TEXT,
    "color" VARCHAR(20) NOT NULL DEFAULT '#10B981',
    "creado_por_id" INTEGER NOT NULL,
    "asignado_a_id" INTEGER,
    "reclamada" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tareas_pendientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tareas_pendientes_asignado_a_id_idx" ON "tareas_pendientes"("asignado_a_id");

-- AddForeignKey
ALTER TABLE "tareas_pendientes" ADD CONSTRAINT "tareas_pendientes_creado_por_id_fkey" FOREIGN KEY ("creado_por_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tareas_pendientes" ADD CONSTRAINT "tareas_pendientes_asignado_a_id_fkey" FOREIGN KEY ("asignado_a_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
