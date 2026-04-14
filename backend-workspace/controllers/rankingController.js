import { RankingCriteria, UserCourse, ProfileOwner, Course, sequelize } from '../models';
import { Op } from 'sequelize';
import RankingService from '../services/RankingService.js';

class RankingController {
  /**
   * Get ranking analytics
   */
  async getRankingAnalytics(req, res) {
    try {
      const { period = '30d' } = req.query;
      
      const dateRange = this.getDateRange(period);

      // Overall ranking distribution
      const rankingDistribution = await ProfileOwner.findAll({
        attributes: [
          'professionalRank',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['professionalRank'],
        order: [['professionalRank', 'ASC']]
      });

      // Average ranking score by category
      const categoryRankings = await ProfileOwner.findAll({
        attributes: [
          'serviceCategory',
          [sequelize.fn('AVG', sequelize.col('rankingScore')), 'avgScore'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['serviceCategory'],
        order: [[sequelize.fn('AVG', sequelize.col('rankingScore')), 'DESC']]
      });

      // Top ranked profile owners
      const topRanked = await ProfileOwner.findAll({
        include: [{
          model: sequelize.models.User,
          attributes: ['firstName', 'lastName', 'email']
        }],
        where: {
          professionalRank: { [Op.gte]: 4 } // 4 stars and above
        },
        order: [['rankingScore', 'DESC']],
        limit: 20
      });

      // Course completion impact on ranking
      const courseImpact = await UserCourse.findAll({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('finalGrade')), 'avgGrade'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'courseCount'],
          'status'
        ],
        include: [{
          model: Course,
          attributes: ['category']
        }],
        group: ['Course.category', 'status'],
        where: {
          createdAt: {
            [Op.between]: [dateRange.start, dateRange.end]
          }
        }
      });

      res.json({
        success: true,
        data: {
          rankingDistribution,
          categoryRankings,
          topRanked,
          courseImpact,
          period
        }
      });
    } catch (error) {
      console.error('Ranking analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch ranking analytics'
      });
    }
  }

  /**
   * Get ranking criteria
   */
  async getRankingCriteria(req, res) {
    try {
      const { category = '', isActive = '' } = req.query;

      const whereClause = {};
      if (category) whereClause.category = category;
      if (isActive !== '') whereClause.isActive = isActive === 'true';

      const criteria = await RankingCriteria.findAll({
        where: whereClause,
        order: [['category', 'ASC'], ['weight', 'DESC']]
      });

      // Calculate total weights by category
      const categoryWeights = await RankingCriteria.findAll({
        attributes: [
          'category',
          [sequelize.fn('SUM', sequelize.col('weight')), 'totalWeight']
        ],
        where: { isActive: true },
        group: ['category']
      });

      res.json({
        success: true,
        data: {
          criteria,
          categoryWeights
        }
      });
    } catch (error) {
      console.error('Get ranking criteria error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch ranking criteria'
      });
    }
  }

  /**
   * Create ranking criteria
   */
  async createRankingCriteria(req, res) {
    try {
      const { name, category, weight, formula, parameters, isActive } = req.body;

      // Check if total weight for category would exceed 1
      const existingWeights = await RankingCriteria.sum('weight', {
        where: { 
          category,
          isActive: true 
        }
      });

      if (existingWeights + weight > 1) {
        return res.status(400).json({
          success: false,
          error: `Total weight for category "${category}" would exceed 1. Current total: ${existingWeights}`
        });
      }

      const criteria = await RankingCriteria.create({
        name,
        category,
        weight,
        formula,
        parameters: parameters || {},
        isActive: isActive !== undefined ? isActive : true,
        createdBy: req.user.id
      });

      // Trigger recalculation for affected profile owners
      await this.triggerCategoryRecalculation(category);

      res.status(201).json({
        success: true,
        message: 'Ranking criteria created successfully',
        data: criteria
      });
    } catch (error) {
      console.error('Create ranking criteria error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create ranking criteria'
      });
    }
  }

  /**
   * Update ranking criteria
   */
  async updateRankingCriteria(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const criteria = await RankingCriteria.findByPk(id);
      if (!criteria) {
        return res.status(404).json({
          success: false,
          error: 'Ranking criteria not found'
        });
      }

      // If weight is being updated, check constraints
      if (updates.weight !== undefined) {
        const existingWeights = await RankingCriteria.sum('weight', {
          where: { 
            category: criteria.category,
            isActive: true,
            id: { [Op.ne]: id }
          }
        });

        if (existingWeights + updates.weight > 1) {
          return res.status(400).json({
            success: false,
            error: `Total weight for category "${criteria.category}" would exceed 1. Current total without this criteria: ${existingWeights}`
          });
        }
      }

      await criteria.update(updates);

      // Trigger recalculation if weight or formula changed
      if (updates.weight !== undefined || updates.formula) {
        await this.triggerCategoryRecalculation(criteria.category);
      }

      res.json({
        success: true,
        message: 'Ranking criteria updated successfully',
        data: criteria
      });
    } catch (error) {
      console.error('Update ranking criteria error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update ranking criteria'
      });
    }
  }

  /**
   * Delete ranking criteria
   */
  async deleteRankingCriteria(req, res) {
    try {
      const { id } = req.params;

      const criteria = await RankingCriteria.findByPk(id);
      if (!criteria) {
        return res.status(404).json({
          success: false,
          error: 'Ranking criteria not found'
        });
      }

      const category = criteria.category;
      await criteria.destroy();

      // Trigger recalculation for the category
      await this.triggerCategoryRecalculation(category);

      res.json({
        success: true,
        message: 'Ranking criteria deleted successfully'
      });
    } catch (error) {
      console.error('Delete ranking criteria error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete ranking criteria'
      });
    }
  }

  /**
   * Trigger ranking recalculation
   */
  async triggerRankingRecalculation(req, res) {
    try {
      const { category = null, profileOwnerId = null } = req.body;

      const rankingService = new RankingService();

      let result;
      if (profileOwnerId) {
        // Recalculate for specific profile owner
        result = await rankingService.calculateProfessionalRank(profileOwnerId);
        res.json({
          success: true,
          message: 'Ranking recalculated for profile owner',
          data: result
        });
      } else if (category) {
        // Recalculate for entire category
        const count = await rankingService.recalculateCategoryRankings(category);
        res.json({
          success: true,
          message: `Rankings recalculated for ${count} profile owners in ${category} category`,
          data: { recalculatedCount: count }
        });
      } else {
        // Recalculate all
        const count = await rankingService.recalculateAllRanks();
        res.json({
          success: true,
          message: `All rankings recalculated for ${count} profile owners`,
          data: { recalculatedCount: count }
        });
      }
    } catch (error) {
      console.error('Trigger ranking recalculation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to trigger ranking recalculation'
      });
    }
  }

  /**
   * Helper: Trigger recalculation for a category
   */
  async triggerCategoryRecalculation(category) {
    try {
      const rankingService = new RankingService();
      await rankingService.recalculateCategoryRankings(category);
    } catch (error) {
      console.error('Category recalculation error:', error);
    }
  }

  /**
   * Helper: Get date range for analytics
   */
  getDateRange(period) {
    const now = new Date();
    let startDate;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { start: startDate, end: now };
  }
}

export default new RankingController();