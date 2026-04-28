# Summary 30.3: Rediseño Móvil en Contabilidad y Ventas

## Qué se hizo
- **Módulo de Contabilidad (Finance)**:
    - Se ocultaron las tarjetas de resumen (Balance, Ingresos, Egresos) en móvil con `hidden lg:grid`.
    - Se eliminó el formato de tarjeta externa y se habilitó `overflow-auto` para scroll bidireccional.
- **Módulo de Ventas (Sales)**:
    - Se ocultaron las tarjetas de resumen (Pagos, Por Cobrar, Volumen) en móvil con `hidden lg:grid`.
    - Se eliminó el formato de tarjeta externa y se habilitó `overflow-auto` para scroll bidireccional.
- **Consistencia Visual**: Se estandarizó el diseño de las listas en estos módulos con el de Inventario para una experiencia de usuario coherente.

## Verificación
- [x] Las tarjetas de resumen en Finanzas y Ventas no aparecen en móvil.
- [x] Ambos módulos permiten scroll horizontal y vertical cómodo.
- [x] La interfaz se siente más ligera y espaciosa en pantallas pequeñas.
