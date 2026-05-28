---
pdf_options:
  format: A4
  margin:
    top: 25mm
    bottom: 25mm
    left: 20mm
    right: 20mm
  displayHeaderFooter: true
  headerTemplate: |
    <div style="font-family: 'Inter', sans-serif; font-size: 8px; color: #a3aac4; width: 100%; padding: 0 20mm; box-sizing: border-box; display: flex; justify-content: space-between;">
      <span>PKT ERP - Manual de Usuario</span>
      <span>v1.0 (Mayo 2026)</span>
    </div>
  footerTemplate: |
    <div style="font-family: 'Inter', sans-serif; font-size: 8px; color: #a3aac4; width: 100%; padding: 0 20mm; box-sizing: border-box; display: flex; justify-content: space-between; border-top: 1px solid rgba(64, 72, 93, 0.1); padding-top: 5px;">
      <span>Confidencial - Solo Uso Interno</span>
      <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
    </div>
launch_options:
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
---

<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

  body {
    font-family: 'Inter', sans-serif;
    color: #1A1A1A;
    line-height: 1.6;
    font-size: 10.5pt;
    background-color: #FFFFFF;
  }

  /* Portada */
  .cover-page {
    page-break-after: always;
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding-top: 30mm;
    box-sizing: border-box;
  }
  .cover-title-container {
    border-left: 6px solid #6B4FD8;
    padding-left: 24px;
    margin-bottom: 40px;
  }
  .cover-title {
    font-family: 'Outfit', sans-serif;
    font-size: 36pt;
    font-weight: 900;
    color: #1A1A1A;
    line-height: 1.1;
    margin: 0;
    letter-spacing: -1px;
  }
  .cover-subtitle {
    font-family: 'Outfit', sans-serif;
    font-size: 18pt;
    font-weight: 600;
    color: #6B4FD8;
    margin-top: 10px;
    margin-bottom: 0;
  }
  .cover-meta {
    margin-top: auto;
    padding-bottom: 10mm;
    font-size: 9pt;
    color: #555555;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px 40px;
    border-top: 1px solid #e0e0de;
    width: 100%;
    padding-top: 20px;
  }
  .cover-meta-item {
    display: flex;
    flex-direction: column;
  }
  .cover-meta-label {
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    color: #a3aac4;
    letter-spacing: 1px;
    margin-bottom: 3px;
  }
  .cover-meta-value {
    font-weight: 600;
    color: #1A1A1A;
  }

  /* Tipografías */
  h1, h2, h3, h4 {
    font-family: 'Outfit', sans-serif;
    color: #1A1A1A;
    font-weight: 700;
    page-break-after: avoid;
  }
  h1 {
    font-size: 22pt;
    margin-top: 30pt;
    margin-bottom: 15pt;
    border-bottom: 2px solid #e0e0de;
    padding-bottom: 5pt;
    page-break-before: always;
  }
  /* Excepción para evitar salto de página en el primer H1 */
  .first-h1 {
    page-break-before: avoid !important;
  }
  h2 {
    font-size: 16pt;
    margin-top: 22pt;
    margin-bottom: 12pt;
    color: #6B4FD8;
    border-bottom: 1px solid rgba(107, 79, 216, 0.15);
    padding-bottom: 4pt;
  }
  h3 {
    font-size: 12pt;
    margin-top: 16pt;
    margin-bottom: 8pt;
  }

  /* Estructura general */
  p {
    margin-top: 0;
    margin-bottom: 12pt;
    text-align: justify;
  }
  ul, ol {
    margin-top: 0;
    margin-bottom: 12pt;
    padding-left: 20px;
  }
  li {
    margin-bottom: 6pt;
  }
  strong {
    font-weight: 700;
    color: #000000;
  }

  /* Bloques de código e inline */
  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    background-color: #F7F7F5;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #e0e0de;
    color: #6B4FD8;
  }
  pre {
    background-color: #1A1A1A !important;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #40485d;
    overflow-x: auto;
    margin-top: 12pt;
    margin-bottom: 12pt;
    page-break-inside: avoid;
  }
  pre code {
    background-color: transparent !important;
    padding: 0;
    border-radius: 0;
    border: none;
    color: #f7f7f5 !important;
  }

  /* Bloques de Alerta */
  blockquote {
    margin: 15pt 0;
    padding: 10pt 15pt;
    background-color: #ede9fb;
    border-left: 4px solid #6B4FD8;
    border-radius: 0 8px 8px 0;
    page-break-inside: avoid;
  }
  blockquote p {
    margin: 0;
    color: #1A1A1A;
    font-size: 9.5pt;
    font-weight: 500;
  }

  /* Tablas */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15pt;
    margin-bottom: 15pt;
    font-size: 9pt;
    page-break-inside: avoid;
  }
  th {
    background-color: #6B4FD8;
    color: #FFFFFF;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 8pt;
    letter-spacing: 0.5px;
    padding: 8pt 10pt;
    border: 1px solid #6B4FD8;
  }
  td {
    padding: 7pt 10pt;
    border: 1px solid #e0e0de;
  }
  tr:nth-child(even) {
    background-color: #F7F7F5;
  }

  /* Contenedores visuales */
  .modules-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 15pt;
    margin-bottom: 15pt;
  }
  .module-card {
    background-color: #FFFFFF;
    border: 1px solid #e0e0de;
    border-radius: 8px;
    padding: 12pt;
    page-break-inside: avoid;
  }
  .module-card h4 {
    margin-top: 0;
    margin-bottom: 5pt;
    color: #6B4FD8;
    font-family: 'Outfit', sans-serif;
    font-size: 11pt;
  }
  .module-card p {
    margin: 0;
    font-size: 9.5pt;
    color: #555555;
  }
  
  .badge {
    display: inline-block;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 2px 6px;
    border-radius: 3px;
    margin-right: 5px;
  }
  .badge-primary { background-color: #ede9fb; color: #6B4FD8; border: 1px solid rgba(107, 79, 216, 0.2); }
  .badge-success { background-color: rgba(133, 255, 171, 0.15); color: #2e7d32; border: 1px solid rgba(46, 125, 50, 0.2); }
  .badge-warning { background-color: rgba(255, 193, 7, 0.15); color: #b78103; border: 1px solid rgba(183, 129, 3, 0.2); }
  .badge-danger { background-color: rgba(255, 107, 107, 0.15); color: #c62828; border: 1px solid rgba(198, 40, 40, 0.2); }
</style>

<!-- Portada -->
<div class="cover-page">
  <div class="cover-title-container">
    <h1 class="cover-title first-h1">Manual de Usuario</h1>
    <div class="cover-subtitle">Guía de Operación y Funcionalidades — PKT ERP</div>
  </div>
  <div class="cover-meta">
    <div class="cover-meta-item">
      <span class="cover-meta-label">Proyecto</span>
      <span class="cover-meta-value">PKT ERP</span>
    </div>
    <div class="cover-meta-item">
      <span class="cover-meta-label">Área</span>
      <span class="cover-meta-value">Manuales de Operación</span>
    </div>
    <div class="cover-meta-item">
      <span class="cover-meta-label">Versión</span>
      <span class="cover-meta-value">v1.0 (Mayo 2026)</span>
    </div>
    <div class="cover-meta-item">
      <span class="cover-meta-label">Soporte</span>
      <span class="cover-meta-value">soporte@pkt-erp.com</span>
    </div>
  </div>
</div>

<!-- Contenido -->

# 1. Introducción

Bienvenido a **PKT ERP**, una plataforma web integrada de gestión empresarial diseñada de extremo a extremo para centralizar y optimizar las operaciones de su empresa. A través de este manual, conocerá los flujos fundamentales de acceso, uso de módulos específicos, personalización y administración de su equipo de trabajo.

Nuestra interfaz prioriza un **diseño moderno y limpio de alta densidad**, lo que le permite visualizar grandes volúmenes de datos con la máxima claridad y sin sobrecarga visual, agilizando la toma de decisiones diarias.

---

# 2. Acceso al Sistema y Seguridad de Cuenta

El acceso seguro a la plataforma está garantizado mediante políticas estrictas de cifrado y roles. Siga los pasos correspondientes para iniciar su actividad de forma segura.

### 2.1 Inicio de Sesión Ordinario

1.  Abra su navegador e introduzca el dominio web asignado a su organización.
2.  En la pantalla de bienvenida, introduzca su **Correo Electrónico** corporativo y su **Contraseña**.
3.  Haga clic en **Iniciar Sesión**. 
4.  Si su organización utiliza autenticación de dos factores (2FA), introduzca el código de validación enviado a su dispositivo móvil o correo electrónico.

### 2.2 Activación de Nueva Cuenta de Colaborador

Si ha sido invitado a unirse al equipo de su organización:

1.  Recibirá un correo electrónico de invitación oficial de PKT ERP.
2.  Haga clic en el enlace de verificación provisto en el mensaje.
3.  El enlace le redirigirá a una pantalla de configuración exclusiva en la que deberá introducir su contraseña de alta seguridad (mínimo 8 caracteres, incluyendo mayúsculas, números y símbolos).
4.  Complete la información del perfil básico y haga clic en **Activar Cuenta** para acceder por primera vez.

---

# 3. Módulos Operativos Principales

PKT ERP es una plataforma modular altamente personalizable. El menú lateral y la disponibilidad de estas herramientas se adaptan al plan de suscripción activo de su organización.

<div class="modules-grid">
  <div class="module-card">
    <h4>3.1 Dashboard Estratégico</h4>
    <p>La pantalla de inicio reúne de manera reactiva gráficos de rendimiento y los KPIs (Indicadores Clave) esenciales de su negocio. Le permite evaluar en un vistazo el estado financiero, ventas recientes y proyectos activos con actualizaciones en tiempo real.</p>
  </div>
  <div class="module-card">
    <h4>3.2 CRM (Gestión de Clientes)</h4>
    <p>Centralice el ciclo de vida de sus clientes. Gestione leads, etapas de negociación en el embudo visual (Pipeline Kanban) y almacene registros de interacciones como llamadas, correos electrónicos y reuniones de seguimiento.</p>
  </div>
  <div class="module-card">
    <h4>3.3 Inventario y Bodega</h4>
    <p>Consulte existencias de stock al instante. Soporta múltiples almacenes, registro de movimientos de entrada y salida, transferencias directas entre bodegas y alertas automatizadas de stock mínimo.</p>
  </div>
  <div class="module-card">
    <h4>3.4 Ventas y Facturación</h4>
    <p>Automatice el flujo comercial emitiendo cotizaciones y convirtiéndolas con un solo clic en pedidos o facturas de venta. Gestione el estado de cobros de forma automatizada y estructurada.</p>
  </div>
  <div class="module-card">
    <h4>3.5 Finanzas y Tesorería</h4>
    <p>Supervise ingresos, egresos y el flujo de caja neto. El sistema automatiza la reconciliación y emite completos informes de rendimiento financiero en formatos tabulares claros y limpios.</p>
  </div>
  <div class="module-card">
    <h4>3.6 Proyectos y Planificación</h4>
    <p>Planifique proyectos por fases, defina tareas operativas asignándolas a miembros del equipo, establezca hitos del proyecto y controle la entrega en plazos previstos de forma sumamente sencilla.</p>
  </div>
  <div class="module-card">
    <h4>3.7 Planilla (Payroll)</h4>
    <p>Módulo centralizado para la administración de personal. Facilita la gestión de nóminas periódicas, seguimiento de horas trabajadas, registro de préstamos al personal e incidencias contractuales.</p>
  </div>
  <div class="module-card">
    <h4>3.8 Bienes Raíces (Real Estate)</h4>
    <p>Herramienta avanzada y compacta orientada al sector inmobiliario para administrar de forma estructurada carteras de propiedades, parcelaciones, bases de datos de inversionistas y contratos de venta.</p>
  </div>
</div>

---

# 4. Gestión de Equipo y Roles Administrativos

> **Privilegios de Administración**: El acceso y control a esta sección está estrictamente limitado a los usuarios con rol **Admin** de la organización o al **SuperAdmin** del sistema.

### 4.1 Invitar a Nuevos Colaboradores
1.  Navegue al módulo de **Equipo** en el menú de configuración.
2.  Haga clic en el botón primario **Invitar Colaborador**.
3.  Introduzca el Correo Electrónico del colaborador, su Nombre Completo y seleccione su **Rol Operativo**.
4.  Haga clic en **Enviar Invitación**. El usuario figurará con el badge de estado <span class="badge badge-warning">pendiente</span> hasta que complete su activación.

### 4.2 Control de Roles del Sistema

| Rol | Nivel de Acceso | Descripción |
| :--- | :--- | :--- |
| **Admin** | Total en Organización | Permisos de lectura/escritura en todos los módulos contratados, gestión de facturación de la cuenta e invitación de usuarios. |
| **User** | Granular / Limitado | Permisos asignados individualmente por módulo. No puede acceder a configuraciones organizacionales ni invitar a personal. |
| **SuperAdmin** | Soporte y Sistema | Acceso total exclusivo al equipo de ingeniería de PKT ERP para realizar labores técnicas y de suplantación autorizada. |

---

# 5. Configuración y Personalización

Cada usuario puede adaptar la experiencia visual del ERP a su preferencia de trabajo desde el panel de **Configuración**:

*   **Tema Claro / Oscuro**: PKT ERP cuenta con un modo oscuro nativo de alto contraste para largas jornadas de trabajo nocturnas y un modo claro ultra nítido perfecto para presentaciones e impresión física de reportes. Para alternar, use el selector en la esquina superior del panel.
*   **Información de Perfil**: Mantenga actualizados sus nombres de usuario, número telefónico de contacto corporativo y fotografía de perfil para el chat y asignación de tareas.
*   **Ajustes de Organización (Solo Admins)**: Permite definir el nombre legal de la organización, dirección fiscal de facturación, zona horaria y moneda base de operación.

---

# 6. Centro de Soporte y Envío de Feedback

Valoramos enormemente su experiencia y la mejora constante de nuestra herramienta. 

Si experimenta algún inconveniente operativo, encuentra un error de sistema o desea sugerir una mejora en la interfaz:
1.  Haga clic en el botón flotante de **Feedback** ubicado permanentemente en la esquina inferior derecha de la plataforma.
2.  Se desplegará un formulario compacto.
3.  Seleccione el tipo de mensaje (Error, Sugerencia o Consulta).
4.  Describa brevemente su requerimiento y, de ser posible, adjunte una captura de pantalla.
5.  Haga clic en **Enviar Mensaje**. Nuestro equipo de soporte técnico recibirá su reporte y le brindará respuesta directa en su correo electrónico corporativo.

---
*© 2026 PKT ERP - Todos los derechos de propiedad industrial reservados. Impreso para uso exclusivo de la organización.*
