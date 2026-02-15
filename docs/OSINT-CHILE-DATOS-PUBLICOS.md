# OSINT Chile - Datos Públicos con Riesgos de Seguridad

> **Nota Ética**: Este documento es únicamente con fines educativos y de concientización sobre seguridad de la información. El uso indebido de esta información es responsabilidad del usuario.

## 🇨🇱 Datos Públicos en Chile que Deberían Ser Privados

### 1. **RUT (Rol Único Tributario)**
- **Problema**: El RUT es público y se usa como identificador único
- **Riesgo**: Combinado con nombre, permite:
  - Suplantación de identidad
  - Ingeniería social
  - Acceso a servicios con validación débil
- **Fuentes públicas**:
  - Sitios de transparencia
  - Diarios oficiales
  - Registro de proveedores del Estado
  - Sociedades y empresas (registros públicos)

### 2. **Registros de Sociedades y Empresas**
- **Dónde**: Conservador de Bienes Raíces, Diario Oficial
- **Expone**:
  - RUT de socios y representantes legales
  - Direcciones de domicilio
  - Capitales y participaciones
  - Relaciones comerciales
- **Riesgo**: Mapeo completo de estructura empresarial y patrimonial

### 3. **Compras Públicas (ChileCompra / Mercado Público)**
- **Público**: Todas las licitaciones y órdenes de compra
- **Expone**:
  - Proveedores y montos
  - Contactos administrativos (emails, teléfonos)
  - Direcciones de entrega
  - Especificaciones técnicas de infraestructura
- **Riesgo**: 
  - Mapeo de infraestructura crítica
  - Identificación de tecnologías usadas
  - Vectores de ataque (software, hardware, proveedores)

### 4. **Portal de Transparencia**
- **Público**: Remuneraciones de funcionarios públicos
- **Expone**:
  - Nombres completos
  - RUT
  - Cargos y funciones
  - Salarios exactos
  - Viáticos y bonos
- **Riesgo**: 
  - Perfilamiento de objetivos de alto valor
  - Ingeniería social dirigida
  - Extorsión y secuestros virtuales

### 5. **Registro Civil y Defunciones**
- **Problema**: Certificados de nacimiento/defunción parcialmente públicos
- **Riesgo**:
  - Creación de identidades falsas con RUT de fallecidos
  - Fraude documental
  - Suplantación para trámites

### 6. **Poder Judicial - Causas y Sentencias**
- **Público**: Resoluciones judiciales con nombre y RUT
- **Expone**:
  - Historial legal completo
  - Direcciones declaradas en juicios
  - Relaciones familiares
  - Situación patrimonial (embargos, quiebras)
- **Riesgo**: Chantaje, discriminación laboral

### 7. **Bienes Raíces y Propiedades**
- **Público**: Registro de propiedad
- **Expone**:
  - Propietarios con RUT
  - Direcciones exactas
  - Valores de avalúo fiscal
  - Hipotecas y gravámenes
- **Riesgo**: 
  - Identificación de patrimonio
  - Planificación de robos/extorsión
  - Ingeniería social

### 8. **Vehículos (Registro Nacional de Vehículos Motorizados)**
- **Problema**: Patentes asociadas a RUT son consultables
- **Riesgo**:
  - Seguimiento físico
  - Correlación de movimientos
  - Identificación de objetivos de valor

### 9. **Correos Electrónicos Institucionales**
- **Público**: Emails de funcionarios en sitios web gubernamentales
- **Formato común**: `nombre.apellido@institucion.gob.cl`
- **Riesgo**:
  - Phishing dirigido
  - Spear phishing con contexto
  - Business Email Compromise (BEC)

### 10. **LinkedIn y RRSS Profesionales**
- **Problema**: Perfiles ultra-detallados de ejecutivos y técnicos
- **Expone**:
  - Estructura organizacional completa
  - Tecnologías y proveedores usados
  - Relaciones profesionales
  - Horarios y patrones de trabajo
- **Riesgo**: Reconocimiento para ataques dirigidos (APT)

