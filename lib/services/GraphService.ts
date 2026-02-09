import AiKnowledgeGraph from '@/lib/models/AiKnowledgeGraph';
import AiKnowledgeNode from '@/lib/models/AiKnowledgeNode';
import { Types } from 'mongoose';

/**
 * Servicio para gestión del grafo de conocimiento
 */
export class GraphService {
  /**
   * Crear relación entre nodos
   */
  static async createRelationship(data: {
    sourceNodeId: Types.ObjectId | string;
    targetNodeId: Types.ObjectId | string;
    relationshipType:
      | 'related_to'
      | 'prerequisite_of'
      | 'extends'
      | 'contradicts'
      | 'similar_to'
      | 'case_study_of'
      | 'implements'
      | 'references'
      | 'depends_on';
    weight?: number;
    confidence?: number;
    context?: string;
    bidirectional?: boolean;
    createdBy: string;
    metadata?: any;
  }) {
    try {
      const relationship = await AiKnowledgeGraph.create({
        ...data,
        status: 'active',
      });

      return { success: true, relationship };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener relación
   */
  static async getRelationship(relationshipId: Types.ObjectId | string) {
    try {
      const relationship = await AiKnowledgeGraph.findById(relationshipId)
        .populate('sourceNodeId')
        .populate('targetNodeId')
        .exec();
      return relationship;
    } catch (error) {
      console.error('Error getting relationship:', error);
      return null;
    }
  }

  /**
   * Obtener relaciones de un nodo (salidas)
   */
  static async getOutgoingRelationships(
    nodeId: Types.ObjectId | string,
    relationshipType?: string
  ) {
    try {
      const query: any = {
        sourceNodeId: nodeId,
        status: 'active',
      };
      if (relationshipType) query.relationshipType = relationshipType;

      const relationships = await AiKnowledgeGraph.find(query)
        .populate('targetNodeId')
        .sort({ weight: -1, confidence: -1 })
        .exec();

      return relationships;
    } catch (error) {
      console.error('Error getting outgoing relationships:', error);
      return [];
    }
  }

  /**
   * Obtener relaciones entrantes
   */
  static async getIncomingRelationships(
    nodeId: Types.ObjectId | string,
    relationshipType?: string
  ) {
    try {
      const query: any = {
        targetNodeId: nodeId,
        status: 'active',
      };
      if (relationshipType) query.relationshipType = relationshipType;

      const relationships = await AiKnowledgeGraph.find(query)
        .populate('sourceNodeId')
        .sort({ weight: -1, confidence: -1 })
        .exec();

      return relationships;
    } catch (error) {
      console.error('Error getting incoming relationships:', error);
      return [];
    }
  }

  /**
   * Encontrar caminos entre dos nodos (BFS)
   */
  static async findPath(
    sourceNodeId: Types.ObjectId | string,
    targetNodeId: Types.ObjectId | string,
    maxDepth: number = 5
  ) {
    try {
      const visited = new Set<string>();
      const queue: Array<{ nodeId: string; path: string[] }> = [
        { nodeId: sourceNodeId.toString(), path: [sourceNodeId.toString()] },
      ];

      while (queue.length > 0) {
        const { nodeId, path } = queue.shift()!;

        if (path.length > maxDepth) continue;
        if (visited.has(nodeId)) continue;

        visited.add(nodeId);

        if (nodeId === targetNodeId.toString()) {
          return { success: true, path };
        }

        const relationships = await AiKnowledgeGraph.find({
          sourceNodeId: new Types.ObjectId(nodeId),
          status: 'active',
        });

        for (const rel of relationships) {
          const nextNodeId = rel.targetNodeId.toString();
          if (!visited.has(nextNodeId)) {
            queue.push({
              nodeId: nextNodeId,
              path: [...path, nextNodeId],
            });
          }
        }
      }

      return { success: false, error: 'No path found' };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener nodos similares (por tipo de relación)
   */
  static async getSimilarNodes(
    nodeId: Types.ObjectId | string,
    limit: number = 5
  ) {
    try {
      const similarRelationships = await AiKnowledgeGraph.find({
        $or: [
          { sourceNodeId: nodeId, relationshipType: 'similar_to' },
          { targetNodeId: nodeId, relationshipType: 'similar_to' },
        ],
        status: 'active',
      })
        .sort({ confidence: -1 })
        .limit(limit);

      const similarNodeIds = similarRelationships.map((rel) => {
        return rel.sourceNodeId.toString() === nodeId.toString()
          ? rel.targetNodeId
          : rel.sourceNodeId;
      });

      const nodes = await AiKnowledgeNode.find({ _id: { $in: similarNodeIds } });

      return { success: true, nodes };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener nodos dependientes (que requieren este nodo como prerequisito)
   */
  static async getDependentNodes(
    nodeId: Types.ObjectId | string,
    limit: number = 10
  ) {
    try {
      const dependentRelationships = await AiKnowledgeGraph.find({
        sourceNodeId: nodeId,
        relationshipType: 'prerequisite_of',
        status: 'active',
      })
        .sort({ weight: -1 })
        .limit(limit);

      const dependentNodeIds = dependentRelationships.map((rel) => rel.targetNodeId);
      const nodes = await AiKnowledgeNode.find({ _id: { $in: dependentNodeIds } });

      return { success: true, nodes };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Actualizar relación
   */
  static async updateRelationship(
    relationshipId: Types.ObjectId | string,
    updates: Partial<any>
  ) {
    try {
      const relationship = await AiKnowledgeGraph.findByIdAndUpdate(
        relationshipId,
        updates,
        { new: true }
      );
      return { success: true, relationship };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Desactivar relación
   */
  static async deactivateRelationship(relationshipId: Types.ObjectId | string) {
    try {
      const relationship = await AiKnowledgeGraph.findByIdAndUpdate(
        relationshipId,
        { status: 'inactive' },
        { new: true }
      );
      return { success: true, relationship };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener estadísticas del grafo
   */
  static async getGraphStats() {
    try {
      const totalRelationships = await AiKnowledgeGraph.countDocuments();
      const byType = await AiKnowledgeGraph.aggregate([
        {
          $group: {
            _id: '$relationshipType',
            count: { $sum: 1 },
          },
        },
      ]);

      const avgWeight = await AiKnowledgeGraph.aggregate([
        {
          $group: {
            _id: null,
            avgWeight: { $avg: '$weight' },
            avgConfidence: { $avg: '$confidence' },
          },
        },
      ]);

      return {
        success: true,
        stats: {
          totalRelationships,
          byType,
          avgWeight: avgWeight[0]?.avgWeight || 0,
          avgConfidence: avgWeight[0]?.avgConfidence || 0,
        },
      };
    } catch (error) {
      return { success: false, error };
    }
  }
}
