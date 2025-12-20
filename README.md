# DPU Labs Site
## PR Automation (develop → main)
- **Prerequisites:** Install Git, install GitHub CLI (`gh`), authenticate with `gh auth login`, ensure `origin` points to your GitHub repo, and that branches `develop` and `main` exist.
- **One-command run:**

```powershell
npm run pr:develop
```

- **What it does:** Pushes `develop`, creates a PR to `main` (with title/body), merges it (squash by default), checks out `main`, and pulls latest.
- **Manual run (custom flags):**

```powershell
powershell -ExecutionPolicy Bypass -File scripts/auto-pr.ps1 -From develop -To main -Title "Deploy: develop → main" -Body "Automated PR via script" -Squash
```

- **Notes:** If branch protections require approvals or passing checks, `gh pr merge` will fail until those conditions are met. Use `-NoDeleteBranch` to keep `develop` after merge, and set `-CommitMessage "msg"` to auto-commit staged changes before pushing.

## DPU Labs SpA — Sitio Web (Next.js 15 + TS + Tailwind)

- App Router, TypeScript, Tailwind CSS
- Tema oscuro, elegante y enfocado en ciberseguridad purple-team
- Secciones: Hero, Servicios, Casos de Uso, Stack Tecnológico, Contacto
- SEO con imagen OpenGraph y favicon
- CTA de WhatsApp: +56 9 4286 7168
- Multiidioma: Español e Inglés

### Módulo OSINT (Seguro)

- API y dashboard para gestionar objetivos OSINT.
- Almacenamiento cifrado a nivel aplicación con AES-256-GCM.
- Clave en `OSINT_ENCRYPTION_KEY` (Base64 32 bytes) y rotación opcional.
- Tipos de objetivo: `person` y `company` para segmentar personas y empresas.

#### Endpoints

- `GET /api/osint` — lista objetivos. Filtro opcional `?targetType=person|company`.
- `POST /api/osint` — crea objetivo. Requiere `targetType` y `name`.
- `GET /api/osint/:id` — detalle.
- `PUT /api/osint/:id` — actualizar (incluye `targetType`).
- `DELETE /api/osint/:id` — eliminar.

#### Migración (legado)

Para objetivos creados antes de introducir `targetType`, ejecutar backfill:

```bash
node scripts/migrate-targetType.ts
```

Esto asigna `targetType='person'` cuando falte.

### Desarrollo local

1) Instalar dependencias: `npm install`
2) Ejecutar servidor de desarrollo: `npm run dev`
3) Compilar para producción: `npm run build` y luego `npm start`

#### Variables de entorno requeridas

Crear `.env.local` con al menos:

```env
MONGODB_URI=mongodb+srv://...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...

# Clave para cifrado OSINT (32 bytes en Base64)
OSINT_ENCRYPTION_KEY=REPLACE_WITH_BASE64_32B
# (Opcional) clave anterior para rotación
# OSINT_ENCRYPTION_KEY_PREVIOUS=...
```

Para generar una clave segura de 32 bytes en Base64:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Despliegue

Sitio desplegado en: **https://dpulabs.is-a.dev**

Fácil de desplegar en Vercel. Si cambias el dominio, actualiza los metadatos en `app/layout.tsx`.

