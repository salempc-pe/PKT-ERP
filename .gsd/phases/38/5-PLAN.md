---
phase: 38
plan: 5
wave: 3
---

# Plan 38.5: Limpieza de Git, Sanitización de Emails y .env.example

## Objective
Limpiar secretos del historial de Git, sanitizar las variables interpoladas en el template HTML de emails, y crear un archivo `.env.example` como referencia para nuevos desarrolladores. Estos son los últimos pasos de remediación.

## Context
- Git history (commit c14f2a8 contiene app/.env con secretos)
- functions/index.js (template HTML del email creado en Plan 38.3)
- .env (ya sin VITE_RESEND_API_KEY tras Plan 38.3)

## Tasks

<task type="auto">
  <name>Sanitizar variables en template HTML de email</name>
  <files>functions/index.js</files>
  <action>
    En la Cloud Function creada en Plan 38.3, asegurar que TODAS las variables interpoladas en el HTML del email estén sanitizadas:
    
    Crear una función helper al inicio del archivo:
    ```javascript
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
    ```
    
    Aplicarla a `name` y `orgName` antes de interpolarlo en el HTML:
    ```javascript
    const safeName = escapeHtml(name);
    const safeOrgName = escapeHtml(orgName);
    ```
    
    - NO sanitizar `inviteUrl` con escapeHtml (rompería la URL) — en su lugar, validar que sea una URL del dominio correcto:
    ```javascript
    if (!inviteUrl.startsWith('https://')) {
      throw new Error('URL de invitación inválida');
    }
    ```
    - NO sanitizar el campo `to` (email) — Resend lo valida internamente.
  </action>
  <verify>grep -n "escapeHtml" functions/index.js</verify>
  <done>Todas las variables de usuario interpoladas en el HTML del email pasan por `escapeHtml()`. La URL se valida por protocolo.</done>
</task>

<task type="auto">
  <name>Crear .env.example y documentar la limpieza de Git</name>
  <files>.env.example, .gsd/phases/38/GIT_CLEANUP.md</files>
  <action>
    1. Crear `.env.example` en la raíz del proyecto:
    ```
    # PKT ERP - Configuración de Firebase (Frontend)
    VITE_FIREBASE_API_KEY=
    VITE_FIREBASE_AUTH_DOMAIN=
    VITE_FIREBASE_PROJECT_ID=
    VITE_FIREBASE_STORAGE_BUCKET=
    VITE_FIREBASE_MESSAGING_SENDER_ID=
    VITE_FIREBASE_APP_ID=
    VITE_FIREBASE_MEASUREMENT_ID=
    
    # NOTA: Las API keys de servicios externos (Resend, etc.)
    # se configuran como secrets en Firebase Cloud Functions.
    # NO agregar secrets aquí — este archivo se commitea al repositorio.
    ```
    
    2. Crear `.gsd/phases/38/GIT_CLEANUP.md` con instrucciones para limpiar el historial:
    ```markdown
    # Limpieza de Historial de Git
    
    ## Problema
    El archivo `app/.env` fue comiteado en el commit `c14f2a8` con secretos reales.
    
    ## Pasos para limpiar (ejecutar manualmente)
    
    ### Opción 1: git filter-repo (recomendado)
    pip install git-filter-repo
    git filter-repo --path app/.env --invert-paths
    
    ### Opción 2: BFG Repo Cleaner
    java -jar bfg.jar --delete-files .env
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
    
    ## Post-limpieza
    1. Rotar la API key de Resend en https://resend.com/api-keys
    2. Force push: `git push --force --all`
    3. Notificar a colaboradores que deben re-clonar
    ```
    
    - NO ejecutar la limpieza de Git automáticamente — es una operación destructiva que requiere confirmación del usuario.
    - El archivo GIT_CLEANUP.md sirve como guía para que el usuario lo ejecute cuando esté listo.
  </action>
  <verify>Test-Path ".env.example" && Test-Path ".gsd/phases/38/GIT_CLEANUP.md"</verify>
  <done>`.env.example` creado sin valores reales. Guía de limpieza de Git documentada para ejecución manual.</done>
</task>

## Success Criteria
- [ ] `.env.example` existe y no contiene valores reales.
- [ ] El template de email sanitiza inputs con `escapeHtml()`.
- [ ] Existe documentación clara para la limpieza del historial de Git.
- [ ] El `.gitignore` ya incluye `.env` (verificado — ya está correcto).
