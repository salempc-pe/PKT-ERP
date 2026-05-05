# Manual Técnico - PKT ERP

## 1. Arquitectura del Sistema
PKT ERP está construido como una **Single Page Application (SPA)** moderna, utilizando una arquitectura desacoplada basada en la nube.

### 1.1 Tecnologías Core
- **Frontend**: React 19 (Vite)
- **Lenguaje**: JavaScript (ES6+) / JSX
- **Estilos**: TailwindCSS 4
- **Backend-as-a-Service**: Firebase
  - **Firestore**: Base de datos NoSQL para datos en tiempo real.
  - **Auth**: Gestión de identidades y sesiones.
  - **Hosting**: Despliegue de activos estáticos.

---

## 2. Estructura del Proyecto
El código fuente se organiza de la siguiente manera:

```text
/src
  /components     # Componentes compartidos (botones, modales, etc.)
  /context        # Proveedores de estado global (Auth, Theme)
  /hooks          # Hooks personalizados para lógica reutilizable
  /layouts        # Estructuras maestras para Admin y Clientes
  /modules        # Lógica y vistas específicas de cada módulo
    /admin        # Módulos para el SuperAdmin
    /client       # Módulos para los Clientes (Tenants)
  /services       # Configuración y servicios de Firebase
  /assets         # Imágenes y recursos estáticos
```

---

## 3. Modelo de Multitenencia (Multitenancy)
La aplicación utiliza una estrategia de **aislamiento de datos por ID de Organización** dentro de una única base de datos Firestore.

- Cada usuario está asociado a un `organizationId`.
- Las consultas a la base de datos siempre filtran los documentos por este ID.
- Las **Reglas de Seguridad de Firestore** garantizan que un usuario solo pueda leer/escribir datos pertenecientes a su propia organización.

---

## 4. Gestión de Estado y Autenticación
### 4.1 AuthContext
El componente central `AuthContext` gestiona:
- Persistencia de la sesión (Firebase Auth + SessionStorage).
- Carga reactiva de datos del perfil del usuario.
- Lógica de **Suplantación (Impersonation)** para SuperAdmins.
- Control de acceso basado en roles (RBAC).

### 4.2 Planes y Suscripciones
El acceso a los módulos está determinado por el campo `subscription` en el documento de la organización. Los planes definen:
- `activeModules`: Lista de slugs de módulos habilitados.
- `limits`: Restricciones técnicas (ej. máximo de usuarios).

---

## 5. Auditoría y Logs
Cada acción crítica en el sistema genera un registro en la colección `audit_logs`. Estos registros incluyen:
- `userId` y `userName`
- `action` y `details`
- `timestamp` (servidor)
- `type` (info, success, warning, danger)

---

## 6. Configuración y Despliegue
### 6.1 Variables de Entorno
El sistema requiere un archivo `.env` con las credenciales de Firebase:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
# ... etc
```

### 6.2 Comandos de Desarrollo
- `npm run dev`: Inicia el servidor de desarrollo Vite.
- `npm run build`: Genera el bundle de producción en la carpeta `/dist`.

---

## 7. Reglas de Seguridad (Firestore Rules)
Las reglas están diseñadas para ser granulares:
- Los **SuperAdmins** tienen acceso total a todas las colecciones.
- Los **Admins de Cliente** pueden gestionar usuarios de su propia organización.
- Los **Usuarios** tienen permisos limitados de lectura/escritura en los módulos asignados.

---
*© 2026 PKT ERP - Equipo de Ingeniería.*
