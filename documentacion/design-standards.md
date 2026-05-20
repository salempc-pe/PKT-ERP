---
trigger: always
---

# PKT ERP — Estándares de Diseño UI

> Este archivo es la **fuente de verdad** para toda la estética visual de PKT ERP.
> Todos los módulos DEBEN respetar estos estándares sin excepción.

> **REGLA GLOBAL DE SOMBRAS**: PKT ERP **NO usa sombras** (`shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`) en ningún elemento de los módulos (cards, KPIs, tablas, botones inline, tarjetas Kanban, contenedores). La referencia de estilo es el módulo **CRM**. Las únicas excepciones permitidas son:
> 1. El panel del modal (`shadow-2xl`) — para separarlo visualmente del backdrop.
> 2. El `hover:shadow-[0_0_20px_rgba(...)]` en botones primarios — efecto glow controlado.

---

## 1. TOKENS DE COLOR (CSS Variables)

### Dark Mode (default `:root`)
| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#6B4FD8` | Acento principal, tabs activos, botones primarios |
| `--color-background` | `#1A1A1A` | Fondo general de la app |
| `--color-surface` | `#1A1A1A` | Superficies base |
| `--color-on-surface` | `#F7F7F5` | Texto principal sobre superficies |
| `--color-on-surface-variant` | `#a3aac4` | Texto secundario, labels |
| `--color-surface-container` | `#141414` | Contenedores, inputs, cards |
| `--color-surface-container-low` | `#0f0f0f` | Contenedores con menos jerarquía |
| `--color-surface-container-high` | `#1a1a1a` | Contenedores elevados |
| `--color-surface-variant` | `#222531` | Fondo de thead en tablas, columnas Kanban |
| `--color-outline-variant` | `rgba(64, 72, 93, 0.2)` | Bordes sutiles |
| `--color-primary-container` | `#ede9fb` | Fondo de tags/badges con tono primario |

### Light Mode (`:root.light`)
| Token | Valor |
|---|---|
| `--color-background` | `#F7F7F5` |
| `--color-surface` | `#F7F7F5` |
| `--color-on-surface` | `#1A1A1A` |
| `--color-on-surface-variant` | `#555555` |
| `--color-surface-container` | `#FFFFFF` |
| `--color-surface-container-low` | `#FFFFFF` |
| `--color-surface-container-high` | `#efefec` |
| `--color-surface-variant` | `#e2dcff` |
| `--color-outline-variant` | `#e0e0de` |

### Colores Funcionales (hardcoded)
| Color | Hex | Uso |
|---|---|---|
| Verde éxito | `#85ffab` | Totales positivos, botón de confirmar pagos |
| Rojo error | `#ff716c` / `#ff6b6b` | Alertas, egresos, eliminar |
| Amber alerta | `amber-500` | Stock bajo, salidas de bodega |
| Verde estado | `green-400` | Estado "Pagada", "Ingreso" |
| Rojo estado | `red-400` | Estado "Anulada", "Egreso", "Perdido" |
| Amarillo estado | `yellow-400` | Estado "Pendiente" |
| Azul pipeline | `#5391ff` | Etapa "Ganado" en CRM |

---

## 2. TIPOGRAFÍA

| Familia | Variable | Uso |
|---|---|---|
| **Outfit** | `--font-display` | Títulos, headers, nombres de módulo |
| **Inter** | `--font-body` | Cuerpo, labels, datos de tabla |

### Escala tipográfica estándar
| Elemento | Tamaño | Peso | Extra |
|---|---|---|---|
| Labels de formulario | `text-[10px]` | `font-black` | `uppercase tracking-widest` |
| Labels de tabla (thead) | `text-[10px]` | `font-black` | `uppercase tracking-widest` |
| Texto de tabla (tbody) | `text-sm` (14px) | `font-bold` | — |
| Badges / Status | `text-[9px]` o `text-[10px]` | `font-black` | `uppercase tracking-widest` |
| Tags | `text-[9px]` | `font-bold` | — |
| KPI título | `text-[10px]` | `font-bold` | `uppercase tracking-widest` |
| KPI valor | `text-lg` | `font-black` | `font-mono leading-tight` |
| Encabezados de columna Kanban | `text-[10px]` | `font-black` | `uppercase tracking-tighter` |
| Descripción secundaria | `text-[10px]` o `text-[11px]` | normal o `font-medium` | — |

