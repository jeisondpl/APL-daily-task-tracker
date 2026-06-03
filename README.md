# Daily Task Tracker

Planificador de tareas diarias con línea de tiempo horaria (slots de 30 min, 08:00–18:00), CRUD de tareas y listas, autenticación con credenciales via NextAuth v5 y persistencia en PostgreSQL mediante Prisma 6.

---

## Stack

| Librería / Herramienta | Versión         |
|------------------------|-----------------|
| Next.js                | 15 (App Router) |
| React                  | 19              |
| TypeScript             | 5               |
| Tailwind CSS           | v4 (CSS-first, tokens `@theme`) |
| Prisma                 | 6               |
| NextAuth               | v5 beta         |
| react-hook-form        | latest          |
| Zod                    | latest          |
| Zustand                | latest          |
| Axios                  | latest          |
| bcryptjs               | latest          |
| pnpm                   | 10              |

---

## Requisitos

- **Node.js** ≥ 20
- **pnpm** 10 (`npm i -g pnpm@10`)
- **Docker** (para la base de datos local) **o** una cuenta en [Neon](https://neon.tech) (para entornos cloud)

---

## Instalación local

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Levantar PostgreSQL con Docker

```bash
docker run -d \
  --name dtt-postgres \
  -e POSTGRES_USER=dtt \
  -e POSTGRES_PASSWORD=dttpass \
  -e POSTGRES_DB=daily_task_tracker \
  -p 5435:5432 \
  postgres:16-alpine
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

El `.env` local ya viene preconfigurado para apuntar al contenedor Docker:

```env
DATABASE_URL="postgresql://dtt:dttpass@localhost:5435/daily_task_tracker"
DIRECT_URL="postgresql://dtt:dttpass@localhost:5435/daily_task_tracker"
AUTH_SECRET="<generá uno con: openssl rand -base64 32>"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

> Para generar `AUTH_SECRET`: `openssl rand -base64 32`

### 4. Correr migraciones

```bash
pnpm prisma migrate dev
```

### 5. Poblar la base de datos

```bash
pnpm db:seed
```

### 6. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Credenciales de prueba

| Campo      | Valor       |
|------------|-------------|
| Email      | admin@local |
| Contraseña | Demo2026!   |

---

## Estructura de carpetas

```
src/
├── app/                         # Next.js App Router (rutas, layouts, pages)
├── auth.config.ts               # Configuración Edge-safe de NextAuth
├── auth.ts                      # Configuración Node.js de NextAuth
├── middleware.ts                 # Middleware de autenticación
├── modules/                     # Módulos de negocio (Clean Architecture + vertical slicing)
│   ├── tasks/
│   │   ├── domain/              # Entidades, value objects, contratos de repositorio
│   │   ├── application/         # Casos de uso
│   │   ├── infrastructure/      # Repositorios Prisma, mappers
│   │   └── presentation/        # Componentes, hooks, stores Zustand
│   └── lists/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
├── shared/
│   └── components/
│       ├── ui/                  # Botones, inputs, badges, modales
│       └── layout/              # Sidebar, Header, PageWrapper
├── styles/
│   └── globals.css              # Tokens @theme de Tailwind v4
└── views/                       # Páginas compuestas (ensamblado de módulos)
```

---

## Scripts

| Script           | Descripción                                                 |
|------------------|-------------------------------------------------------------|
| `pnpm dev`       | Servidor de desarrollo con hot-reload                       |
| `pnpm build`     | Build de producción                                         |
| `pnpm db:migrate`| Ejecuta migraciones pendientes (`prisma migrate deploy`)    |
| `pnpm db:seed`   | Pobla la base con datos iniciales                           |
| `pnpm db:reset`  | Resetea la BD y re-corre seed                               |
| `pnpm lint`      | Análisis estático con ESLint                                |

---

## Deploy a Vercel + Neon

### 1. Crear la base de datos en Neon

1. Entrá a [neon.tech](https://neon.tech) y creá un proyecto nuevo.
2. Elegí región **AWS us-east-1** (menor latencia con Vercel).
3. En el dashboard de Neon, copiá:
   - **Pooled connection string** → `DATABASE_URL`
   - **Unpooled / direct connection string** → `DIRECT_URL`

### 2. Subir el código a GitHub

```bash
git push origin main
```

### 3. Importar el repositorio en Vercel

1. Entrá a [vercel.com](https://vercel.com) → **Add New Project**.
2. Importá el repo desde GitHub.
3. Vercel detecta Next.js automáticamente.

### 4. Configurar variables de entorno en Vercel

Agregá las siguientes variables en **Settings → Environment Variables**, habilitadas para los entornos **Production** y **Preview**:

| Variable              | Valor                                          |
|-----------------------|------------------------------------------------|
| `DATABASE_URL`        | Pooled connection string de Neon               |
| `DIRECT_URL`          | Unpooled connection string de Neon             |
| `AUTH_SECRET`         | Resultado de `openssl rand -base64 32`         |
| `AUTH_URL`            | URL de producción, ej: `https://tu-app.vercel.app` |
| `NEXT_PUBLIC_API_URL` | URL de producción, ej: `https://tu-app.vercel.app` |

### 5. Correr migraciones y seed en producción

```bash
pnpm prisma migrate deploy
pnpm db:seed
```

> Podés ejecutar estos comandos desde tu máquina local apuntando a la `DATABASE_URL` de Neon (usando `DIRECT_URL` para las migraciones).

### 6. Verificar

Abrí la URL de Vercel y verificá el login con `admin@local` / `Demo2026!`.
