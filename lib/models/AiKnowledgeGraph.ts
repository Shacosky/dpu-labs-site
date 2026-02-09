import mongoose, { Schema, Types } from 'mongoose';

/**
 * AiKnowledgeGraph - Grafo de relaciones entre nodos
 * Permite mapear conexiones y dependencias entre conceptos
 */
const AiKnowledgeGraphSchema = new Schema(
  {
    // Nodo origen
    sourceNodeId: {
      type: Types.ObjectId,
      ref: 'AiKnowledgeNode',
      required: true,
      index: true,
    },
    
    // Nodo destino
    targetNodeId: {
      type: Types.ObjectId,
      ref: 'AiKnowledgeNode',
      required: true,
      index: true,
    },
    
    // Tipo de relación
    relationshipType: {
      type: String,
      enum: [
        'related_to',           // Relacionado general
        'prerequisite_of',      // Prerequisito
        'extends',              // Extiende/expande
        'contradicts',          // Contradice
        'similar_to',           // Similar
        'case_study_of',        // Caso de estudio
        'implements',           // Implementa
        'references',           // Hace referencia
        'depends_on',           // Depende de
      ],
      required: true,
      index: true,
    },
    
    // Peso de la relación (importancia)
    weight: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
    
    // Contexto de la relación
    context: {
      type: String,
    },
    
    // Confianza en la relación (0-100)
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    
    // Bidireccional
    bidirectional: {
      type: Boolean,
      default: false,
    },
    
    // Estado
    status: {
      type: String,
      enum: ['active', 'inactive', 'deprecated'],
      default: 'active',
    },
    
    // Quien creó la relación
    createdBy: {
      type: String,
    },
    
    // Metadatos
    metadata: {
      reasoning: String, // Por qué existe esta relación
      evidence: [String], // URLs o referencias que justifican
    },
  },
  { timestamps: true }
);

// Índices compuestos para traversal del grafo
AiKnowledgeGraphSchema.index({ sourceNodeId: 1, relationshipType: 1 });
AiKnowledgeGraphSchema.index({ targetNodeId: 1, relationshipType: 1 });
AiKnowledgeGraphSchema.index({ weight: -1, confidence: -1 }); // Para find important connections

export default mongoose.models.AiKnowledgeGraph || 
  mongoose.model('AiKnowledgeGraph', AiKnowledgeGraphSchema);
