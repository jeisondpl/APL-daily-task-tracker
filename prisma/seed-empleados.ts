import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMPLEADOS = [
  { nombre: "L.S. Ortiz P.", email: "lsortizp@daily.com" },
  { nombre: "A.F. Cáceres", email: "afcaceres@daily.com" },
  { nombre: "C.S. Martínez H.", email: "csmartinezh@daily.com" },
];

async function main() {
  const rolEmpleado = await prisma.rol.findUnique({
    where: { nombre: "Empleado" },
  });
  if (!rolEmpleado) throw new Error('El rol "Empleado" no existe.');

  const passwordHash = await bcrypt.hash("Empleado2026!", 10);

  for (const e of EMPLEADOS) {
    const usuario = await prisma.usuario.upsert({
      where: { email: e.email },
      update: { nombre: e.nombre, rolId: rolEmpleado.id },
      create: {
        nombre: e.nombre,
        email: e.email,
        passwordHash,
        rolId: rolEmpleado.id,
        activo: true,
      },
    });

    // Give each employee a default list so they can be assigned tasks at once.
    const tieneLista = await prisma.listaTarea.findFirst({
      where: { ownerId: usuario.id },
    });
    if (!tieneLista) {
      await prisma.listaTarea.create({
        data: {
          nombre: "General",
          descripcion: "Lista por defecto",
          colorDefault: "#004254",
          ownerId: usuario.id,
        },
      });
    }
  }

  const users = await prisma.usuario.findMany({
    include: { rol: true, _count: { select: { listasTareas: true } } },
    orderBy: { id: "asc" },
  });
  for (const u of users) {
    console.log(
      `  ${u.email} → ${u.rol.nombre} · ${u._count.listasTareas} lista(s)`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
