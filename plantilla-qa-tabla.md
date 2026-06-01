# Plantilla QA — Registro de Issues

## Tabla de issues

| No. | Tester | Fecha | Módulo | Tipo | Severidad | Prioridad | Descripción | Pasos | Esperado | Obtenido | Evidencia | Estado | Asignado | Resuelto | Comentarios |
|-----|--------|-------|--------|------|-----------|-----------|-------------|-------|----------|----------|-----------|--------|----------|----------|-------------|
| 001 | María López | 2026-06-01 | Tareas | Bug | Alta | P1 | Al arrastrar una tarea al slot de las 12:00 el modal de edición se abre vacío | 1. Iniciar sesión. 2. Crear una tarea en el slot 09:00. 3. Arrastrar la tarea al slot 12:00. 4. Hacer clic en la tarea para editarla. | El modal debe mostrar los datos de la tarea (título, descripción, lista). | El modal se abre con todos los campos en blanco. | `screenshot-001.png` | Abierto | Carlos Ruiz | — | Reproducible en Chrome 125 y Firefox 126. No ocurre al refrescar la página. |
| 002 | Juan Pérez | 2026-06-02 | Listas | Mejora | Baja | P3 | Agregar confirmación visual (toast) al eliminar una lista | 1. Iniciar sesión. 2. Ir a la sección de Listas. 3. Eliminar cualquier lista existente. | Debe aparecer un toast de confirmación indicando que la lista fue eliminada. | La lista desaparece sin ningún feedback visual al usuario. | — | Abierto | — | — | El comportamiento actual no es un error, pero impacta la experiencia de usuario. |

---

## Leyenda de valores válidos

| Campo       | Valores aceptados                                    |
|-------------|------------------------------------------------------|
| **Tipo**    | `Bug` / `Mejora` / `Consulta`                        |
| **Severidad** | `Crítica` / `Alta` / `Media` / `Baja`              |
| **Prioridad** | `P1` (urgente) / `P2` (normal) / `P3` (baja)      |
| **Estado**  | `Abierto` / `En progreso` / `Resuelto` / `Cerrado` / `Descartado` |
