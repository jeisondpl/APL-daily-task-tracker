# Prompt — Panel de Administración (Dashboard de mando)

> Refinado con la metodología **prompt-engineering-lab** (role-based scaffolding + constraint-driven + acceptance criteria + self-critique).

```markdown
### Role
Senior Fullstack Engineer (Next.js 15 App Router · React 19 · TypeScript · Prisma 6 ·
NextAuth v5), experto en Clean Architecture y RBAC, reusando el sistema de
componentes existente (MesCalendario, TareasGantt, EstadisticasDia, modales).

### Objective
Cuando un **Administrador** inicia sesión, aterriza en un **/dashboard de mando**
(NO en su propio timeline de Tareas — un admin no se asigna tareas a sí mismo).
Desde el dashboard el admin: ve a sus **colaboradores**, ve las **tareas de cada uno**,
y puede **asignarles y planificarles** tareas. Los **Empleados** siguen viendo su
propio /tareas.

### Context
- Roles: `Administrador` (planifica/asigna), `Empleado` (ejecuta).
- "Colaboradores" = todos los usuarios EXCEPTO el admin logueado (no se asigna a sí mismo).
- Las tareas tienen `ownerId`; las listas también. Una tarea referencia una lista del
  MISMO owner. Hoy la API filtra por `ownerId = sesión`.
- Reusar: MesCalendario, TareasGantt, EstadisticasDia (ResumenDia/HorasPorListaBar),
  AgregarTareaModal, EditarTareaModal, useTareasController, useListasController,
  useUsuariosController, requireAdmin/esAdmin.

### Instructions (por fases)
1. **API role-aware** (la barrera real):
   - `GET /api/tareas`: si es admin y viene `?owner=<id>`, filtra por ese owner;
     el empleado siempre ve lo suyo (ignora owner).
   - `POST /api/tareas`: si es admin y el body trae `ownerId`, crea para ese owner
     (la lista debe pertenecer a ESE owner); el empleado crea lo suyo.
   - `PUT`/`DELETE /api/tareas/[id]`: el admin puede editar/borrar CUALQUIER tarea;
     el empleado solo las suyas. El color sigue derivando de la lista del owner de la tarea.
   - `GET /api/listas-tareas`: si es admin y viene `?owner=<id>`, devuelve las listas
     de ese colaborador (para el dropdown de asignación).
2. **Plumbing cliente**: `ITareaFilters.owner?`, `ICreateTareaDTO.ownerId?`; repos y
   controllers propagan `owner`; `useListasController._list(owner?)`.
3. **Routing por rol**: `/` (server) redirige admin→`/dashboard`, empleado→`/tareas`.
   El login redirige a `/`. El admin no ve "Tareas" en el sidebar; el empleado no ve
   "Dashboard"/"Usuarios". Guards en página (la API es la barrera real).
4. **/dashboard** (admin-only): selector de colaboradores (con conteo de tareas del día),
   KPIs, y al elegir un colaborador → su MesCalendario + TareasGantt + EstadisticasDia
   del día, con "+ Asignar tarea" (crea con `ownerId` = colaborador) y editar/borrar.

### Constraints
- MUST: la API valida rol en cada operación cross-user (un empleado NO puede leer/asignar
  ajenas → 403/404). Reusar componentes, no duplicar. Tokens INDRA, sin hex de marca.
- MUST NOT: confiar solo en el front para seguridad; romper el flujo del empleado;
  permitir que el admin se asigne a sí mismo.

### Acceptance Criteria
- AC1 admin login → /dashboard · AC2 empleado login → /tareas · AC3 admin sin "Tareas" en nav
- AC4 admin ve colaboradores y elige uno · AC5 admin ve las tareas del colaborador
- AC6 admin asigna una tarea a un colaborador (queda con ownerId del colaborador)
- AC7 empleado→GET /api/tareas?owner=otro → ignora owner (ve lo suyo) · AC8 tsc+build OK

### Self-Critique
¿La API bloquea cross-user para empleados? ¿El admin puede asignar usando las listas del
colaborador? ¿Se reusaron los componentes? ¿El empleado conserva su flujo intacto?
```
