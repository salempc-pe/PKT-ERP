---
phase: 15
plan: 1
wave: 1
---

# Plan 15.1: Modal Editar Org (Eliminar + Módulos) y Limpieza de Sidebar

## Objective
Tres mejoras en el portal admin que son independientes entre sí y modifican un único archivo cada una:
1. Agregar botón "Eliminar Organización" (con confirmación) dentro del modal de edición.
2. Agregar sección de activación de módulos adicionales (toggle por módulo) en el mismo modal editar.
3. Quitar el botón "Support" del sidebar de AdminLayout.

## Context
- `.gsd/SPEC.md`
- `.gsd/ARCHITECTURE.md`
- `src/modules/admin/clients/AdminClients.jsx` — modal editar org (líneas 269-384)
- `src/layouts/admin/AdminLayout.jsx` — sidebar admin (líneas 73-82)
- `src/context/AuthContext.jsx` — función `adminRemoveOrg` (verificar si existe; si no, implementarla)

## Tasks

<task type="auto">
  <name>Agregar adminRemoveOrg en AuthContext si no existe</name>
  <files>src/context/AuthContext.jsx</files>
  <action>
    1. Buscar si existe la función `adminRemoveOrg` en AuthContext.
    2. Si NO existe, agregarla junto a `adminUpdateOrg`. Debe:
       - Filtrar `mockOrganizations` removiendo la org por id: `setMockOrganizations(prev => prev.filter(o => o.id !== orgId))`
       - También si hay Firebase activo, eliminar el doc: `await deleteDoc(doc(db, 'organizations', orgId))`
       - Exportarla desde el valor del contexto.
    3. Si ya existe, no modificar; solo verificar que está expuesta en el value del Provider.
    EVITAR: romper firmas de funciones existentes.
  </action>
  <verify>grep -n "adminRemoveOrg" src/context/AuthContext.jsx</verify>
  <done>La función `adminRemoveOrg` existe en AuthContext y está expuesta en el value del Provider.</done>
</task>

<task type="auto">
  <name>Botón Eliminar Org + sección Módulos Adicionales en modal Editar</name>
  <files>src/modules/admin/clients/AdminClients.jsx</files>
  <action>
    1. En el destructuring de `useAuth()` (línea ~17), agregar `adminRemoveOrg`.
    2. Agregar handler `handleDeleteOrg`:
       ```js
       const handleDeleteOrg = () => {
         if (!window.confirm(`¿Eliminar "${selectedOrg?.name}"? Esta acción no se puede deshacer.`)) return;
         adminRemoveOrg(selectedOrg.id);
         setIsEditOrgModalOpen(false);
       };
       ```
    3. En el header del modal Editar (línea ~273-279), junto al botón X, agregar a la izquierda un botón rojo:
       ```jsx
       <button
         onClick={handleDeleteOrg}
         className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition-all"
       >
         <Trash2 size={14} /> Eliminar Org
       </button>
       ```
       Importar `Trash2` de lucide-react.
    4. Dentro del modal editar, DESPUÉS de la sección "Colaboradores Vinculados" (después del form de agregar usuario, línea ~380), 
       agregar una nueva sección "Módulos Adicionales":
       ```jsx
       {/* Sección Módulos Adicionales */}
       <div className="space-y-4">
         <h3 className="text-sm font-bold text-[#4ADE80] uppercase tracking-widest">Módulos Adicionales</h3>
         <p className="text-[10px] text-[#a3aac4]">Activa o desactiva módulos individuales para todos los usuarios de esta organización.</p>
         <div className="space-y-2">
           {AVAILABLE_MODULES.map(module => {
             const orgUsers = organizationsWithUsers.find(o => o.id === selectedOrg?.id)?.users || [];
             const isActive = orgUsers[0]?.activeModules?.includes(module.id) ?? false;
             return (
               <div
                 key={module.id}
                 onClick={() => {
                   const toggled = isActive
                     ? (orgUsers[0]?.activeModules || []).filter(id => id !== module.id)
                     : [...(orgUsers[0]?.activeModules || []), module.id];
                   orgUsers.forEach(u => adminUpdateUserModules(u.email, toggled));
                 }}
                 className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isActive ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30 text-[#4ADE80]' : 'bg-[#141f38]/50 border-[#40485d]/20 text-[#dee5ff]'}`}
               >
                 <div className="flex items-center gap-3">
                   <Box size={16} opacity={isActive ? 1 : 0.5} />
                   <span className="text-sm font-bold">{module.name}</span>
                 </div>
                 <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isActive ? 'bg-[#4ADE80] text-[#060e20]' : 'bg-[#060e20] border border-[#40485d]/30'}`}>
                   {isActive && <Check size={12} strokeWidth={4} />}
                 </div>
               </div>
             );
           })}
         </div>
       </div>
       ```
    EVITAR: duplicar el modal de módulos separado — la nueva sección reemplaza esa necesidad dentro del modal editar.
    NOTA: `Box` y `Check` ya están importados. Solo agregar `Trash2` al import de lucide-react.
  </action>
  <verify>grep -n "handleDeleteOrg\|Módulos Adicionales\|Trash2" src/modules/admin/clients/AdminClients.jsx</verify>
  <done>
    - Handler `handleDeleteOrg` existe.
    - Botón "Eliminar Org" visible en header del modal editar.
    - Sección "Módulos Adicionales" con toggles visible al final del modal editar.
    - `Trash2` importado.
  </done>
</task>

<task type="auto">
  <name>Quitar botón Support del sidebar AdminLayout</name>
  <files>src/layouts/admin/AdminLayout.jsx</files>
  <action>
    Eliminar el bloque del botón Support (líneas ~74-77):
    ```jsx
    <button className="w-full flex items-center gap-3 text-[#a3aac4] px-4 py-3 hover:text-[#dee5ff] hover:bg-[#0f1930] rounded-lg transition-all">
      <HelpCircle size={20} />
      <span className="font-semibold text-sm">Support</span>
    </button>
    ```
    También eliminar `HelpCircle` del import de lucide-react si ya no se usa en ningún otro lugar del archivo.
    EVITAR: eliminar el botón de Logout o cualquier otro elemento del sidebar.
  </action>
  <verify>grep -n "Support\|HelpCircle" src/layouts/admin/AdminLayout.jsx</verify>
  <done>El botón Support no existe en AdminLayout.jsx y HelpCircle no está importado (o si se usa en otro lugar se mantiene).</done>
</task>

## Success Criteria
- [ ] Confirmación `window.confirm` aparece antes de eliminar una organización
- [ ] Eliminada la org, desaparece del listado de forma reactiva
- [ ] Los toggles de módulos en el modal editar reflejan el estado real de los usuarios
- [ ] El sidebar no muestra el botón "Support"
