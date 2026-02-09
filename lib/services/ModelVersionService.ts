import AiModelVersion from '@/lib/models/AiModelVersion';
import { Types } from 'mongoose';

/**
 * Servicio para versionado y gestión de modelos de IA
 */
export class ModelVersionService {
  /**
   * Crear versión de modelo
   */
  static async createModelVersion(data: {
    versionNumber: string;
    name?: string;
    description?: string;
    domains: Types.ObjectId[] | string[];
    trainingStats?: any;
    parameters?: any;
    trainedBy: string;
  }) {
    try {
      const modelVersion = await AiModelVersion.create({
        ...data,
        status: 'development',
      });

      return { success: true, modelVersion };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener versión de modelo
   */
  static async getModelVersion(versionNumber: string) {
    try {
      const modelVersion = await AiModelVersion.findOne({
        versionNumber,
      })
        .populate('domains')
        .exec();

      return modelVersion;
    } catch (error) {
      console.error('Error getting model version:', error);
      return null;
    }
  }

  /**
   * Listar todas las versiones
   */
  static async listModelVersions(filters?: { status?: string; limit?: number }) {
    try {
      const query: any = {};
      if (filters?.status) query.status = filters.status;

      const versions = await AiModelVersion.find(query)
        .sort({ releaseDate: -1 })
        .limit(filters?.limit || 50)
        .populate('domains')
        .exec();

      return versions;
    } catch (error) {
      console.error('Error listing model versions:', error);
      return [];
    }
  }

  /**
   * Obtener versión estable actual
   */
  static async getStableVersion() {
    try {
      const stableVersion = await AiModelVersion.findOne({ status: 'stable' })
        .sort({ releaseDate: -1 })
        .populate('domains')
        .exec();

      return stableVersion;
    } catch (error) {
      console.error('Error getting stable version:', error);
      return null;
    }
  }

  /**
   * Actualizar estado de versión
   */
  static async updateVersionStatus(
    versionNumber: string,
    status: 'development' | 'beta' | 'stable' | 'deprecated' | 'retired'
  ) {
    try {
      const modelVersion = await AiModelVersion.findOneAndUpdate(
        { versionNumber },
        { status },
        { new: true }
      );

      return { success: true, modelVersion };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Registrar resultados de rendimiento
   */
  static async updatePerformanceMetrics(
    versionNumber: string,
    metrics: {
      accuracy: number;
      precision?: number;
      recall?: number;
      f1Score?: number;
    }
  ) {
    try {
      const modelVersion = await AiModelVersion.findOneAndUpdate(
        { versionNumber },
        {
          'performance.accuracy': metrics.accuracy,
          'performance.precision': metrics.precision,
          'performance.recall': metrics.recall,
          'performance.f1Score': metrics.f1Score,
        },
        { new: true }
      );

      return { success: true, modelVersion };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Registrar estadísticas de inferencia
   */
  static async updateInferenceStats(
    versionNumber: string,
    stats: {
      averageLatencyMs: number;
      tokensPerSecond: number;
      memoryRequiredGb: number;
    }
  ) {
    try {
      const modelVersion = await AiModelVersion.findOneAndUpdate(
        { versionNumber },
        {
          'inference.averageLatencyMs': stats.averageLatencyMs,
          'inference.tokensPerSecond': stats.tokensPerSecond,
          'inference.memoryRequiredGb': stats.memoryRequiredGb,
        },
        { new: true }
      );

      return { success: true, modelVersion };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Promover versión a estable
   */
  static async promoteToStable(versionNumber: string) {
    try {
      // Desmarcar versión estable anterior
      await AiModelVersion.findOneAndUpdate(
        { status: 'stable' },
        { status: 'deprecated' }
      );

      // Marcar como estable
      const modelVersion = await AiModelVersion.findOneAndUpdate(
        { versionNumber },
        {
          status: 'stable',
          releaseDate: new Date(),
        },
        { new: true }
      );

      return { success: true, modelVersion };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Registrar feedback y monitoring
   */
  static async recordMonitoring(
    versionNumber: string,
    monitoring: {
      driftScore?: number;
      incidentsReported?: number;
      averageUserSatisfaction?: number;
    }
  ) {
    try {
      const modelVersion = await AiModelVersion.findOneAndUpdate(
        { versionNumber },
        {
          'monitoring.driftScore': monitoring.driftScore,
          'monitoring.incidentsReported': monitoring.incidentsReported,
          'monitoring.averageUserSatisfaction': monitoring.averageUserSatisfaction,
          'monitoring.lastMonitoredDate': new Date(),
        },
        { new: true }
      );

      return { success: true, modelVersion };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener compatibilidad entre versiones
   */
  static async getCompatibility(
    fromVersion: string,
    toVersion: string
  ) {
    try {
      const from = await AiModelVersion.findOne({ versionNumber: fromVersion });
      const to = await AiModelVersion.findOne({ versionNumber: toVersion });

      if (!from || !to) {
        return { success: false, error: 'Version not found' };
      }

      const compatibility = {
        breakingChanges: to.compatibility?.breakingChanges || false,
        breakingChangesList: to.compatibility?.breakingChangesList || [],
        rollbackSupported: from.compatibility?.rollbackSupported || false,
      };

      return { success: true, compatibility };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener historial de versiones
   */
  static async getVersionHistory(limit: number = 20) {
    try {
      const versions = await AiModelVersion.find()
        .sort({ releaseDate: -1 })
        .limit(limit)
        .select('versionNumber name status releaseDate performance');

      return { success: true, versions };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Obtener estadísticas generales de modelos
   */
  static async getModelStats() {
    try {
      const total = await AiModelVersion.countDocuments();
      const stable = await AiModelVersion.countDocuments({ status: 'stable' });
      const beta = await AiModelVersion.countDocuments({ status: 'beta' });
      const development = await AiModelVersion.countDocuments({
        status: 'development',
      });

      const avgAccuracy = await AiModelVersion.aggregate([
        {
          $group: {
            _id: null,
            avgAccuracy: { $avg: '$performance.accuracy' },
            avgLatency: { $avg: '$inference.averageLatencyMs' },
          },
        },
      ]);

      return {
        success: true,
        stats: {
          total,
          stable,
          beta,
          development,
          avgAccuracy: avgAccuracy[0]?.avgAccuracy || 0,
          avgLatency: avgAccuracy[0]?.avgLatency || 0,
        },
      };
    } catch (error) {
      return { success: false, error };
    }
  }
}
