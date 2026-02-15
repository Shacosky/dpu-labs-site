# 🧠 DPU Labs Custom AI Engine - Documentación Técnica

## 📚 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Modelos de Datos](#modelos-de-datos)
4. [API REST](#api-rest)
5. [Servicios](#servicios)
6. [Flujos de Trabajo](#flujos-de-trabajo)
7. [Ejemplo de Uso](#ejemplo-de-uso)

---

## 🎯 Visión General

DPU Labs Custom AI Engine es un motor de inteligencia artificial multidisciplinario que **crece de forma incremental** mediante una **taxonomía de conocimiento segmentada y curada**.

### Principios Clave

- 🔒 **Privacidad First**: Sin envío de datos a terceros (on-premise capable)
- 📈 **Crecimiento Incremental**: Agregar conocimiento sin reentrenamiento completo
- ✅ **Calidad Controlada**: Validación y curación antes de indexación
- 🔄 **Feedback Loops**: El sistema aprende del uso
- 🌍 **Multidisciplinario**: Ciberseguridad, Legal, Auditoría, OSINT, Finanzas, General

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                   DPU Labs AI Engine                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         API REST (Layer)                             │   │
│  │  /api/ai/domains, /api/ai/nodes, /api/ai/graph...   │   │
│  └──────────────────────────────────────────────────────┘   │
│                            ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Services Layer                               │   │
│  │  DomainService, NodeService, GraphService,           │   │
│  │  IngestionService, ModelVersionService               │   │
│  └──────────────────────────────────────────────────────┘   │
│                            ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         MongoDB Data Layer                           │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐   │   │
│  │  │  Domains    │  │  Subdomains  │  │   Nodes    │   │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘   │   │
│  │  ┌──────────────┐  ┌────────────────┐                 │   │
│  │  │    Graph     │  │   Ingestion    │                 │   │
│  │  └──────────────┘  └────────────────┘                 │   │
│  │  ┌──────────────────┐                                 │   │
│  │  │   Model Versions │                                 │   │
│  │  └──────────────────┘                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Taxonomía Jerárquica

```
Dominios (Nivel 1)
├── Cybersecurity (Ciberseguridad)
├── Legal
├── Audit (Auditoría)
├── OSINT
├── Finance (Finanzas)
└── General

    ↓

Subdominios (Nivel 2)
├── CVEs & Vulnerabilities
├── Penetration Testing
├── Network Security
├── Templates & Policies
├── Risk Assessment
└── ...

    ↓

Knowledge Nodes (Nivel 3)
├── Node 1: "CVSS Score Calculator"
├── Node 2: "Common Web Vulnerabilities"
├── Node 3: "Remediation Template"
└── ...

    ↓

Graph Relationships
├── Node A → "prerequisite_of" → Node B
├── Node B → "extends" → Node C
└── Node A ← "related_to" ← Node D
```

---

## 💾 Modelos de Datos

### 1. **AiKnowledgeDomain**

Dominio principal de conocimiento.

```typescript
{
  name: "cybersecurity",                    // Único
  description: "...",
  icon: "🔒",
  color: "#FF0000",
  priority: 9,                              // 1-10
  status: "active|inactive|beta|development",
  totalNodes: 1250,                         // Contador
  qualityScore: 87,                         // 0-100
  lastModelUpdate: "2026-02-03",
  metadata: {
    owner: "security-team",
    version: "1.0.0",
    tags: ["critical", "priority"],
    source: "internal"
  },
  createdAt: "2026-01-15",
  updatedAt: "2026-02-03"
}
```

### 2. **AiKnowledgeSubdomain**

Subdominios dentro de un dominio.

```typescript
{
  domainId: ObjectId,                       // Referencia a Domain
  name: "CVE & Vulnerabilities",
  description: "...",
  slug: "cve-vulnerabilities",              // URL-friendly
  icon: "🐛",
  order: 1,                                 // Orden de visualización
  totalNodes: 325,
  validatedNodes: 298,
  qualityScore: 91,
  status: "active|beta|development",
  lastDataIngestion: "2026-02-02",
  metadata: {
    owner: "threat-intel-team",
    version: "2.1.0",
    tags: ["nvd", "cve-feeds"],
    relatedSubdomains: [ObjectId, ObjectId],
    externalSources: ["https://nvd.nist.gov"]
  },
  createdAt: "2026-01-20",
  updatedAt: "2026-02-03"
}
```

### 3. **AiKnowledgeNode**

Unidad atómica de conocimiento.

```typescript
{
  subdomainId: ObjectId,                    // Referencia a Subdomain
  category: "CVSS Score",
  title: "Understanding CVSS v3.1 Scoring",
  content: "Markdown content here...",
  summary: "Guide to calculate CVSS scores",
  keywords: ["cvss", "vulnerability", "scoring"],
  examples: ["Example 1", "Example 2"],
  relatedNodeIds: [ObjectId, ObjectId],
  contentType: "text|template|checklist|process|rule|pattern|definition|formula",
  
  structuredData: {
    formula: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    score: 9.8
  },
  
  source: {
    title: "NIST NVD",
    url: "https://nvd.nist.gov/...",
    author: "NIST",
    datePublished: "2020-01-01",
    credibility: 100
  },
  
  validation: {
    status: "approved|pending|rejected|needs_review",
    score: 95,
    validations: [
      {
        validatedBy: "security-expert@dpu.labs",
        validatedAt: "2026-02-01",
        status: "approved",
        comments: "Excellent quality",
        score: 95
      }
    ],
    approvedBy: "security-expert@dpu.labs",
    approvedAt: "2026-02-01"
  },
  
  effectiveDate: "2026-01-20",
  expiryDate: "2027-01-20",
  
  stats: {
    viewCount: 1250,
    usageInModels: 34,
    feedbackScore: 92,
    feedback: [
      {
        userId: "user123",
        rating: 5,
        comment: "Very helpful",
        timestamp: "2026-02-02"
      }
    ]
  },
  
  version: 3,
  previousVersions: [
    {
      version: 2,
      content: "Previous content...",
      modifiedBy: "editor@dpu.labs",
      modifiedAt: "2026-01-25"
    }
  ],
  
  metadata: {
    createdBy: "initial-curator@dpu.labs",
    owner: "security-team",
    tags: ["critical", "external-source"],
    language: "es|en|pt",
    difficulty: "beginner|intermediate|advanced|expert",
    confidentiality: "public|internal|confidential"
  },
  
  createdAt: "2026-01-20",
  updatedAt: "2026-02-03"
}
```

### 4. **AiKnowledgeGraph**

Relaciones entre nodos.

```typescript
{
  sourceNodeId: ObjectId,
  targetNodeId: ObjectId,
  
  relationshipType: "related_to|prerequisite_of|extends|contradicts|similar_to|case_study_of|implements|references|depends_on",
  
  weight: 0.8,                              // 0-1, importancia
  context: "CVSS is used to evaluate vulnerabilities",
  confidence: 95,                           // 0-100
  bidirectional: false,
  status: "active|inactive|deprecated",
  
  createdBy: "curator@dpu.labs",
  
  metadata: {
    reasoning: "CVSS scoring is a prerequisite for risk assessment",
    evidence: ["https://...", "https://..."]
  },
  
  createdAt: "2026-01-22",
  updatedAt: "2026-02-03"
}
```

### 5. **AiKnowledgeIngestion**

Registro de ingesta de conocimiento.

```typescript
{
  nodeIds: [ObjectId, ObjectId, ...],       // Nodos creados/modificados
  domainId: ObjectId,
  subdomainId: ObjectId,
  
  ingestionType: "manual|bulk_upload|api|web_scraping|database_sync|import",
  
  source: {
    name: "NVD CVE Feed",
    url: "https://nvd.nist.gov/feeds/json/cve/1.1",
    format: "JSON",
    totalRecords: 500
  },
  
  nodesProcessed: {
    total: 500,
    successful: 485,
    failed: 10,
    skipped: 5
  },
  
  validation: {
    validationRun: true,
    passedValidation: 485,
    failedValidation: 15,
    validationErrors: ["Invalid field X", "Missing required field Y"]
  },
  
  deduplication: {
    ran: true,
    duplicatesFound: 8,
    duplicatesRemoved: 8,
    duplicateThreshold: 95
  },
  
  modelImpact: {
    requiresRetraining: true,
    retrainingScheduled: "2026-02-04",
    estimatedImpact: "medium|high"
  },
  
  status: "pending|in_progress|completed|failed|partially_failed",
  executedBy: "data-pipeline@dpu.labs",
  
  duration: {
    startTime: "2026-02-03T10:00:00Z",
    endTime: "2026-02-03T10:45:00Z",
    durationSeconds: 2700
  },
  
  logs: [
    {
      timestamp: "2026-02-03T10:00:00Z",
      level: "info|warning|error",
      message: "Starting ingestion...",
      details: { ... }
    }
  ],
  
  metrics: {
    beforeIngestion: {
      totalNodes: 1250,
      qualityScore: 87
    },
    afterIngestion: {
      totalNodes: 1735,
      qualityScore: 88
    },
    deltaNodes: 485,
    deltaQualityScore: 1
  },
  
  createdAt: "2026-02-03",
  updatedAt: "2026-02-03"
}
```

### 6. **AiModelVersion**

Versión entrenada del modelo de IA.

```typescript
{
  versionNumber: "1.2.0",                   // Semver único
  name: "DPU Labs AI v1.2 - Cybersecurity Focus",
  description: "Enhanced with CVE feeds and pentest reports",
  
  domains: [ObjectId, ObjectId],            // Dominios incluidos
  
  trainingStats: {
    trainingStartDate: "2026-01-15",
    trainingEndDate: "2026-02-01",
    totalNodesUsed: 5200,
    validatedNodesUsed: 4890,
    trainingDurationHours: 48,
    datasetSize: "3.2GB"
  },
  
  performance: {
    accuracy: 94.3,
    precision: 93.8,
    recall: 94.7,
    f1Score: 0.947,
    benchmarkResults: { ... }
  },
  
  parameters: {
    modelType: "LLaMA-2",
    modelSize: "13B",
    quantization: "int8",
    contextLength: 4096,
    batchSize: 32,
    learningRate: 0.0001
  },
  
  inference: {
    averageLatencyMs: 250,
    tokensPerSecond: 40,
    memoryRequiredGb: 16,
    gpuRequired: true,
    recommendedHardware: "NVIDIA A100 (80GB)"
  },
  
  changelog: {
    majorChanges: ["Added CVE analysis", "Improved legal templates"],
    bugFixes: ["Fixed token counting", "Memory leak in graph traversal"],
    improvements: ["10% faster inference", "Better accuracy on audit data"]
  },
  
  compatibility: {
    previousVersion: "1.1.0",
    breakingChanges: false,
    rollbackSupported: true
  },
  
  status: "stable|beta|development|deprecated|retired",
  releaseDate: "2026-02-03",
  sunsetDate: "2027-02-03",
  
  distribution: {
    publiclyAvailable: true,
    apiEndpoint: "https://api.dpu.labs/ai/v1.2",
    downloadUrl: "https://models.dpu.labs/v1.2.tar.gz",
    checksumSha256: "abc123..."
  },
  
  trainedBy: "ml-team@dpu.labs",
  
  validation: {
    humanReviewDone: true,
    reviewedBy: ["expert1@dpu.labs", "expert2@dpu.labs"],
    validationScore: 96,
    knownLimitations: ["Limited Portuguese support", "Finance data v1.0"]
  },
  
  monitoring: {
    driftScore: 0.05,
    lastMonitoredDate: "2026-02-03",
    incidentsReported: 0,
    averageUserSatisfaction: 4.7
  },
  
  createdAt: "2026-02-03",
  updatedAt: "2026-02-03"
}
```

---

## 🔌 API REST

### Base URL
```
https://api.dpu.labs/ai
```

### Authentication
Todas las rutas requieren header `Authorization: Bearer <API_KEY>`

### Rate Limiting
- **Tier Starter**: 100 req/min
- **Tier Professional**: 1000 req/min
- **Tier Enterprise**: Custom

---

### Dominios

#### GET `/domains`
Listar todos los dominios.

**Query Parameters:**
- `status` (opcional): `active|inactive|beta|development`
- `priority` (opcional): 1-10

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "cybersecurity",
      "description": "...",
      "icon": "🔒",
      "color": "#FF0000",
      "priority": 9,
      "status": "active",
      "totalNodes": 1250,
      "qualityScore": 87,
      "createdAt": "2026-01-15T...",
      "updatedAt": "2026-02-03T..."
    }
  ],
  "count": 6
}
```

#### POST `/domains`
Crear nuevo dominio.

**Request Body:**
```json
{
  "name": "cybersecurity",
  "description": "Cybersecurity knowledge base",
  "icon": "🔒",
  "color": "#FF0000",
  "priority": 9,
  "metadata": {
    "owner": "security-team",
    "version": "1.0.0",
    "tags": ["critical"]
  }
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": { ... }
}
```

#### GET `/domains/{id}`
Obtener dominio específico.

#### PATCH `/domains/{id}`
Actualizar dominio.

---

### Subdominios

#### GET `/subdomains?subdomainId={id}`
Listar subdominios de un dominio.

#### POST `/subdomains`
Crear subdominio.

**Request Body:**
```json
{
  "domainId": "...",
  "name": "CVE & Vulnerabilities",
  "description": "...",
  "slug": "cve-vulnerabilities",
  "icon": "🐛",
  "order": 1,
  "metadata": { ... }
}
```

#### GET `/subdomains/{id}`
Obtener subdominio.

#### GET `/subdomains/{id}/stats`
Obtener estadísticas del subdominio.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 325,
    "validated": 298,
    "pending": 20,
    "rejected": 7,
    "validationRate": "91.69",
    "qualityScore": 91
  }
}
```

---

### Nodos (Knowledge Nodes)

#### GET `/nodes?subdomainId={id}&status={status}&search={query}`
Buscar nodos.

**Query Parameters:**
- `subdomainId` (requerido)
- `status` (opcional): `pending|approved|rejected|needs_review`
- `category` (opcional)
- `search` (opcional): búsqueda por keywords

#### POST `/nodes`
Crear nodo de conocimiento.

**Request Body:**
```json
{
  "subdomainId": "...",
  "category": "CVSS Score",
  "title": "Understanding CVSS v3.1 Scoring",
  "content": "# CVSS Scoring Guide\n...",
  "summary": "Guide to calculate CVSS scores",
  "keywords": ["cvss", "vulnerability", "scoring"],
  "examples": ["Example 1"],
  "contentType": "text|template|checklist|process|rule",
  "source": {
    "title": "NIST NVD",
    "url": "https://...",
    "author": "NIST",
    "credibility": 100
  },
  "createdBy": "curator@dpu.labs",
  "metadata": {
    "language": "es",
    "difficulty": "intermediate",
    "confidentiality": "public"
  }
}
```

#### GET `/nodes/{id}`
Obtener nodo (y registra visualización).

#### PATCH `/nodes/{id}`
Actualizar nodo.

**Acciones disponibles:**

1. **Validar nodo:**
```json
{
  "action": "validate",
  "status": "approved|rejected|needs_review",
  "score": 95,
  "comments": "Good quality",
  "validatedBy": "expert@dpu.labs"
}
```

2. **Agregar feedback:**
```json
{
  "action": "addFeedback",
  "userId": "user123",
  "rating": 5,
  "comment": "Very helpful"
}
```

#### GET `/nodes/{id}/related`
Obtener nodos relacionados.

---

### Grafo (Knowledge Graph)

#### GET `/graph?nodeId={id}&direction={direction}&type={type}`
Obtener relaciones de un nodo.

**Query Parameters:**
- `nodeId` (requerido)
- `direction` (opcional): `outgoing|incoming|both` (default: `outgoing`)
- `type` (opcional): tipo de relación

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "sourceNodeId": { "_id": "...", "title": "..." },
      "targetNodeId": { "_id": "...", "title": "..." },
      "relationshipType": "prerequisite_of",
      "weight": 0.8,
      "confidence": 95,
      "context": "CVSS is used...",
      "status": "active"
    }
  ],
  "count": 5
}
```

#### POST `/graph`
Crear relación entre nodos.

**Request Body:**
```json
{
  "sourceNodeId": "...",
  "targetNodeId": "...",
  "relationshipType": "prerequisite_of|extends|related_to|similar_to|case_study_of|implements|references|depends_on|contradicts",
  "weight": 0.8,
  "confidence": 95,
  "context": "Contextual information",
  "bidirectional": false,
  "createdBy": "curator@dpu.labs",
  "metadata": {
    "reasoning": "Why this relationship exists",
    "evidence": ["https://..."]
  }
}
```

---

### Ingesta (Knowledge Ingestion)

#### POST `/ingestion`
Iniciar proceso de ingesta.

**Request Body:**
```json
{
  "domainId": "...",
  "subdomainId": "...",
  "ingestionType": "manual|bulk_upload|api|web_scraping|database_sync|import",
  "source": {
    "name": "NVD CVE Feed",
    "url": "https://nvd.nist.gov/feeds/json/cve/1.1",
    "format": "JSON"
  },
  "executedBy": "data-pipeline@dpu.labs"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "ingestion-id",
    "status": "pending",
    "nodeIds": [],
    "nodesProcessed": { "total": 0, "successful": 0, "failed": 0, "skipped": 0 }
  }
}
```

#### POST `/ingestion/{id}/batch`
Procesar lote de nodos.

**Request Body:**
```json
{
  "nodes": [
    {
      "subdomainId": "...",
      "category": "CVE",
      "title": "CVE-2024-1234",
      "content": "...",
      "summary": "...",
      "keywords": ["cve", "2024"],
      "source": { ... }
    },
    { ... }
  ],
  "executedBy": "data-pipeline@dpu.labs"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "successful": 48,
    "failed": 1,
    "skipped": 1,
    "nodeIds": ["...", "...", ...],
    "errors": ["Duplicate: Node title X"]
  }
}
```

#### PATCH `/ingestion/{id}`
Completar o fallar ingesta.

**Para completar:**
```json
{
  "action": "complete"
}
```

**Para fallar:**
```json
{
  "action": "fail",
  "errorMessage": "Network timeout"
}
```

#### GET `/ingestion?domainId={id}&limit=10`
Obtener historial de ingestas.

---

### Modelos (Model Versions)

#### GET `/models?status={status}&limit=50`
Listar versiones de modelos.

#### GET `/models/stable`
Obtener versión estable actual.

#### POST `/models`
Crear nueva versión de modelo.

**Request Body:**
```json
{
  "versionNumber": "1.2.0",
  "name": "DPU Labs AI v1.2",
  "description": "Enhanced with CVE feeds",
  "domains": ["...", "..."],
  "trainingStats": {
    "totalNodesUsed": 5200,
    "validatedNodesUsed": 4890,
    "trainingDurationHours": 48,
    "datasetSize": "3.2GB"
  },
  "parameters": {
    "modelType": "LLaMA-2",
    "modelSize": "13B",
    "quantization": "int8",
    "contextLength": 4096,
    "batchSize": 32,
    "learningRate": 0.0001
  },
  "trainedBy": "ml-team@dpu.labs"
}
```

#### GET `/models/{version}`
Obtener versión específica.

#### PATCH `/models/{version}`
Actualizar versión.

**Acciones disponibles:**

1. **Actualizar estado:**
```json
{
  "action": "updateStatus",
  "status": "stable|beta|development|deprecated|retired"
}
```

2. **Registrar métricas de performance:**
```json
{
  "action": "updatePerformance",
  "accuracy": 94.3,
  "precision": 93.8,
  "recall": 94.7,
  "f1Score": 0.947
}
```

3. **Registrar estadísticas de inferencia:**
```json
{
  "action": "updateInference",
  "averageLatencyMs": 250,
  "tokensPerSecond": 40,
  "memoryRequiredGb": 16
}
```

4. **Promover a estable:**
```json
{
  "action": "promoteToStable"
}
```

---

## 🛠️ Servicios

### DomainService

```typescript
// Crear dominio
const result = await DomainService.createDomain({
  name: 'cybersecurity',
  description: 'Security knowledge base',
  priority: 9
});

