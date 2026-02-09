import mongoose, { Schema, Types } from 'mongoose';

/**
 * Esquema de validación de un nodo
 */
interface ValidationRecord {
  validatedBy: string;
  validatedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  comments?: string;
  score: number; // 0-100
}

/**
 * AiKnowledgeNode - Nodos individuales de conocimiento
 * Unidad atómica de información que alimenta el modelo de IA
 */
const AiKnowledgeNodeSchema = new Schema(
  {
    // Referencia al subdominio
    subdomainId: {
      type: Types.ObjectId,
      ref: 'AiKnowledgeSubdomain',
      required: true,
      index: true,
    },
    
    // Categoría del nodo (ej: "CVSS Score", "Legal Template", "OSINT Technique")
    category: {
      type: String,
      required: true,
      index: true,
    },
    
    // Título del nodo
    title: {
      type: String,
      required: true,
    },
    
    // Contenido principal (Markdown permitido)
    content: {
      type: String,
      required: true,
    },
    
    // Resumen (para RAG/búsqueda)
    summary: {
      type: String,
      required: true,
    },
    
    // Palabras clave para búsqueda semántica
    keywords: {
      type: [String],
      index: true,
    },
    
    // Ejemplos o casos de uso
    examples: {
      type: [String],
      default: [],
    },
    
    // Referencias relacionadas (otros nodos)
    relatedNodeIds: {
      type: [Types.ObjectId],
      ref: 'AiKnowledgeNode',
      default: [],
    },
    
    // Tipo de contenido
    contentType: {
      type: String,
      enum: ['text', 'template', 'checklist', 'process', 'rule', 'pattern', 'definition', 'formula'],
      default: 'text',
    },
    
    // Datos estructurados (JSON)
    structuredData: {
      type: Schema.Types.Mixed,
    },
    
    // Fuente del conocimiento
    source: {
      title: String,
      url: String,
      author: String,
      datePublished: Date,
      credibility: {
        type: Number,
        min: 0,
        max: 100,
        default: 50,
      },
    },
    
    // Validación y curación
    validation: {
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'needs_review'],
        default: 'pending',
        index: true,
      },
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      validations: [
        {
          validatedBy: String,
          validatedAt: Date,
          status: String,
          comments: String,
          score: Number,
        },
      ],
      approvedBy: String,
      approvedAt: Date,
      rejectionReason: String,
    },
    
    // Vigencia del conocimiento
    effectiveDate: {
      type: Date,
      default: () => new Date(),
    },
    expiryDate: {
      type: Date,
    },
    
    // Estadísticas de uso
    stats: {
      viewCount: {
        type: Number,
        default: 0,
      },
      usageInModels: {
        type: Number,
        default: 0,
      },
      feedbackScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      feedback: [
        {
          userId: String,
          rating: Number,
          comment: String,
          timestamp: Date,
        },
      ],
    },
    
    // Control de versiones
    version: {
      type: Number,
      default: 1,
    },
    previousVersions: [
      {
        version: Number,
        content: String,
        modifiedBy: String,
        modifiedAt: Date,
      },
    ],
    
    // Metadatos
    metadata: {
      createdBy: String,
      owner: String,
      tags: [String],
      language: {
        type: String,
        default: 'es',
        enum: ['es', 'en', 'pt'],
      },
      difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate',
      },
      confidentiality: {
        type: String,
        enum: ['public', 'internal', 'confidential'],
        default: 'public',
      },
    },
  },
  { timestamps: true }
);

// Índices para búsqueda y rendimiento
AiKnowledgeNodeSchema.index({ subdomainId: 1, 'validation.status': 1 });
AiKnowledgeNodeSchema.index({ 'validation.status': 1, 'stats.feedbackScore': -1 });
AiKnowledgeNodeSchema.index({ createdAt: -1 }); // Para ingesta incremental

export default mongoose.models.AiKnowledgeNode || 
  mongoose.model('AiKnowledgeNode', AiKnowledgeNodeSchema);
