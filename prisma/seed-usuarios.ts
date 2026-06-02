import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Rename the legacy "ADMIN" role to "Administrador" (keeps user FKs intact).
  const legacy = await prisma.rol.findUnique({ where: { nombre: "ADMIN" } });
  if (legacy) {
    await prisma.rol.update({
      where: { id: legacy.id },
      data: { nombre: "Administrador" },
    });
  }

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

  // Create jeison@daily.com as Administrador.
  const passwordHash = await bcrypt.hash("Jeison2026!", 10);
  await prisma.usuario.upsert({
    where: { email: "jeison@daily.com" },
    update: { rolId: rolAdmin.id },
    create: {
      nombre: "Jeison",
      email: "jeison@daily.com",
      passwordHash,
      rolId: rolAdmin.id,
    },
  });

  const roles = await prisma.rol.findMany({ orderBy: { id: "asc" } });
  const users = await prisma.usuario.findMany({ include: { rol: true } });
  console.log("Roles:", roles.map((r) => r.nombre).join(", "));
  console.log(
    "Usuarios:",
    users.map((u) => `${u.email} → ${u.rol.nombre}`).join(" | "),
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
