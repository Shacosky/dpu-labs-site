import AiKnowledgeNode from '@/lib/models/AiKnowledgeNode';
import AiKnowledgeSubdomain from '@/lib/models/AiKnowledgeSubdomain';
import { Types } from 'mongoose';

/**
 * Servicio para gestión de nodos de conocimiento
 */
export class NodeService {
  /**
   * Crear nodo de conocimiento
   */
  static async createNode(data: {
    subdomainId: Types.ObjectId | string;
    category: string;
    title: string;
    content: string;
    summary: string;
    keywords?: string[];
    examples?: string[];
    contentType?: string;
    source?: any;
    metadata?: any;
    createdBy: string;
  }) {
    try {
      const node = await AiKnowledgeNode.create({
        ...data,
        validation: {
          status: 'pending',
          score: 0,
          validations: [],
        },
        effectiveDate: new Date(),
      });

      return { success: true, node };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener nodo
   */
  static async getNode(nodeId: Types.ObjectId | string) {
    try {
      const node = await AiKnowledgeNode.findById(nodeId)
        .populate('subdomainId')
        .exec();
      return node;
    } catch (error) {
      console.error('Error getting node:', error);
      return null;
    }
  }

  /**
   * Listar nodos por subdominio
   */
  static async listNodesBySubdomain(
    subdomainId: Types.ObjectId | string,
    filters?: {
      status?: string;
      category?: string;
      contentType?: string;
    }
  ) {
    try {
      const query: any = { subdomainId };
      if (filters?.status) query['validation.status'] = filters.status;
      if (filters?.category) query.category = filters.category;
      if (filters?.contentType) query.contentType = filters.contentType;

      const nodes = await AiKnowledgeNode.find(query)
        .sort({ 'stats.feedbackScore': -1, createdAt: -1 })
        .exec();
      return nodes;
    } catch (error) {
      console.error('Error listing nodes:', error);
      return [];
    }
  }

  /**
   * Buscar nodos por keywords
   */
  static async searchNodesByKeywords(keywords: string[], limit: number = 10) {
    try {
      const nodes = await AiKnowledgeNode.find(
        {
          keywords: { $in: keywords },
          'validation.status': 'approved',
        },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .exec();
      return nodes;
    } catch (error) {
      console.error('Error searching nodes:', error);
      return [];
    }
  }

  /**
   * Validar nodo
   */
  static async validateNode(
    nodeId: Types.ObjectId | string,
    validationData: {
      status: 'approved' | 'rejected' | 'needs_review';
      score: number;
      comments?: string;
      validatedBy: string;
    }
  ) {
    try {
      const node = await AiKnowledgeNode.findById(nodeId);
      if (!node) return { success: false, error: 'Node not found' };

      // Agregar validación al array
      node.validation.validations.push({
        validatedBy: validationData.validatedBy,
        validatedAt: new Date(),
        status: validationData.status,
        comments: validationData.comments,
        score: validationData.score,
      });

      // Actualizar estado
      node.validation.status = validationData.status;
      node.validation.score = validationData.score;

      if (validationData.status === 'approved') {
        node.validation.approvedBy = validationData.validatedBy;
        node.validation.approvedAt = new Date();
      } else if (validationData.status === 'rejected') {
        node.validation.rejectionReason = validationData.comments;
      }

      await node.save();
      return { success: true, node };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Actualizar contenido del nodo (crear versión)
   */
  static async updateNodeContent(
    nodeId: Types.ObjectId | string,
    newContent: string,
    modifiedBy: string
  ) {
    try {
      const node = await AiKnowledgeNode.findById(nodeId);
      if (!node) return { success: false, error: 'Node not found' };

      // Guardar versión anterior
      node.previousVersions.push({
        version: node.version,
        content: node.content,
        modifiedBy,
        modifiedAt: new Date(),
      });

      // Actualizar contenido y versión
      node.content = newContent;
      node.version += 1;

      await node.save();
      return { success: true, node };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Agregar feedback al nodo
   */
  static async addFeedback(
    nodeId: Types.ObjectId | string,
    feedback: {
      userId: string;
      rating: number;
      comment?: string;
    }
  ) {
    try {
      const node = await AiKnowledgeNode.findById(nodeId);
      if (!node) return { success: false, error: 'Node not found' };

      node.stats.feedback.push({
        userId: feedback.userId,
        rating: feedback.rating,
        comment: feedback.comment,
        timestamp: new Date(),
      });

      // Calcular nuevo score de feedback
      const avgRating =
        node.stats.feedback.reduce((sum, f) => sum + f.rating, 0) /
        node.stats.feedback.length;
      node.stats.feedbackScore = Math.round(avgRating * 20); // Escala 0-100

      await node.save();
      return { success: true, node };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Registrar uso del nodo en modelos
   */
  static async recordModelUsage(nodeId: Types.ObjectId | string) {
    try {
      const node = await AiKnowledgeNode.findByIdAndUpdate(
        nodeId,
        {
          $inc: { 'stats.usageInModels': 1 },
        },
        { new: true }
      );
      return { success: true, node };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Registrar visualización
   */
  static async recordView(nodeId: Types.ObjectId | string) {
    try {
      const node = await AiKnowledgeNode.findByIdAndUpdate(
        nodeId,
        {
          $inc: { 'stats.viewCount': 1 },
        },
        { new: true }
      );
      return { success: true, node };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener nodos relacionados
   */
  static async getRelatedNodes(nodeId: Types.ObjectId | string, limit: number = 5) {
    try {
      const node = await AiKnowledgeNode.findById(nodeId);
      if (!node) return { success: false, error: 'Node not found' };

      const relatedNodes = await AiKnowledgeNode.find(
        {
          _id: { $in: node.relatedNodeIds },
          'validation.status': 'approved',
        },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .exec();

      return { success: true, relatedNodes };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Listar nodos que expiran pronto
   */
  static async getExpiringNodes(daysFromNow: number = 30) {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysFromNow);

      const nodes = await AiKnowledgeNode.find({
        expiryDate: {
          $gte: new Date(),
          $lte: futureDate,
        },
      }).sort({ expiryDate: 1 });

      return { success: true, nodes };
    } catch (error) {
      return { success: false, error };
    }
  }
}