---

## 3. PESTAÑAS (TABS)

### Desktop Tabs (referencia: CRM, Bodega, Proyectos)
```
Contenedor:
  className="hidden md:flex p-1 bg-[var(--color-surface-container)]/50 rounded-xl w-fit border border-[var(--color-outline-variant)]"

Botón de Tab:
  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
  
  Activo:   "bg-[#6B4FD8] text-[#002150]"
  Inactivo: "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
```

### Mobile Tabs (select nativo)
```
Contenedor:
  className="md:hidden relative w-full"

Select:
  className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] font-bold rounded-xl border border-[var(--color-outline-variant)] px-4 py-3 outline-none appearance-none focus:border-[#6B4FD8]"

Icono Chevron:
  className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-on-surface-variant)]"
  → <ChevronDown size={18} />
```

**Reglas:**
- Siempre incluir icono `size={14}` antes del texto del tab.
- Tab activo siempre usa `bg-[#6B4FD8] text-[#002150]`.
- El contenedor de tabs puede ir acompañado de un botón de acción principal a la derecha.

---

## 4. BOTONES

### Botón Primario (acción principal)
```
className="bg-[#6B4FD8] text-[#002150] font-bold px-4 py-2 text-sm rounded-lg flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all"
```
- Icono: `size={16}` a la izquierda del texto.
- Usado para: "Iniciar Lead", "Nueva Tarea", "Emitir Factura", "Registrar Ingreso", etc.

### Botón Secundario (acción alternativa)
```
className="bg-[var(--color-surface-container)] text-[var(--color-primary)] font-bold px-6 py-2.5 rounded-xl border border-[#6B4FD8]/20 hover:bg-[#6B4FD8]/10 transition-all text-sm"
```
- Usado para: "Emitir Boleta", acciones no principales.

### Botón Cancelar (en modales)
```
className="flex-1 px-4 py-3 rounded-xl font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors"
```

### Botón Submit (en modales)
```
className="flex-1 bg-[#6B4FD8] text-[#002150] font-black px-4 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(133,173,255,0.4)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
```
- Cuando está en saving: mostrar `<Loader2 size={18} className="animate-spin" />`

### Botón de Acción en Tabla (inline)
```
Positivo (Pagado/Siguiente):
  className="text-[9px] font-black uppercase tracking-tighter bg-green-500/20 text-green-400 px-2 py-0.5 border border-green-500/20 rounded hover:bg-green-500 hover:text-white transition-all shadow-sm"

Negativo (Anular/Eliminar):
  className="text-[9px] font-black uppercase tracking-tighter bg-red-500/20 text-red-400 px-2 py-0.5 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-all shadow-sm"
```

### Botones de Ícono (editar/eliminar)
```
Editar: className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
Eliminar: className="text-[var(--color-on-surface-variant)] hover:text-red-400 transition-colors"
Tamaño ícono: size={14} a size={16}
```

---

## 5. PASTILLAS KPI (Stats Cards)

### Patrón estándar (Ventas, Bodega, Finanzas)
```
Contenedor:
  className="bg-[var(--color-surface-container-low)] p-5 rounded-2xl border border-[var(--color-outline-variant)] transition-all flex items-center gap-4"

Icono wrapper:
  className="w-12 h-12 rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center border border-[var(--color-outline-variant)]/30"
  → Icono: size={24}, color según contexto

Label:
  className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1"

Valor:
  className="text-lg font-black text-[var(--color-on-surface)] font-mono leading-tight"
```

**Reglas:**
- Grid: `hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6` (ocultas en móvil).
- El valor monetario siempre usa `font-mono`.
- Colores de ícono varían según contexto (primary, verde, rojo, amber, etc.).

---

## 6. DASHBOARD CARDS (Pastillas del Dashboard)

