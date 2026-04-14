import { RankingCriteria } from '../models.js';
import { logger } from '../utils/logger.js';

class RankingCriteriaService {
  /**
   * Get all ranking criteria
   */
  async getAllCriteria(options = {}) {
    const where = { isActive: true };
    
    if (options.includeInactive) {
      delete where.isActive;
    }

    return await RankingCriteria.findAll({
      where,
      order: [['weight', 'DESC']]
    });
  }

  /**
   * Create new ranking criterion
   */
  async createCriterion(criterionData, createdBy) {
    try {
      const criterion = await RankingCriteria.create({
        ...criterionData,
        createdBy
      });

      logger.info(`Created new ranking criterion: ${criterion.name}`);
      return criterion;

    } catch (error) {
      logger.error('Error creating ranking criterion:', error);
      throw error;
    }
  }

  /**
   * Update ranking criterion
   */
  async updateCriterion(criterionId, updates) {
    try {
      const criterion = await RankingCriteria.findByPk(criterionId);
      
      if (!criterion) {
        throw new Error(`Ranking criterion ${criterionId} not found`);
      }

      await criterion.update(updates);
      logger.info(`Updated ranking criterion: ${criterion.name}`);

      return criterion;

    } catch (error) {
      logger.error(`Error updating ranking criterion ${criterionId}:`, error);
      throw error;
    }
  }

  /**
   * Delete ranking criterion (soft delete)
   */
  async deleteCriterion(criterionId) {
    try {
      const criterion = await RankingCriteria.findByPk(criterionId);
      
      if (!criterion) {
        throw new Error(`Ranking criterion ${criterionId} not found`);
      }

      await criterion.update({ isActive: false });
      logger.info(`Deleted ranking criterion: ${criterion.name}`);

      return { message: 'Criterion deleted successfully' };

    } catch (error) {
      logger.error(`Error deleting ranking criterion ${criterionId}:`, error);
      throw error;
    }
  }

  /**
   * Validate criterion formula
   */
  validateCriterionFormula(formula) {
    // Basic validation - in production, use a proper expression validator
    const allowedVariables = ['experience', 'courses', 'successRate', 'responseTime', 'certifications'];
    
    try {
      // Test evaluation with dummy values
      const testFormula = formula
        .replace(/{experience}/g, '1')
        .replace(/{courses}/g, '1')
        .replace(/{successRate}/g, '1')
        .replace(/{responseTime}/g, '1')
        .replace(/{certifications}/g, '1');

      // Simple check - in production, use a safe evaluator
      const result = eval(`(${testFormula})`);
      
      if (typeof result !== 'number' || isNaN(result)) {
        return { valid: false, error: 'Formula must evaluate to a number' };
      }

      return { valid: true };

    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Test criterion with sample data
   */
  async testCriterion(criterionId, sampleData) {
    try {
      const criterion = await RankingCriteria.findByPk(criterionId);
      
      if (!criterion) {
        throw new Error(`Ranking criterion ${criterionId} not found`);
      }

      import rankingService from './RankingService.js';
      const sampleProfileOwner = {
        experienceYears: sampleData.experience || 0,
        certificates: sampleData.certifications ? Array(sampleData.certifications).fill('cert') : [],
        UserCourses: sampleData.courses ? Array(sampleData.courses).fill({ finalGrade: sampleData.averageGrade || 80 }) : []
      };

      const score = await rankingService.calculateCustomCriterionScore(
        sampleProfileOwner, 
        criterion
      );

      return {
        criterion: criterion.name,
        sampleData,
        calculatedScore: score,
        weightedScore: score * criterion.weight
      };

    } catch (error) {
      logger.error(`Error testing criterion ${criterionId}:`, error);
      throw error;
    }
  }
}

export default new;RankingCriteriaService();