// Obtener dominio
const domain = await DomainService.getDomain('cybersecurity');

// Listar dominios
const domains = await DomainService.listDomains({ status: 'active' });

// Actualizar calidad
const { qualityScore } = await DomainService.updateQualityScore(domainId);

// Contar nodos
const { total, approved } = await DomainService.countNodesByDomain(domainId);
```

### NodeService

```typescript
// Crear nodo
const result = await NodeService.createNode({
  subdomainId,
  category: 'CVSS Score',
  title: '...',
  content: '...',
  summary: '...',
  keywords: ['cvss'],
  createdBy: 'curator@dpu.labs'
});

// Buscar por keywords
const nodes = await NodeService.searchNodesByKeywords(['cvss', 'vulnerability'], 10);

// Validar nodo
await NodeService.validateNode(nodeId, {
  status: 'approved',
  score: 95,
  validatedBy: 'expert@dpu.labs'
});

// Agregar feedback
await NodeService.addFeedback(nodeId, {
  userId: 'user123',
  rating: 5,
  comment: 'Helpful'
});

// Registrar uso en modelo
await NodeService.recordModelUsage(nodeId);
```

### GraphService

```typescript
// Crear relación
const result = await GraphService.createRelationship({
  sourceNodeId: nodeA,
  targetNodeId: nodeB,
  relationshipType: 'prerequisite_of',
  weight: 0.8,
  confidence: 95,
  createdBy: 'curator@dpu.labs'
});

