# Sistema de Diseño — Variante APL (INDRA)

Este documento define los tokens, convenciones visuales y reglas de uso que rigen la interfaz de Daily Task Tracker. La variante aplicada es **APL**: fondo de página beige cálido, superficies blancas, tipografía Inter y paleta corporativa INDRA.

---

## Paleta corporativa

| Token                    | Hex       | Uso principal                                                        |
|--------------------------|-----------|----------------------------------------------------------------------|
| `--color-petroleum`      | `#004254` | Color de marca primario; encabezados de tabla, sidebar activo, foco  |
| `--color-deep-navy`      | `#002532` | Fondo del sidebar, texto principal                                   |
| `--color-warm-gray`      | `#AAAA9F` | Bordes secundarios, placeholders, iconos inactivos                   |
| `--color-dark-gray`      | `#646459` | Texto suave, etiquetas secundarias                                   |
| `--color-bg`             | `#E3E2DA` | Fondo de página (body/html)                                          |
| `--color-surface`        | `#FFFFFF` | Superficie de cards, modales, inputs                                 |
| `--color-border`         | `#BCBBB5` | Bordes de inputs, separadores                                        |
| `--color-success`        | `#44B757` | Estados positivos, dot de ítem activo en sidebar                     |
| `--color-accent-purple`  | `#8661F5` | Acentos, badges de categoría, highlights                             |
| `--color-accent-orange`  | `#E56813` | Advertencias, CTAs secundarios, alertas                              |
| `--color-text`           | `#002532` | Texto principal (alias de `deep-navy`)                               |
| `--color-text-soft`      | `#646459` | Texto secundario (alias de `dark-gray`)                              |
| `--color-text-invert`    | `#FFFFFF` | Texto sobre fondos oscuros (petroleum, deep-navy)                    |

### Nota clave: Tailwind v4 no usa `tailwind.config.ts`

En Tailwind v4 los tokens viven en el bloque `@theme` dentro de `src/styles/globals.css`. No existe `tailwind.config.ts` para tokens personalizados. El bloque `@theme` genera simultáneamente las utilidades de clase (`bg-petroleum`, `rounded-card`, `shadow-card`) **y** las variables CSS nativas (`var(--color-petroleum)`):

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  --color-petroleum:      #004254;
  --color-deep-navy:      #002532;
  --color-warm-gray:      #AAAA9F;
  --color-dark-gray:      #646459;
  --color-bg:             #E3E2DA;
  --color-surface:        #FFFFFF;
  --color-border:         #BCBBB5;
  --color-success:        #44B757;
  --color-accent-purple:  #8661F5;
  --color-accent-orange:  #E56813;
  --color-text:           #002532;
  --color-text-soft:      #646459;
  --color-text-invert:    #FFFFFF;

  --radius-card:          12px;
  --shadow-card:          0 2px 8px rgba(0, 37, 50, 0.10);
}
```

---

## Paleta de estados y badges

| Estado    | Color de fondo (rgba)          | Color de texto | Uso                               |
|-----------|--------------------------------|----------------|-----------------------------------|
| `success` | `rgba(68, 183, 87, 0.12)`      | `#2D8A3E`      | Tarea completada, estado OK       |
| `warning` | `rgba(229, 104, 19, 0.12)`     | `#B85210`      | Próxima a vencer, atención        |
| `info`    | `rgba(134, 97, 245, 0.12)`     | `#6B45D4`      | Información contextual            |
| `neutral` | `rgba(170, 170, 159, 0.20)`    | `#646459`      | Sin estado, archivado             |
| `danger`  | `rgba(192, 57, 43, 0.12)`      | `#C0392B`      | Error, tarea vencida, eliminación |

---

## Convenciones UI

### Border radius

| Elemento              | Clase Tailwind | Valor   |
|-----------------------|----------------|---------|
| Botones pequeños (sm) | `rounded-md`   | 6 px    |
| Inputs / botones      | `rounded-lg`   | 8 px    |
| Cards / modales       | `rounded-card` | 12 px   |
| Badges / chips        | `rounded-full` | 9999 px |

### Sidebar

- Fondo: `bg-deep-navy` (`#002532`).
- Ítem activo: fondo `bg-petroleum` (`#004254`) + dot lateral con `bg-success` (`#44B757`).
- Texto de ítems: `text-text-invert` en reposo e ítem activo.
- Separadores: `border-warm-gray/20`.

### Tabla

- Encabezado (`<thead>`): fondo `bg-petroleum`, texto `text-text-invert`, peso `font-semibold`.
- Filas impares: `bg-surface`; filas pares: `bg-bg/60` (cebrado suave).
- Bordes de celda: `border-border`.

### Modal / Dialog

- Backdrop: `rgba(0, 37, 50, 0.55)` con `backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)` (prefijo `-webkit-` obligatorio para Safari).
- Superficie: `bg-surface rounded-card shadow-card`.
- Encabezado del modal: borde inferior `border-border`.

### Foco accesible

- Todos los elementos interactivos deben usar `focus-visible:outline-2 focus-visible:outline-petroleum focus-visible:outline-offset-2`.
- El outline no se elimina; puede ajustarse visualmente pero debe existir para accesibilidad.

---

## Regla de oro

> Usar siempre `var(--color-*)` o las utilidades generadas por Tailwind (`bg-petroleum`, `text-deep-navy`, etc.).
> **Nunca** escribir un valor hex de marca hardcodeado dentro de un componente o en cualquier archivo CSS ajeno a `globals.css`.

Esta regla garantiza que un cambio de token en `@theme` se propague automáticamente a toda la UI sin búsquedas manuales.