### Componente `<DashboardCard>` (referencia: `DashboardCard.jsx`)
```
Container:
  className="group relative bg-[var(--color-surface-container)] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-sm hover:shadow-xl hover:bg-[var(--color-surface-container-high)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer"
  style={{ borderColor: `${color}15` }}

Icono wrapper:
  className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
  style={{ backgroundColor: `${color}20`, color: color }}

Título:
  className="text-lg md:text-xl font-black text-[var(--color-on-surface)] leading-tight"

Descripción:
  className="text-[10px] md:text-xs text-[var(--color-on-surface-variant)] font-medium leading-tight mt-0.5 line-clamp-1"

Métricas grid:
  className="mt-auto grid grid-cols-2 gap-4 pt-4 md:pt-6 border-t border-white/5 relative z-10"

Hover stripe (bottom):
  className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
  style={{ backgroundColor: color }}
```

**Reglas:**
- Cada card recibe `color` prop (hex) que define el acento visual.
- Siempre incluir `metrics` array con `{ label, value }`.
- Background glow en hover: `blur-[60px] opacity-0 group-hover:opacity-20`.

---

## 7. TABLAS

### Estructura estándar (CRM, Ventas, Bodega, Finanzas)
```
Container wrapper:
  className="overflow-x-auto -mx-4 md:mx-0 border-y md:border border-[var(--color-outline-variant)] md:rounded-2xl bg-transparent md:bg-[var(--color-surface-container-low)] overflow-hidden"
  ⚠️ SIN shadow. No agregar shadow-sm ni hover:shadow-md.

Table:
  className="w-full text-left border-collapse"

Thead row:
  className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black"

Th cell:
  className="px-4 py-2.5"

Tbody:
  className="divide-y divide-[#40485d]/10 text-sm"
  (alt: "divide-y divide-[var(--color-outline-variant)]/30 text-sm")

Tbody row:
  className="hover:bg-[var(--color-surface-container)]/40 transition-colors group"

Td cell:
  className="px-4 py-2"

Empty state:
  className="px-6 py-10 text-center text-[var(--color-on-surface-variant)] italic"
  → colSpan completo
```

**Reglas:**
- En móvil: `-mx-4` para full-bleed + `border-y`.
- En desktop: margen normal + `md:rounded-2xl` + `md:border`.
- Thead siempre usa `bg-[var(--color-surface-variant)]`.
- Padding consistente: `px-4 py-2.5` en th, `px-4 py-2` en td.

---

## 8. BADGES / STATUS PILLS

### Status badges en tablas
```
Pagada/OK:   "inline-flex items-center px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[9px] font-black tracking-widest uppercase rounded"
Pendiente:   "inline-flex items-center px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 text-[9px] font-black tracking-widest uppercase rounded"
Anulada/Err: "inline-flex items-center px-1.5 py-0.5 bg-red-500/10 text-red-400 text-[9px] font-black tracking-widest uppercase rounded"
Borrador:    "inline-flex items-center px-1.5 py-0.5 bg-[#40485d]/30 text-[var(--color-on-surface-variant)] text-[9px] font-black tracking-widest uppercase rounded"
Ingreso:     "px-2 py-1 rounded text-[10px] font-black uppercase bg-green-500/10 text-green-400"
Salida:      "px-2 py-1 rounded text-[10px] font-black uppercase bg-amber-500/10 text-amber-500"
```

### Priority badges (Kanban)
```
Alta:  "text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-bold"
Media: "text-[9px] bg-[#6B4FD8]/10 text-[var(--color-primary)] px-1.5 py-0.5 rounded border border-[#6B4FD8]/20 uppercase font-bold"
Baja:  "text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase font-bold"
```

### Tags (etiquetas de entidad)
```
className="bg-[var(--color-primary-container)]/30 text-[var(--color-primary)] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[var(--color-primary-container)]/40 select-none"
```

---

## 9. KANBAN / TARJETAS EN CONTENEDORES

### Columna Kanban
```
Header:
  className="flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter text-[var(--color-on-surface-variant)]"
  → Dot: className="w-1.5 h-1.5 rounded-full ${column.color}"

Container:
  className="flex flex-col gap-3 p-3 bg-[var(--color-surface-variant)]/40 border border-[var(--color-outline-variant)] rounded-2xl h-full min-h-[300px]"
```