// Obtener relaciones salientes
const outgoing = await GraphService.getOutgoingRelationships(nodeId);

// Obtener relaciones entrantes
const incoming = await GraphService.getIncomingRelationships(nodeId);

// Encontrar camino entre nodos
const { path } = await GraphService.findPath(nodeA, nodeB, maxDepth=5);

// Obtener nodos similares
const { nodes } = await GraphService.getSimilarNodes(nodeId, limit=5);
```

### IngestionService

```typescript
// Iniciar ingesta
const result = await IngestionService.createIngestionRecord({
  domainId,
  ingestionType: 'bulk_upload',
  executedBy: 'pipeline@dpu.labs'
});

// Procesar lote
const batch = await IngestionService.processBatch(
  ingestionId,
  [
    { subdomainId, category, title, content, summary, keywords },
    { ... }
  ],
  'pipeline@dpu.labs'
);

// Completar ingesta
const completed = await IngestionService.completeIngestion(ingestionId);

// Obtener estadísticas
const stats = await IngestionService.getIngestionStats(domainId);
```

---

## 📊 Flujos de Trabajo

### Flujo 1: Agregar Conocimiento Nuevo

```
1. Crear Ingestion Record
   POST /api/ai/ingestion
   → ingestionId

2. Procesar Lote de Nodos
   POST /api/ai/ingestion/{id}/batch
   → nodeIds creados

