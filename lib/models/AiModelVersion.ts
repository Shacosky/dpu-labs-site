import mongoose, { Schema, Types } from 'mongoose';

/**
 * AiModelVersion - Versionado de modelos de IA
 * Tracking de cada versión del modelo entrenado
 */
const AiModelVersionSchema = new Schema(
  {
    // Versión del modelo (ej: 1.0.0, 1.1.0)
    versionNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    
    // Nombre descriptivo
    name: {
      type: String,
    },
    
    // Descripción de cambios
    description: {
      type: String,
    },
    
    // Dominio(s) incluidos en este modelo
    domains: {
      type: [Types.ObjectId],
      ref: 'AiKnowledgeDomain',
      required: true,
    },
    
    // Estadísticas de entrenamiento
    trainingStats: {
      trainingStartDate: Date,
      trainingEndDate: Date,
      totalNodesUsed: Number,
      validatedNodesUsed: Number,
      trainingDurationHours: Number,
      datasetSize: String, // Ej: "2.5GB"
    },
    
    // Desempeño del modelo
    performance: {
      accuracy: Number, // 0-100
      precision: Number,
      recall: Number,
      f1Score: Number,
      benchmarkResults: Schema.Types.Mixed, // Resultados de benchmarks
    },
    
    // Parametros del modelo
    parameters: {
      modelType: String, // Ej: "LLaMA-2", "GPT-like"
      modelSize: String, // Ej: "7B", "13B", "70B"
      quantization: String, // Ej: "int4", "int8", "fp16"
      contextLength: Number,
      batchSize: Number,
      learningRate: Number,
    },
    
    // Inferencia
    inference: {
      averageLatencyMs: Number,
      tokensPerSecond: Number,
      memoryRequiredGb: Number,
      gpuRequired: Boolean,
      recommendedHardware: String,
    },
    
    // Cambios desde la versión anterior
    changelog: {
      majorChanges: [String],
      bugFixes: [String],
      improvements: [String],
    },
    
    // Compatibilidad
    compatibility: {
      previousVersion: String,
      breakingChanges: Boolean,
      breakingChangesList: [String],
      rollbackSupported: Boolean,
    },
    
    // Disponibilidad
    status: {
      type: String,
      enum: ['development', 'beta', 'stable', 'deprecated', 'retired'],
      default: 'development',
      index: true,
    },
    
    // Releases
    releaseDate: Date,
    sunsetDate: Date, // Fecha de fin de soporte
    
    // Acceso y distribución
    distribution: {
      publiclyAvailable: Boolean,
      apiEndpoint: String,
      downloadUrl: String,
      checksumSha256: String,
    },
    
    // Quién creó/entrenó esta versión
    trainedBy: {
      type: String,
      required: true,
    },
    
    // Artifacts del modelo
    artifacts: {
      modelPath: String,
      configPath: String,
      tokenizerPath: String,
      weightsPath: String,
    },
    
    // Validaciones post-entrenamiento
    validation: {
      humanReviewDone: Boolean,
      reviewedBy: [String],
      validationScore: Number,
      knownLimitations: [String],
    },
    
    // Feedback y monitoreo
    monitoring: {
      driftScore: Number, // Desviación del desempeño
      lastMonitoredDate: Date,
      incidentsReported: Number,
      averageUserSatisfaction: Number,
    },
    
    // Metadatos
    metadata: {
      notes: String,
      tags: [String],
      relatedDocumentation: [String],
    },
  },
  { timestamps: true }
);

AiModelVersionSchema.index({ versionNumber: 1 });
AiModelVersionSchema.index({ status: 1, releaseDate: -1 });
AiModelVersionSchema.index({ domains: 1, status: 1 });

export default mongoose.models.AiModelVersion || 
  mongoose.model('AiModelVersion', AiModelVersionSchema);
