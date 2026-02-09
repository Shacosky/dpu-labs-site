import AiKnowledgeDomain from '@/lib/models/AiKnowledgeDomain';
import AiKnowledgeSubdomain from '@/lib/models/AiKnowledgeSubdomain';
import AiKnowledgeNode from '@/lib/models/AiKnowledgeNode';
import { Types } from 'mongoose';

/**
 * Servicio para gestión de dominios de conocimiento
 */
export class DomainService {
  /**
   * Crear un nuevo dominio
   */
  static async createDomain(data: {
    name: string;
    description: string;
    icon?: string;
    color?: string;
    priority?: number;
    metadata?: any;
  }) {
    try {
      const domain = await AiKnowledgeDomain.create({
        ...data,
        status: 'development',
      });
      return { success: true, domain };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener dominio por ID o nombre
   */
  static async getDomain(identifier: string | Types.ObjectId) {
    try {
      const domain = await AiKnowledgeDomain.findOne(
        typeof identifier === 'string'
          ? { $or: [{ _id: identifier }, { name: identifier }] }
          : { _id: identifier }
      ).exec();
      return domain;
    } catch (error) {
      console.error('Error getting domain:', error);
      return null;
    }
  }

  /**
   * Listar todos los dominios
   */
  static async listDomains(filters?: { status?: string; priority?: number }) {
    try {
      const query: any = {};
      if (filters?.status) query.status = filters.status;
      if (filters?.priority) query.priority = filters.priority;

      const domains = await AiKnowledgeDomain.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .exec();
      return domains;
    } catch (error) {
      console.error('Error listing domains:', error);
      return [];
    }
  }

  /**
   * Actualizar dominio
   */
  static async updateDomain(
    domainId: Types.ObjectId | string,
    updates: Partial<any>
  ) {
    try {
      const domain = await AiKnowledgeDomain.findByIdAndUpdate(
        domainId,
        updates,
        { new: true }
      ).exec();
      return { success: true, domain };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Actualizar puntuación de calidad de un dominio
   */
  static async updateQualityScore(domainId: Types.ObjectId | string) {
    try {
      // Calcular promedio de calidad de nodos aprobados
      const subdomains = await AiKnowledgeSubdomain.find({
        domainId,
      }).select('_id');

      const subdomainIds = subdomains.map((s) => s._id);

      const nodes = await AiKnowledgeNode.find({
        subdomainId: { $in: subdomainIds },
        'validation.status': 'approved',
      }).select('stats.feedbackScore validation.score');

      if (nodes.length === 0) {
        return { success: true, qualityScore: 0 };
      }

      const avgScore =
        nodes.reduce((sum, node) => {
          return sum + (node.stats?.feedbackScore || 0);
        }, 0) / nodes.length;

      await AiKnowledgeDomain.findByIdAndUpdate(domainId, {
        qualityScore: Math.round(avgScore),
      });

      return { success: true, qualityScore: Math.round(avgScore) };
    } catch (error) {
      console.error('Error updating quality score:', error);
      return { success: false, error };
    }
  }

  /**
   * Contar nodos por dominio
   */
  static async countNodesByDomain(domainId: Types.ObjectId | string) {
    try {
      const subdomains = await AiKnowledgeSubdomain.find({
        domainId,
      }).select('_id');

      const subdomainIds = subdomains.map((s) => s._id);

      const total = await AiKnowledgeNode.countDocuments({
        subdomainId: { $in: subdomainIds },
      });

      const approved = await AiKnowledgeNode.countDocuments({
        subdomainId: { $in: subdomainIds },
        'validation.status': 'approved',
      });

      await AiKnowledgeDomain.findByIdAndUpdate(domainId, {
        totalNodes: total,
      });

      return { total, approved };
    } catch (error) {
      console.error('Error counting nodes:', error);
      return { total: 0, approved: 0 };
    }
  }

  /**
   * Activar/desactivar dominio
   */
  static async toggleDomainStatus(
    domainId: Types.ObjectId | string,
    status: 'active' | 'inactive' | 'beta' | 'development'
  ) {
    try {
      const domain = await AiKnowledgeDomain.findByIdAndUpdate(
        domainId,
        { status },
        { new: true }
      );
      return { success: true, domain };
    } catch (error) {
      return { success: false, error };
    }
  }
}
