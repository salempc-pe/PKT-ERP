# Limpieza de Historial de Git

## Problema
El archivo `app/.env` fue comiteado en el historial con secretos reales (Resend API Key).

## Pasos para limpiar (ejecutar manualmente)

### Opción 1: git filter-repo (recomendado)
1. Instalar herramienta: `pip install git-filter-repo`
2. Ejecutar limpieza: `git filter-repo --path app/.env --invert-paths`

### Opción 2: BFG Repo Cleaner
1. Descargar BFG y ejecutar: `java -jar bfg.jar --delete-files .env`
2. Limpiar reflogs: `git reflog expire --expire=now --all`
3. Recolectar basura: `git gc --prune=now --aggressive`

## Post-limpieza
1. **Rotar Secretos**: Rotar la API key de Resend en https://resend.com/api-keys de inmediato.
2. **Force push**: `git push --force --all`
3. **Notificar**: Avisar a los colaboradores que deben re-clonar el repositorio para evitar re-introducir los secretos borrados.

> [!CAUTION]
> Estas operaciones reescriben el historial de Git. Asegúrate de tener un backup antes de proceder.
