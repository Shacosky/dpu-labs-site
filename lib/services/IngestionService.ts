import AiKnowledgeIngestion from '@/lib/models/AiKnowledgeIngestion';
import AiKnowledgeNode from '@/lib/models/AiKnowledgeNode';
import AiKnowledgeSubdomain from '@/lib/models/AiKnowledgeSubdomain';
import AiKnowledgeDomain from '@/lib/models/AiKnowledgeDomain';
import { NodeService } from './NodeService';
import { SubdomainService } from './SubdomainService';
import { Types } from 'mongoose';

/**
 * Servicio para ingesta incremental de conocimiento
 */
export class IngestionService {
  /**
   * Crear registro de ingesta
   */
  static async createIngestionRecord(data: {
    domainId: Types.ObjectId | string;
    subdomainId?: Types.ObjectId | string;
    ingestionType: 'manual' | 'bulk_upload' | 'api' | 'web_scraping' | 'database_sync' | 'import';
    source?: any;
    executedBy: string;
  }) {
    try {
      const ingestion = await AiKnowledgeIngestion.create({
        ...data,
        nodeIds: [],
        status: 'pending',
        nodesProcessed: {
          total: 0,
          successful: 0,
          failed: 0,
          skipped: 0,
        },
        duration: {
          startTime: new Date(),
        },
      });

      return { success: true, ingestion };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Procesar lote de nodos (ingesta incremental)
   */
  static async processBatch(
    ingestionId: Types.ObjectId | string,
    nodes: Array<{
      subdomainId: Types.ObjectId | string;
      category: string;
      title: string;
      content: string;
      summary: string;
      keywords?: string[];
      examples?: string[];
      source?: any;
    }>,
    executedBy: string
  ) {
    try {
      const ingestion = await AiKnowledgeIngestion.findById(ingestionId);
      if (!ingestion) {
        return { success: false, error: 'Ingestion record not found' };
      }

      if (ingestion.status !== 'in_progress' && ingestion.status !== 'pending') {
        ingestion.status = 'in_progress';
      }

      const results = {
        successful: 0,
        failed: 0,
        skipped: 0,
        nodeIds: [] as Types.ObjectId[],
        errors: [] as string[],
      };

      // Procesar cada nodo
      for (const nodeData of nodes) {
        try {
          // Validar duplicados por título + subdomain
          const existing = await AiKnowledgeNode.findOne({
            title: nodeData.title,
            subdomainId: nodeData.subdomainId,
          });

          if (existing) {
            results.skipped++;
            results.errors.push(`Nodo duplicado: ${nodeData.title}`);
            continue;
          }

          // Crear nodo
          const nodeResult = await NodeService.createNode({
            ...nodeData,
            createdBy: executedBy,
          });

          if (nodeResult.success) {
            results.successful++;
            results.nodeIds.push((nodeResult.node as any)._id);
          } else {
            results.failed++;
            results.errors.push(`Error al crear nodo: ${nodeData.title}`);
          }
        } catch (nodeError) {
          results.failed++;
          results.errors.push(`Excepción: ${(nodeError as any).message}`);
        }
      }

      // Actualizar registro de ingesta
      ingestion.nodeIds = [...ingestion.nodeIds, ...results.nodeIds];
      ingestion.nodesProcessed.total += nodes.length;
      ingestion.nodesProcessed.successful += results.successful;
      ingestion.nodesProcessed.failed += results.failed;
      ingestion.nodesProcessed.skipped += results.skipped;

      ingestion.logs.push({
        timestamp: new Date(),
        level: 'info',
        message: `Procesado lote de ${nodes.length} nodos`,
        details: results,
      });

      await ingestion.save();

      return {
        success: true,
        results,
        ingestionId,
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Completar ingesta
   */
  static async completeIngestion(ingestionId: Types.ObjectId | string) {
    try {
      const ingestion = await AiKnowledgeIngestion.findById(ingestionId);
      if (!ingestion) {
        return { success: false, error: 'Ingestion record not found' };
      }

      ingestion.status = 'completed';
      ingestion.duration.endTime = new Date();
      if (ingestion.duration.startTime) {
        ingestion.duration.durationSeconds = Math.round(
          (ingestion.duration.endTime.getTime() -
            ingestion.duration.startTime.getTime()) /
            1000
        );
      }

      // Calcular métricas
      const domain = await AiKnowledgeDomain.findById(ingestion.domainId);
      if (domain) {
        ingestion.metrics.afterIngestion = {
          totalNodes: domain.totalNodes || 0,
          qualityScore: domain.qualityScore || 0,
        };
        ingestion.metrics.deltaNodes =
          (ingestion.metrics.afterIngestion.totalNodes || 0) -
          (ingestion.metrics.beforeIngestion?.totalNodes || 0);
      }

      // Registrar en log
      ingestion.logs.push({
        timestamp: new Date(),
        level: 'info',
        message: `Ingesta completada. Nodos procesados: ${ingestion.nodesProcessed.successful} exitosos, ${ingestion.nodesProcessed.failed} fallidos, ${ingestion.nodesProcessed.skipped} saltados`,
        details: ingestion.nodesProcessed,
      });

      // Evaluar impacto en modelo
      if (
        ingestion.nodesProcessed.successful > 50 ||
        (ingestion.metrics.deltaNodes || 0) > 50
      ) {
        ingestion.modelImpact = {
          requiresRetraining: true,
          estimatedImpact: 'high',
        };
      }

      await ingestion.save();

      // Actualizar counters en subdominios
      if (ingestion.subdomainId) {
        await SubdomainService.countNodes(ingestion.subdomainId);
      }

      return { success: true, ingestion };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Fallar ingesta
   */
  static async failIngestion(
    ingestionId: Types.ObjectId | string,
    errorMessage: string
  ) {
    try {
      const ingestion = await AiKnowledgeIngestion.findByIdAndUpdate(
        ingestionId,
        {
          status: 'failed',
          'duration.endTime': new Date(),
          $push: {
            logs: {
              timestamp: new Date(),
              level: 'error',
              message: errorMessage,
            },
          },
        },
        { new: true }
      );

      return { success: true, ingestion };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener historial de ingestas por dominio
   */
  static async getIngestionHistory(
    domainId: Types.ObjectId | string,
    limit: number = 10
  ) {
    try {
      const ingestiones = await AiKnowledgeIngestion.find({ domainId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      return { success: true, ingestiones };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener estadísticas de ingesta
   */
  static async getIngestionStats(domainId: Types.ObjectId | string) {
    try {
      const total = await AiKnowledgeIngestion.countDocuments({ domainId });
      const completed = await AiKnowledgeIngestion.countDocuments({
        domainId,
        status: 'completed',
      });
      const failed = await AiKnowledgeIngestion.countDocuments({
        domainId,
        status: 'failed',
      });

      const byType = await AiKnowledgeIngestion.aggregate([
        { $match: { domainId: new Types.ObjectId(domainId as string) } },
        {
          $group: {
            _id: '$ingestionType',
            count: { $sum: 1 },
          },
        },
      ]);

      const totalNodesIngested = await AiKnowledgeIngestion.aggregate([
        { $match: { domainId: new Types.ObjectId(domainId as string) } },
        {
          $group: {
            _id: null,
            total: { $sum: '$nodesProcessed.successful' },
          },
        },
      ]);

      return {
        success: true,
        stats: {
          total,
          completed,
          failed,
          successRate: total > 0 ? ((completed / total) * 100).toFixed(2) : 0,
          byType,
          totalNodesIngested: totalNodesIngested[0]?.total || 0,
        },
      };
    } catch (error) {
      return { success: false, error };
    }
  }
}
