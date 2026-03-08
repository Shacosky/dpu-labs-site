# SecureShare MVP — DPU Labs SpA

SecureShare es una plataforma **security-first** para compartición de archivos, con foco inicial en archivos **WAV** para industria musical.

## 1) Alcance MVP

### Objetivo
Permitir un flujo seguro de entrega de archivos:

**Subida → Análisis automático → Enlace privado → Acceso/Descarga trazable**

### Principios
- Security-First
- Trazabilidad completa
- Control total por reglas

## 2) Arquitectura tecnológica

- **Frontend (Web app):** carga de archivos, generación de enlace, panel de auditoría.
- **Backend (API):** autenticación, emisión de enlaces, políticas de acceso.
- **Worker de verificación:** inspección de tipo real, hash, metadatos WAV.
- **Almacenamiento cifrado:** repositorio seguro para objetos y versiones.
- **Base de datos:** trazabilidad, metadatos, eventos e historial.

## 3) Código base (TypeScript) para MVP

> Referencial para implementación en Next.js/Node.js.

```ts
// src/secureshare/types.ts
export type UploadStatus = 'pending' | 'analyzing' | 'ready' | 'blocked';

export interface SecureFile {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  status: UploadStatus;
  ownerId: string;
  storageKey: string;
  createdAt: string;
}

export interface VerificationReport {
  fileId: string;
  isWav: boolean;
  integrityOk: boolean;
  detectedMimeType: string;
  sampleRate?: number;
  channels?: number;
  durationSec?: number;
  issues: string[];
  analyzedAt: string;
}

export interface SecureLink {
  id: string;
  fileId: string;
  token: string;
  expiresAt: string;
  passwordHash?: string;
  maxDownloads?: number;
  downloadCount: number;
  createdBy: string;
}
```

```ts
// src/secureshare/upload.service.ts
import crypto from 'node:crypto';

export async function computeSha256(buffer: Buffer): Promise<string> {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function assertWavFilename(name: string): void {
  if (!name.toLowerCase().endsWith('.wav')) {
    throw new Error('Solo se permiten archivos WAV en este MVP');
  }
}
```

```ts
// src/secureshare/link.service.ts
import crypto from 'node:crypto';

export function createPrivateToken(): string {
  return crypto.randomBytes(24).toString('base64url');
}

export function buildPrivateUrl(baseUrl: string, token: string): string {
  return `${baseUrl}/api/secureshare/access/${token}`;
}
```

```ts
// src/secureshare/worker.verify.ts
import { createHash } from 'node:crypto';

export async function verifyWavFile(buffer: Buffer) {
  const riff = buffer.subarray(0, 4).toString('ascii');
  const wave = buffer.subarray(8, 12).toString('ascii');

  const isWav = riff === 'RIFF' && wave === 'WAVE';
  const sha256 = createHash('sha256').update(buffer).digest('hex');

  return {
    isWav,
    integrityOk: isWav,
    detectedMimeType: isWav ? 'audio/wav' : 'application/octet-stream',
    sha256,
    issues: isWav ? [] : ['Cabecera WAV inválida'],
    analyzedAt: new Date().toISOString(),
  };
}
```

## 4) API y endpoints propuestos

### `POST /api/secureshare/upload`
Sube archivo WAV y registra estado `pending`.

**Request (multipart/form-data):**
- `file`: archivo WAV
- `projectId`: identificador lógico (opcional)

**Response 201:**
```json
{
  "fileId": "file_123",
  "status": "pending",
  "sha256": "...",
  "next": "/api/secureshare/files/file_123/analyze"
}
```

### `POST /api/secureshare/files/:id/analyze`
Dispara verificación automática y deja el archivo en `ready` o `blocked`.

**Response 200:**
```json
{
  "fileId": "file_123",
  "status": "ready",
  "report": {
    "isWav": true,
    "integrityOk": true,
    "detectedMimeType": "audio/wav",
    "issues": []
  }
}
```

### `POST /api/secureshare/files/:id/secure-link`
Genera enlace privado con expiración, contraseña opcional y límite de descargas.

**Request JSON:**
```json
{
  "expiresInHours": 72,
  "password": "optional-pass",
  "maxDownloads": 5
}
```

**Response 201:**
```json
{
  "linkId": "lnk_123",
  "privateUrl": "https://app.dpulabs.cl/api/secureshare/access/xxxx",
  "expiresAt": "2026-01-10T10:00:00.000Z"
}
```

### `GET /api/secureshare/access/:token`
Valida reglas (expiración, password, cuota), registra auditoría y devuelve descarga.

### `GET /api/secureshare/files/:id/audit`
Devuelve trazabilidad de eventos de acceso/descarga.

**Response 200:**
```json
{
  "fileId": "file_123",
  "events": [
    {
      "event": "download",
      "at": "2026-01-08T19:44:10.000Z",
      "ip": "190.22.xx.xx",
      "userAgent": "Mozilla/5.0",
      "actor": "guest:link"
    }
  ]
}
```

## 5) Flujo seguro de archivo

1. **Subida**
   - El usuario autenticado sube un WAV.
   - Se calcula hash SHA-256 y se almacena cifrado.
2. **Análisis**
   - Worker valida cabecera WAV real y consistencia.
   - Se registran metadatos técnicos y resultado.
3. **Enlace seguro**
   - Se crea token privado de alta entropía.
   - Se aplican reglas: expiración, password, descargas máximas.
4. **Acceso/Descarga**
   - Se validan políticas antes de servir archivo.
   - Se registra auditoría: actor, fecha/hora, IP, user-agent.
5. **Eliminación automática**
   - Job programado borra archivo y enlaces expirados según reglas.

## 6) Plantilla para dashboard de trazabilidad

### Widgets recomendados
- **Eventos de hoy:** total de descargas válidas/bloqueadas.
- **Top archivos compartidos:** por número de accesos.
- **Accesos por IP/país:** detección de patrones anómalos.
- **Alertas:** intentos fallidos por contraseña/expiración.

### Estructura de tabla

| Fecha/Hora | Archivo | Evento | Actor | IP | Estado |
|---|---|---|---|---|---|
| 2026-01-08 19:44 | master_v3.wav | download | guest:link | 190.22.xx.xx | OK |
| 2026-01-08 20:10 | demo_final.wav | denied_expired | guest:link | 181.44.xx.xx | BLOCKED |

### Modelo de evento (JSON)

```json
{
  "eventId": "evt_001",
  "fileId": "file_123",
  "eventType": "download",
  "status": "ok",
  "actor": "guest:link",
  "ip": "190.22.xx.xx",
  "country": "CL",
  "userAgent": "Mozilla/5.0",
  "createdAt": "2026-01-08T19:44:10.000Z"
}
```

## 7) Recomendaciones de seguridad (MVP)

- Cifrado en reposo + HTTPS obligatorio.
- Hash de contraseña del enlace con Argon2/bcrypt.
- Tokens firmados o aleatorios con alta entropía (mínimo 192 bits).
- Rate limiting por IP en endpoint de acceso.
- Logs inmutables para auditoría operativa.