### Tarjeta Kanban
```
Card:
  className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] p-4 rounded-xl hover:border-[#6B4FD8]/50 transition-all cursor-pointer group relative overflow-hidden"
  ⚠️ SIN shadow-sm. La elevación se comunica solo con el borde activo.

Franja lateral de color:
  className="absolute top-0 left-0 w-1 h-full opacity-20 ${column.color}"

Nombre:
  className="font-bold text-[var(--color-on-surface)] text-sm leading-tight group-hover:text-[var(--color-primary)] transition-colors"

Subtítulo empresa:
  className="text-[10px] text-[var(--color-primary)] font-black uppercase tracking-tight"

Descripción:
  className="text-[11px] text-[var(--color-on-surface-variant)] line-clamp-2 leading-tight opacity-70 italic"
```

**Reglas:**
- Siempre incluir la franja de color lateral (`w-1 h-full opacity-20`).
- Grid: `grid-cols-1 md:grid-cols-3` para 3 columnas o `md:grid-cols-4` para 4 (CRM Pipeline).
- Contenedor de columna siempre usa `bg-[var(--color-surface-variant)]/40`.
- Botones de acción se muestran en hover: `opacity-0 group-hover:opacity-100`.

---

## 10. MODALES

### Overlay
```
Container:  className="fixed inset-0 z-50 flex items-center justify-center p-4"
Backdrop:   className="absolute inset-0 bg-black/60 backdrop-blur-sm"
```

### Panel del Modal
```
className="bg-[var(--color-surface-variant)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300"
  ✅ EXCEPCIÓN: el modal SÍ lleva shadow-2xl para separarse visualmente del backdrop.
```

### Header del Modal
```
className="p-6 border-b border-[#40485d]/20 flex justify-between items-center"
Título: className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm"
Cerrar: <X size={20} /> con "text-[var(--color-on-surface-variant)] hover:text-white transition-colors"
```

### Body del Modal
```
className="p-6 space-y-4"
```

### Footer del Modal
```
className="p-6 bg-[var(--color-surface-container)] flex gap-3"
→ Botón Cancelar (flex-1) + Botón Submit (flex-1 o flex-[2])
```

---

## 11. FORMULARIOS (INPUTS)

### Input de texto estándar
```
className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50"
```

### Select estándar
```
className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none text-sm"
```

### Label de campo
```
className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase"
```

### Textarea
```
className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] outline-none text-sm resize-none"
```

### Barra de búsqueda
```
Container: className="relative w-full sm:w-64"
Icono: <Search size={16} /> con "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
Input: className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-transparent focus:border-[#6B4FD8] transition-all"
```

---

## 12. ANIMACIONES Y TRANSICIONES

| Animación | Uso | Clase |
|---|---|---|
| Entrada de módulo | Carga inicial de vista | `animate-in fade-in duration-500` |
| Entrada de modal | Apertura | `animate-in zoom-in duration-300` |
| Entrada de contenido | Tabs, sub-vistas | `animate-in slide-in-from-bottom-4 duration-500` |
| Hover cards | Dashboard cards | `hover:-translate-y-1 transition-all duration-300` |
| Hover glow | Botón primario | `hover:shadow-[0_0_20px_rgba(133,173,255,0.3)]` |
| Loading spinner | Saving state | `<Loader2 className="animate-spin" />` |
| Skeleton loading | Datos cargando | `animate-pulse` con fondo `bg-white/5` |

---

## 13. ICONOGRAFÍA

- **Librería**: Lucide React exclusivamente.
- **Tamaños estándar**:
  - En tabs: `size={14}`
  - En botones: `size={16}`
  - En KPI cards: `size={24}`
  - En acciones de tabla: `size={14}` a `size={16}`
  - En badge/status: `size={12}`
- **Stroke width**: Default (2) para general, `strokeWidth={2.5}` en dashboard cards.

---

## 14. ESPACIADO Y LAYOUT

