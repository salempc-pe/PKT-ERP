# Workflow: Register Module
Este workflow automatiza la integración de un nuevo módulo en la estructura de PKT ERP.

## Parámetros Requeridos
- **Folder**: Nombre de la carpeta en `src/modules/client/` (ej: `billing`).
- **DisplayName**: Nombre que aparecerá en el menú (ej: `Facturación`).
- **Icon**: Nombre del icono de Lucide (ej: `FileText`, `Settings`, `Package`).
- **ComponentName**: Nombre del componente principal (ej: `BillingModule`).

## Pasos de Ejecución

### 1. Actualizar src/App.jsx
- Localizar la sección de imports de módulos de cliente.
- Agregar: `import {ComponentName} from './modules/client/{Folder}/{ComponentName}';`
- Localizar las rutas de `<Route path="/client" element={<ClientLayout />}>`.
- Agregar: `<Route path="{Folder}" element={<{ComponentName} />} />` antes de la ruta de settings.

### 2. Actualizar src/layouts/client/ClientLayout.jsx
- Localizar el import de `lucide-react` y asegurar que `{Icon}` esté presente.
- Localizar la sección "Mis Módulos" en el JSX.
- Insertar el siguiente bloque de Link antes del cierre del `nav`:
```jsx
          <Link 
            to="/client/{Folder}" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive('/client/{Folder}') ? 'bg-[#192540] text-[#85adff] shadow-inner font-bold' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930] font-semibold'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <{Icon} size={20} />
            <span className="text-sm border-0 font-semibold">{DisplayName}</span>
          </Link>
```

### 3. Verificación
- Confirmar que los archivos se guardaron correctamente.
- Notificar al usuario que el módulo ya debería ser visible en la navegación.
