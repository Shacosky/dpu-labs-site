import mongoose, { Schema, Types } from 'mongoose';

/**
 * AiKnowledgeIngestion - Registro de ingesta de conocimiento
 * Tracking de cada vez que se agrega conocimiento al sistema
 */
const AiKnowledgeIngestionSchema = new Schema(
  {
    // Referencia a los nodos creados/modificados
    nodeIds: {
      type: [Types.ObjectId],
      ref: 'AiKnowledgeNode',
      required: true,
    },
    
    // Dominio afectado
    domainId: {
      type: Types.ObjectId,
      ref: 'AiKnowledgeDomain',
      required: true,
      index: true,
    },
    
    // Subdominio afectado
    subdomainId: {
      type: Types.ObjectId,
      ref: 'AiKnowledgeSubdomain',
    },
    
    // Tipo de ingesta
    ingestionType: {
      type: String,
      enum: ['manual', 'bulk_upload', 'api', 'web_scraping', 'database_sync', 'import'],
      required: true,
    },
    
    // Fuente de datos
    source: {
      name: String,
      url: String,
      format: String, // JSON, CSV, XML, PDF, etc
      totalRecords: Number,
    },
    
    // Cantidad de nodos procesados
    nodesProcessed: {
      total: Number,
      successful: Number,
      failed: Number,
      skipped: Number,
    },
    
    // Validación durante ingesta
    validation: {
      validationRun: {
        type: Boolean,
        default: true,
      },
      passedValidation: {
        type: Number,
        default: 0,
      },
      failedValidation: {
        type: Number,
        default: 0,
      },
      validationErrors: [String],
    },
    
    // Deduplicación
    deduplication: {
      ran: Boolean,
      duplicatesFound: Number,
      duplicatesRemoved: Number,
      duplicateThreshold: Number, // Porcentaje de similitud
    },
    
    // Cambios en el modelo
    modelImpact: {
      requiresRetraining: Boolean,
      retrainingScheduled: Date,
      estimatedImpact: String, // low, medium, high
    },
    
    // Estado general de la ingesta
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed', 'partially_failed'],
      default: 'pending',
      index: true,
    },
    
    // Quién ejecutó la ingesta
    executedBy: {
      type: String,
      required: true,
    },
    
    // Duración
    duration: {
      startTime: Date,
      endTime: Date,
      durationSeconds: Number,
    },
    
    // Logs y detalles
    logs: [
      {
        timestamp: Date,
        level: String, // info, warning, error
        message: String,
        details: Schema.Types.Mixed,
      },
    ],
    
    // Resumen
    summary: {
      description: String,
      notes: String,
    },
    
    // Cambios antes/después
    metrics: {
      beforeIngestion: {
        totalNodes: Number,
        qualityScore: Number,
      },
      afterIngestion: {
        totalNodes: Number,
        qualityScore: Number,
      },
      deltaNodes: Number,
      deltaQualityScore: Number,
    },
  },
  { timestamps: true }
);

AiKnowledgeIngestionSchema.index({ domainId: 1, createdAt: -1 });
AiKnowledgeIngestionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.AiKnowledgeIngestion || 
  mongoose.model('AiKnowledgeIngestion', AiKnowledgeIngestionSchema);
