# Sistema de Manejo de Errores - DPU Labs

## Componentes Implementados

### 1. **ErrorBoundary** (`components/ErrorBoundary.tsx`)
- Captura errores de React en toda la aplicación
- Muestra UI amigable cuando ocurre un error
- Registra automáticamente errores en el backend (`/api/errors`)
- Incluye stack trace y detalles técnicos

### 2. **Sistema de Notificaciones Toast** (`contexts/ToastContext.tsx`)
- Provider y hook `useToast()` para notificaciones en tiempo real
- Tipos: success, error, warning, info
- Auto-dismiss después de 5 segundos
- Animación slide-in desde la derecha
- Métodos: `showToast()`, `showError()`, `showSuccess()`

### 3. **API de Errores**
- **POST `/api/errors`** - Registra nuevo error
- **GET `/api/errors`** - Lista errores con filtros
  - `?type=` - Filtrar por tipo
  - `?resolved=` - Filtrar por estado
  - `?limit=` - Límite de resultados
- **PATCH `/api/errors/[id]`** - Actualizar error (marcar resuelto/notas)
- **DELETE `/api/errors/[id]`** - Eliminar error

### 4. **Modelo ErrorLog** (`lib/models/ErrorLog.ts`)
```typescript
{
  userId: string;
  type: 'react_error' | 'api_error' | 'network_error' | 'validation_error' | 'unknown';
  message: string;
  stack?: string;
  componentStack?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  userAgent?: string;
  metadata?: any;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  notes?: string;
}
```

### 5. **Dashboard de Errores** (`app/dashboard/errors`)
- Lista de todos los errores del sistema
- Filtros por tipo y estado (resuelto/sin resolver)
- Estadísticas: total, sin resolver, resueltos
- Modal de detalles con stack trace
- Marcar como resuelto/reabrir
- Eliminar errores del registro

## Integración

### En Layout (`app/layout.tsx`)
```tsx
<ErrorBoundary>
  <AuthProvider>
    <ToastProvider>
      {/* App content */}
    </ToastProvider>
  </AuthProvider>
</ErrorBoundary>
```

### En Componentes
```tsx
import { useToast } from '@/contexts/ToastContext';

function MyComponent() {
  const { showError, showSuccess } = useToast();

  try {
    // ... operación
    showSuccess('Operación exitosa');
  } catch (error) {
    showError(error.message, 'Error');
  }
}
```

## Ejemplo de Uso

### OsintList Actualizado
- Captura errores de red al cargar targets
- Muestra notificación toast cuando falla la API
- Distingue entre errores de API y errores de red
- Feedback visual inmediato al usuario

## Dashboard de Errores

Acceder desde: **Dashboard → Errores**

Funcionalidades:
- Ver todos los errores registrados
- Filtrar por tipo (React, API, Network, Validation)
- Filtrar por estado (Resueltos/Pendientes)
- Ver detalles completos con stack trace
- Marcar errores como resueltos
- Agregar notas a errores
- Eliminar errores del registro

## Seguridad

- Rate limiting en todas las rutas de API
- Autenticación requerida con Clerk
- Sanitización de inputs (límite de caracteres)
- No falla si el backend está caído (silent fail en logs)
- Errores sensibles no se registran en producción

## Próximos Pasos

1. ✅ Sistema de errores básico
2. ⏭️ Agregar webhooks/alertas para errores críticos
3. ⏭️ Dashboard de métricas (gráficos de errores por tiempo)
4. ⏭️ Exportar logs a servicios externos (Sentry, LogRocket)
5. ⏭️ Agregar categorías personalizadas de errores
