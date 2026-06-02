import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function today(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

async function main() {
  const rolAdmin = await prisma.rol.upsert({
    where: { nombre: "Administrador" },
    update: {},
    create: { nombre: "Administrador" },
  });
  await prisma.rol.upsert({
    where: { nombre: "Empleado" },
    update: {},
    create: { nombre: "Empleado" },
  });

  const passwordHash = await bcrypt.hash("Demo2026!", 10);
  const admin = await prisma.usuario.upsert({
    where: { email: "admin@local" },
    update: {},
    create: {
      nombre: "Administrador",
      email: "admin@local",
      passwordHash,
      rolId: rolAdmin.id,
    },
  });

  await prisma.usuario.upsert({
    where: { email: "jeison@daily.com" },
    update: {},
    create: {
      nombre: "Jeison",
      email: "jeison@daily.com",
      passwordHash: await bcrypt.hash("Jeison2026!", 10),
      rolId: rolAdmin.id,
    },
  });

  const listaTrabajo = await prisma.listaTarea.create({
    data: {
      nombre: "Trabajo",
      descripcion: "Tareas y reuniones del día",
      colorDefault: "#004254",
      ownerId: admin.id,
    },
  });

  const listaPersonal = await prisma.listaTarea.create({
    data: {
      nombre: "Personal",
      descripcion: "Pausas y pendientes propios",
      colorDefault: "#8661F5",
      ownerId: admin.id,
    },
  });

  const fecha = today();

  await prisma.tarea.createMany({
    data: [
      {
        listaId: listaTrabajo.id,
        ownerId: admin.id,
        fecha,
        nombre: "Colsubsidio",
        horaInicio: "08:00",
        horaFin: "09:00",
        color: "#004254",
      },
      {
        listaId: listaTrabajo.id,
        ownerId: admin.id,
        fecha,
        nombre: "Agente",
        horaInicio: "09:00",
        horaFin: "09:30",
        color: "#44B757",
      },
      {
        listaId: listaTrabajo.id,
        ownerId: admin.id,
        fecha,
        nombre: "ODTT-32310",
        horaInicio: "09:30",
        horaFin: "10:30",
        color: "#8661F5",
      },
      {
        listaId: listaPersonal.id,
        ownerId: admin.id,
        fecha,
        nombre: "Almuerzo",
        horaInicio: "12:00",
        horaFin: "13:00",
        color: "#C0392B",
      },
      {
        listaId: listaTrabajo.id,
        ownerId: admin.id,
        fecha,
        nombre: "Revisión de PRs",
        horaInicio: "15:00",
        horaFin: "16:30",
        color: "#E56813",
      },
    ],
  });

  const tareas = await prisma.tarea.count({ where: { ownerId: admin.id } });
  console.log(
    `Seed OK -> 1 admin (admin@local / Demo2026!), 2 listas, ${tareas} tareas`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
