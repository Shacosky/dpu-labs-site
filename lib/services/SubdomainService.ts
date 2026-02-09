import AiKnowledgeSubdomain from '@/lib/models/AiKnowledgeSubdomain';
import AiKnowledgeNode from '@/lib/models/AiKnowledgeNode';
import { Types } from 'mongoose';

/**
 * Servicio para gestión de subdominios
 */
export class SubdomainService {
  /**
   * Crear subdominio
   */
  static async createSubdomain(data: {
    domainId: Types.ObjectId | string;
    name: string;
    description?: string;
    slug: string;
    icon?: string;
    order?: number;
    metadata?: any;
  }) {
    try {
      const subdomain = await AiKnowledgeSubdomain.create({
        ...data,
        status: 'development',
      });
      return { success: true, subdomain };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener subdominio
   */
  static async getSubdomain(subdomainId: Types.ObjectId | string) {
    try {
      const subdomain = await AiKnowledgeSubdomain.findById(subdomainId)
        .populate('domainId')
        .exec();
      return subdomain;
    } catch (error) {
      console.error('Error getting subdomain:', error);
      return null;
    }
  }

  /**
   * Listar subdominios por dominio
   */
  static async listSubdomainsByDomain(
    domainId: Types.ObjectId | string,
    filters?: { status?: string }
  ) {
    try {
      const query: any = { domainId };
      if (filters?.status) query.status = filters.status;

      const subdomains = await AiKnowledgeSubdomain.find(query)
        .sort({ order: 1, createdAt: -1 })
        .exec();
      return subdomains;
    } catch (error) {
      console.error('Error listing subdomains:', error);
      return [];
    }
  }

  /**
   * Actualizar subdominio
   */
  static async updateSubdomain(
    subdomainId: Types.ObjectId | string,
    updates: Partial<any>
  ) {
    try {
      const subdomain = await AiKnowledgeSubdomain.findByIdAndUpdate(
        subdomainId,
        updates,
        { new: true }
      ).exec();
      return { success: true, subdomain };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Actualizar puntuación de calidad
   */
  static async updateQualityScore(subdomainId: Types.ObjectId | string) {
    try {
      const nodes = await AiKnowledgeNode.find({
        subdomainId,
        'validation.status': 'approved',
      }).select('stats.feedbackScore');

      if (nodes.length === 0) {
        return { success: true, qualityScore: 0 };
      }

      const avgScore =
        nodes.reduce((sum, node) => {
          return sum + (node.stats?.feedbackScore || 0);
        }, 0) / nodes.length;

      const score = Math.round(avgScore);

      await AiKnowledgeSubdomain.findByIdAndUpdate(subdomainId, {
        qualityScore: score,
      });

      return { success: true, qualityScore: score };
    } catch (error) {
      console.error('Error updating quality score:', error);
      return { success: false, error };
    }
  }

  /**
   * Contar nodos por subdominio
   */
  static async countNodes(subdomainId: Types.ObjectId | string) {
    try {
      const total = await AiKnowledgeNode.countDocuments({ subdomainId });
      const validated = await AiKnowledgeNode.countDocuments({
        subdomainId,
        'validation.status': 'approved',
      });

      await AiKnowledgeSubdomain.findByIdAndUpdate(subdomainId, {
        totalNodes: total,
        validatedNodes: validated,
      });

      return { total, validated };
    } catch (error) {
      console.error('Error counting nodes:', error);
      return { total: 0, validated: 0 };
    }
  }

  /**
   * Registrar último ingreso de datos
   */
  static async recordDataIngestion(subdomainId: Types.ObjectId | string) {
    try {
      const subdomain = await AiKnowledgeSubdomain.findByIdAndUpdate(
        subdomainId,
        { lastDataIngestion: new Date() },
        { new: true }
      );
      return { success: true, subdomain };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener estadísticas del subdominio
   */
  static async getStats(subdomainId: Types.ObjectId | string) {
    try {
      const subdomain = await AiKnowledgeSubdomain.findById(subdomainId);

      if (!subdomain) {
        return { success: false, error: 'Subdomain not found' };
      }

      const total = await AiKnowledgeNode.countDocuments({ subdomainId });
      const validated = await AiKnowledgeNode.countDocuments({
        subdomainId,
        'validation.status': 'approved',
      });
      const pending = await AiKnowledgeNode.countDocuments({
        subdomainId,
        'validation.status': 'pending',
      });
      const rejected = await AiKnowledgeNode.countDocuments({
        subdomainId,
        'validation.status': 'rejected',
      });

      return {
        success: true,
        stats: {
          total,
          validated,
          pending,
          rejected,
          validationRate: total > 0 ? ((validated / total) * 100).toFixed(2) : 0,
          qualityScore: subdomain.qualityScore,
        },
      };
    } catch (error) {
      return { success: false, error };
    }
  }
}
