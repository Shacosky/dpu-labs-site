import mongoose, { Schema, Types } from 'mongoose';

/**
 * AiKnowledgeSubdomain - Subdominios dentro de cada dominio
 * Ej: Cybersecurity > CVEs, Penetration Testing, Network Security, etc.
 */
const AiKnowledgeSubdomainSchema = new Schema(
  {
    // Referencia al dominio padre
    domainId: {
      type: Types.ObjectId,
      ref: 'AiKnowledgeDomain',
      required: true,
      index: true,
    },
    
    // Nombre del subdominio
    name: {
      type: String,
      required: true,
    },
    
    // Descripción
    description: {
      type: String,
    },
    
    // Slug para URLs amigables
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    
    // Icono/emoji
    icon: {
      type: String,
    },
    
    // Orden de visualización
    order: {
      type: Number,
      default: 0,
    },
    
    // Total de nodos en este subdominio
    totalNodes: {
      type: Number,
      default: 0,
    },
    
    // Nodos validados y curados
    validatedNodes: {
      type: Number,
      default: 0,
    },
    
    // Calidad del subdominio (0-100)
    qualityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    
    // Estado
    status: {
      type: String,
      enum: ['active', 'inactive', 'beta', 'development'],
      default: 'development',
    },
    
    // Último ingreso de datos
    lastDataIngestion: {
      type: Date,
    },
    
    // Metadatos
    metadata: {
      owner: String,
      version: String,
      tags: [String],
      relatedSubdomains: [Types.ObjectId], // Referencias a subdominios relacionados
      externalSources: [String], // URLs a fuentes externas
    },
  },
  { timestamps: true }
);

AiKnowledgeSubdomainSchema.index({ domainId: 1, slug: 1 }, { unique: true });
AiKnowledgeSubdomainSchema.index({ status: 1, qualityScore: -1 });

export default mongoose.models.AiKnowledgeSubdomain || 
  mongoose.model('AiKnowledgeSubdomain', AiKnowledgeSubdomainSchema);