3. Validar Nodos
   PATCH /api/ai/nodes/{id} (action: validate)
   → aprobación manual

4. Crear Relaciones
   POST /api/ai/graph
   → conectar nodos relacionados

5. Completar Ingesta
   PATCH /api/ai/ingestion/{id} (action: complete)
   → métricas finales

6. Entrenar Modelo
   (Disparado automáticamente si impacto > threshold)
   → nueva versión de modelo
```

### Flujo 2: Buscar Conocimiento

```
1. Buscar Nodos
   GET /api/ai/nodes?search=keywords

2. Obtener Nodo Específico
   GET /api/ai/nodes/{id}
   → registra visualización

3. Obtener Relacionados
   GET /api/ai/nodes/{id}/related

4. Explorar Grafo
   GET /api/ai/graph?nodeId={id}&direction=both

5. Usar en Modelo
   (Sistema registra uso automáticamente)
```

### Flujo 3: Curación de Datos

```
1. Listar Nodos Pendientes
   GET /api/ai/nodes?status=pending

2. Revisar Nodo
   GET /api/ai/nodes/{id}

3. Validar/Rechazar
   PATCH /api/ai/nodes/{id} (action: validate)

4. Agregar Feedback
   PATCH /api/ai/nodes/{id} (action: addFeedback)

