import mongoose, { Schema } from 'mongoose';

/**
 * AiKnowledgeDomain - Dominios principales de conocimiento
 * Ciberseguridad, Legal, Auditoría, OSINT, Finanzas, General
 */
const AiKnowledgeDomainSchema = new Schema(
  {
    // Dominio principal (ej: cybersecurity, legal, audit, osint, finance, general)
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ['cybersecurity', 'legal', 'audit', 'osint', 'finance', 'general'],
      index: true,
    },
    
    // Descripción del dominio
    description: {
      type: String,
      required: true,
    },
    
    // Icono/emoji representativo
    icon: {
      type: String,
      default: '',
    },
    
    // Color hex para UI
    color: {
      type: String,
      default: '#000000',
    },
    
    // Peso/prioridad en el modelo de IA (1-10)
    priority: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },
    
    // Estado del dominio
    status: {
      type: String,
      enum: ['active', 'inactive', 'beta', 'development'],
      default: 'development',
    },
    
    // Cantidad de nodos de conocimiento
    totalNodes: {
      type: Number,
      default: 0,
    },
    
    // Calidad promedio del dominio (0-100)
    qualityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    
    // Última actualización del modelo
    lastModelUpdate: {
      type: Date,
    },
    
    // Metadatos
    metadata: {
      owner: String, // Usuario que gestiona este dominio
      version: String, // Versión del dominio (ej: 1.0.0)
      tags: [String],
      source: String, // Fuente primaria del conocimiento
    },
  },
  { timestamps: true }
);

AiKnowledgeDomainSchema.index({ status: 1, priority: -1 });

export default mongoose.models.AiKnowledgeDomain || 
  mongoose.model('AiKnowledgeDomain', AiKnowledgeDomainSchema);