| Elemento | Espaciado |
|---|---|
| Separación entre secciones | `space-y-6` a `space-y-8` |
| Gap en grid de KPIs | `gap-6` |
| Gap en grid de Kanban | `gap-6` |
| Padding interno de cards | `p-4` a `p-6` |
| Padding de modal body | `p-6` |
| Padding de celdas tabla | `px-4 py-2.5` (th), `px-4 py-2` (td) |
| Border radius cards | `rounded-2xl` |
| Border radius modales | `rounded-3xl` |
| Border radius botones | `rounded-lg` |
| Border radius inputs | `rounded-xl` |
| Border radius tabs | `rounded-lg` (botón) dentro de `rounded-xl` (container) |

---

## 15. RESPONSIVE

| Breakpoint | Comportamiento |
|---|---|
| Mobile (<768px) | Tabs → select nativo, KPIs ocultos, tablas full-bleed con `-mx-4`, grids de 1 columna |
| Tablet (md: 768px+) | Tabs visibles, tablas con borde and rounded, grids de 2-3 columnas |
| Desktop (lg: 1024px+) | KPIs visibles, grids de 3-4 columnas |

---

## 16. ERRORES Y ALERTAS

### Error en modal
```
className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 text-red-300 text-xs animate-pulse"
→ Icono: <AlertCircle size={18} />
```

### Estado disabled
```
Botones: disabled:opacity-50 disabled:grayscale
Inputs: disabled:opacity-50
```

---

## 17. DIRECTIVA DE ALTA DENSIDAD (DISEÑO COMPACTO)

Para evitar interfaces recargadas y optimizar el espacio útil de trabajo en los módulos operativos del ERP (como Inventario e Inmobiliaria), se establece una directiva de diseño de alta densidad.

### 17.1. Buscadores y Filtros Flotantes (Sin "Pastillas")
- **Regla**: Los buscadores de texto y filtros de tablas no deben estar encapsulados en contenedores con fondo tipo tarjeta o "pastilla" (`bg-[var(--color-surface-container-low)]`, bordes y paddings excesivos).
- **Diseño**: Deben colocarse/flotar **directamente sobre el fondo limpio** de la página de trabajo.
- **Estilo de Inputs**: Utilizar fondo `bg-[var(--color-surface-container)]` con bordes sutiles `border-[var(--color-outline-variant)]` para garantizar legibilidad, con tamaños de fuente reducidos (`text-xs` o `text-[10px]`) e íconos pequeños (`size={14}`).
- **Eliminación de Categorías Estáticas**: No usar botones o píldoras fijas para filtros estáticos (ej: "Ropa", "Calzado"). Los filtros dinámicos se gestionan con selectores compactos o badges dinámicos autocancelables (con botón `X`).

### 17.2. Escala de Espaciados Compactos (Alta Densidad)
En módulos de alta transaccionalidad o volumen de datos, se aplicará la siguiente escala reducida de espaciados y dimensiones:

| Elemento | Espaciado Estándar | Espaciado Compacto (Alta Densidad) | Clases Tailwind Clave |
|---|---|---|---|
| **Pestañas Superiores (Tabs)** | `px-6 py-2` | `px-3.5 py-1.5` | `px-3.5 py-1.5 rounded-lg text-xs font-bold` |
| **Botón Primario / Acción** | `px-6 py-2.5` | `px-4 py-2` | `px-4 py-2 rounded-lg text-sm` / `text-[10px] font-black uppercase tracking-widest` |
| **Cabecera de Tabla (`th`)** | `px-6 py-5` | `px-4 py-2.5` | `px-4 py-2.5 text-[10px] uppercase tracking-widest` |
| **Celdas de Tabla (`td`)** | `px-6 py-4` | `px-4 py-2` | `px-4 py-2 text-sm font-medium` |
| **Inputs de Rango / Filtro** | `px-4 py-2.5` | `px-2 py-1` | `px-2 py-1 text-[10px] font-black w-20 text-center` |

*Esta directiva garantiza una interfaz sumamente limpia, ligera, moderna y altamente profesional, maximizando la información visible sin saturar el espacio visual.*