### 11. **Bases de Datos Filtradas**
- **Realidad**: Múltiples filtraciones históricas:
  - Registro Civil (2020)
  - SII (datos tributarios)
  - Isapres y sistemas de salud
  - Operadoras telefónicas
- **Contienen**:
  - RUT + nombre + dirección + teléfono + email
  - En algunos casos: datos biométricos, huellas, fotos
- **Riesgo**: Información permanentemente expuesta en la dark web

### 12. **Sistema de Salud (Fonasa/Isapres)**
- **Problema**: Filtraciones recurrentes
- **Expone**:
  - Diagnósticos y tratamientos
  - Medicamentos recetados
  - Historia clínica
- **Riesgo**: Discriminación, chantaje, violación de privacidad médica

### 13. **Universidades y Publicaciones Académicas**
- **Público**: Tesis, papers con datos de investigadores
- **Expone**:
  - Correos institucionales
  - Áreas de investigación sensibles
  - Colaboraciones y financiamiento
- **Riesgo**: Espionaje industrial/académico

---

## 🛡️ Recomendaciones de Mitigación

### Para Individuos:
1. **No usar RUT como contraseña** (increíblemente común)
2. **Limitar información en RRSS**
3. **Configurar privacidad en LinkedIn**
4. **Usar emails temporales para servicios no críticos**
5. **Monitorear filtraciones**: `haveibeenpwned.com`

### Para Empresas:
1. **No publicar organigramas detallados**
2. **Ofuscar tecnologías en job postings**
3. **Capacitación en ingeniería social**
4. **Segmentación de red interna**
5. **MFA obligatorio en todos los servicios**

### Para Gobierno:
1. **Anonimización de datos en transparencia**
2. **Limitar acceso a RUT público**
3. **Mecanismos de opt-out para datos sensibles**
4. **Sanciones reales por filtraciones**
5. **Auditorías de seguridad obligatorias**

---

## 🔍 Google Dorks Comunes para Chile

```
# RUT + información sensible
site:cl "RUT" "nombre" "dirección"

# Emails gubernamentales
site:gob.cl "@" "contacto"

# Documentos expuestos
site:cl filetype:pdf "confidencial"
site:cl filetype:xlsx "rut" "nombre"

# Compras públicas
site:mercadopublico.cl "especificaciones técnicas"

# Licitaciones con infraestructura
site:mercadopublico.cl "firewall" OR "switch" OR "servidor"

# Transparencia
site:portaltransparencia.cl "remuneración"

# Sentencias judiciales
site:pjud.cl "RUT" "sentencia"
```

---

## ⚖️ Marco Legal en Chile

### Leyes Relevantes:
- **Ley 19.628**: Protección de datos personales (1999) - **OBSOLETA**
- **Ley 21.459**: Ley de Delitos Informáticos (2022)
- **Ley 20.285**: Transparencia y acceso a información pública
- **Proyecto de Ley**: Nueva Ley de Protección de Datos Personales (en trámite, inspirada en GDPR)

### Problema:
- Chile **no tiene equivalente al GDPR europeo**
- Sanciones débiles por filtraciones
- Transparencia vs. Privacidad sin equilibrio claro

---

## 📚 Casos Reales de Exposición

1. **Filtración Registro Civil (2020)**: ~14 millones de RUT expuestos
2. **Vulnerabilidad ChileCompra**: Acceso no autorizado a licitaciones
3. **Isapres**: Múltiples filtraciones de datos médicos
4. **SII**: Datos tributarios en venta en foros clandestinos

---

## 🎯 Uso Ético en DPU Labs

### Aplicaciones Legítimas:
- **OSINT en pentesting autorizado**
- **Threat intelligence**: Monitoreo de exposición de clientes
- **Due diligence**: Investigación de proveedores/socios
- **Respuesta a incidentes**: Identificación de vectores de ataque
- **Awareness**: Entrenamiento en seguridad

### Prohibido:
- Uso para doxxing o acoso
- Venta o comercialización de datos
- Acceso no autorizado a sistemas
- Violación de términos de servicio

---

**Última actualización**: Diciembre 2025  
**Autor**: DPU Labs SpA - Equipo de Purple Team  
**Propósito**: Educación y concientización en ciberseguridad
