import { ProfileOwner, UserCourse, Course, RankingCriteria, Connection } from '../models.js';
import { Op } from 'sequelize';

class RankingService {
  /**
   * Calculate professional rank for a profile owner
   */
  async calculateProfessionalRank(profileOwnerId) {
    const profile = await ProfileOwner.findByPk(profileOwnerId, {
      include: [
        {
          model: UserCourse,
          include: [Course],
          where: { status: 'completed' }
        }
      ]
    });
    
    if (!profile) {
      throw new Error('Profile owner not found');
    }

    const criteria = await RankingCriteria.findAll({ 
      where: { isActive: true } 
    });
    
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    for (const criterion of criteria) {
      const criterionScore = await this.calculateCriterionScore(profile, criterion);
      totalScore += criterionScore * criterion.weight;
      maxPossibleScore += criterion.weight;
    }
    
    // Normalize to 0-100 scale
    const normalizedScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
    
    // Update profile with new ranking
    const rank = this.scoreToRank(normalizedScore);
    await profile.update({
      rankingScore: normalizedScore,
      professionalRank: rank,
      lastRankingUpdate: new Date()
    });
    
    return { score: normalizedScore, rank };
  }

  /**
   * Recalculate rankings for all profile owners
   */
  async recalculateAllRanks() {
    const profileOwners = await ProfileOwner.findAll();
    
    for (const profileOwner of profileOwners) {
      await this.calculateProfessionalRank(profileOwner.id);
    }
    
    return profileOwners.length;
  }

  /**
   * Recalculate rankings for a specific category
   */
  async recalculateCategoryRankings(category) {
    const profileOwners = await ProfileOwner.findAll({
      where: { serviceCategory: category }
    });
    
    for (const profileOwner of profileOwners) {
      await this.calculateProfessionalRank(profileOwner.id);
    }
    
    return profileOwners.length;
  }

  /**
   * Calculate score for a specific criterion
   */
  async calculateCriterionScore(profile, criterion) {
    switch (criterion.name) {
      case 'course_completion_rate':
        return await this.calculateCourseCompletionScore(profile, criterion);
      
      case 'course_grades':
        return await this.calculateCourseGradesScore(profile, criterion);
      
      case 'experience_level':
        return this.calculateExperienceScore(profile, criterion);
      
      case 'certification_count':
        return this.calculateCertificationScore(profile, criterion);
      
      case 'connection_success_rate':
        return await this.calculateSuccessRateScore(profile, criterion);
      
      case 'response_time':
        return await this.calculateResponseTimeScore(profile, criterion);
      
      default:
        return await this.calculateCustomCriterionScore(profile, criterion);
    }
  }

  /**
   * Calculate course completion score
   */
  async calculateCourseCompletionScore(profile, criterion) {
    const totalCourses = await Course.count({ 
      where: { 
        category: profile.serviceCategory,
        isActive: true 
      } 
    });
    
    const completedCourses = profile.UserCourses.length;
    
    return totalCourses > 0 ? completedCourses / totalCourses : 0;
  }

  /**
   * Calculate course grades score
   */
  async calculateCourseGradesScore(profile, criterion) {
    if (profile.UserCourses.length === 0) return 0;
    
    const averageGrade = profile.UserCourses.reduce((sum, uc) => 
      sum + (uc.finalGrade || 0), 0
    ) / profile.UserCourses.length;
    
    return averageGrade / 100; // Normalize to 0-1
  }

  /**
   * Calculate experience score
   */
  calculateExperienceScore(profile, criterion) {
    const maxExperience = criterion.parameters?.maxExperience || 20;
    return Math.min((profile.experienceYears || 0) / maxExperience, 1);
  }

  /**
   * Calculate certification score
   */
  calculateCertificationScore(profile, criterion) {
    const maxCertifications = criterion.parameters?.maxCertifications || 10;
    const certCount = profile.certificates ? profile.certificates.length : 0;
    return Math.min(certCount / maxCertifications, 1);
  }

  /**
   * Calculate success rate score
   */
  async calculateSuccessRateScore(profile, criterion) {
    const successfulConnections = await Connection.count({
      where: { 
        profileOwnerId: profile.id,
        status: 'successful' 
      }
    });
    
    const totalConnections = await Connection.count({
      where: { profileOwnerId: profile.id }
    });
    
    return totalConnections > 0 ? successfulConnections / totalConnections : 0;
  }

  /**
   * Calculate response time score
   */
  async calculateResponseTimeScore(profile, criterion) {
    const connections = await Connection.findAll({
      where: { 
        profileOwnerId: profile.id,
        profileOwnerCalled: true
      },
      attributes: ['calledAt', 'connectionDate']
    });

    if (connections.length === 0) return 0;

    const avgResponseTime = connections.reduce((sum, connection) => {
      const responseTime = new Date(connection.calledAt) - new Date(connection.connectionDate);
      return sum + responseTime;
    }, 0) / connections.length;

    // Convert to hours and normalize (faster response = higher score)
    const responseTimeHours = avgResponseTime / (1000 * 60 * 60);
    const maxResponseTime = criterion.parameters?.maxResponseTime || 48; // 48 hours
    
    return Math.max(0, 1 - (responseTimeHours / maxResponseTime));
  }

  /**
   * Calculate custom criterion score
   */
  async calculateCustomCriterionScore(profile, criterion) {
    // Implement custom formula evaluation
    try {
      if (criterion.formula) {
        // Simple formula evaluation - in production, use a proper expression evaluator
        return this.evaluateCustomFormula(profile, criterion.formula, criterion.parameters);
      }
      return 0;
    } catch (error) {
      console.error('Custom criterion evaluation failed:', error);
      return 0;
    }
  }

  /**
   * Evaluate custom formula
   */
  evaluateCustomFormula(profile, formula, parameters) {
    // This is a simplified implementation
    // In production, use a proper expression evaluator like math.js
    
    let score = 0;
    
    // Example formula patterns
    if (formula.includes('experience')) {
      score += (profile.experienceYears || 0) * 0.1;
    }
    
    if (formula.includes('courses')) {
      score += (profile.UserCourses?.length || 0) * 0.05;
    }
    
    if (formula.includes('rating')) {
      score += (profile.rankingScore || 0) / 100;
    }
    
    return Math.min(score, 1);
  }

  /**
   * Convert score to rank (1-5 stars)
   */
  scoreToRank(score) {
    if (score >= 90) return 5;
    if (score >= 80) return 4;
    if (score >= 70) return 3;
    if (score >= 60) return 2;
    return 1;
  }

  /**
   * Get ranking statistics
   */
  async getRankingStats() {
    const stats = await ProfileOwner.findAll({
      attributes: [
        'professionalRank',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('rankingScore')), 'avgScore']
      ],
      group: ['professionalRank'],
      order: [['professionalRank', 'ASC']]
    });

    return stats;
  }
}

export default RankingService;