5. Actualizar Calidad
   (Sistema calcula automáticamente)
```

### Flujo 4: Versionado de Modelo

```
1. Entrenar Modelo
   POST /api/ai/models
   → version en development

2. Registrar Performance
   PATCH /api/ai/models/{version} (action: updatePerformance)

3. Registrar Inferencia
   PATCH /api/ai/models/{version} (action: updateInference)

4. Validar
   (Equipo ML revisa)

5. Promover a Beta
   PATCH /api/ai/models/{version} (action: updateStatus)

6. Promover a Estable
   PATCH /api/ai/models/{version} (action: promoteToStable)
```

---

## 💡 Ejemplo de Uso

### Escenario: Agregar CVEs de NVD

```bash
# 1. Iniciar ingesta desde NVD
curl -X POST https://api.dpu.labs/ai/ingestion \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domainId": "cybersecurity-id",
    "subdomainId": "cve-vulnerabilities-id",
    "ingestionType": "web_scraping",
    "source": {
      "name": "NIST NVD",
      "url": "https://nvd.nist.gov/feeds/json/cve/1.1",
      "format": "JSON"
    },
    "executedBy": "automation@dpu.labs"
  }'

# Respuesta:
# {
#   "success": true,
#   "data": {
#     "_id": "ing-123456",
#     "status": "pending"
#   }
# }

# 2. Procesar lote de 100 CVEs
curl -X POST https://api.dpu.labs/ai/ingestion/ing-123456/batch \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": [
      {
        "subdomainId": "cve-vulnerabilities-id",
        "category": "CVE",
        "title": "CVE-2024-1234",
        "content": "A vulnerability in X allows...",
        "summary": "DoS vulnerability in X",
        "keywords": ["dos", "remote", "network"],
        "source": {
          "title": "NVD",
          "url": "https://nvd.nist.gov/vuln/detail/CVE-2024-1234",
          "credibility": 100
        }
      },
      { ... }
    ],
    "executedBy": "automation@dpu.labs"
  }'

# 3. Completar ingesta
curl -X PATCH https://api.dpu.labs/ai/ingestion/ing-123456 \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "action": "complete" }'

# 4. Verificar estadísticas del subdominio
curl -X GET "https://api.dpu.labs/ai/subdomains/cve-vulnerabilities-id/stats" \
  -H "Authorization: Bearer $API_KEY"

# Respuesta:
# {
#   "success": true,
#   "data": {
#     "total": 325,
#     "validated": 298,
#     "pending": 20,
#     "rejected": 7,
#     "validationRate": "91.69",
#     "qualityScore": 91
#   }
# }
```

---

## 🚀 Próximas Fases

1. **Inferencia**: Endpoints para consultar el modelo entrenado
2. **Fine-tuning**: API para entrenar modelos personalizados
3. **Monitoring**: Dashboard de performance y drift detection
4. **Marketplace**: Venta de datasets y prompts premium
5. **Webhooks**: Notificaciones de cambios en el grafo

---

## 📞 Soporte

- Email: ai-engine@dpu.labs
- Documentación: https://docs.dpu.labs/ai
- GitHub: https://github.com/dpu-labs/ai-engine

