const { Op } = require('sequelize');
class MatchingEngine {
  async findTopMatches(filters, limit = 10) {
    const where = { isAvailable: true };
    if (filters.serviceCategory) where.serviceCategory = filters.serviceCategory;
    if (filters.minExperience) where.experienceYears = { [Op.gte]: filters.minExperience };
    if (filters.maxHourlyRate) where.hourlyRate = { [Op.lte]: filters.maxHourlyRate };
    
    const profiles = await ProfileOwner.findAll({
      where,
      include: [{ model: User, attributes: ['email'] }],
      order: [['rankingScore', 'DESC']],
      limit
    });
    return profiles.map(p => ({ ...p.toJSON(), matchScore: this.calculateMatchScore(p, filters) }));
  }
  calculateMatchScore(profile, filters) {
    let score = profile.rankingScore || 0;
    if (filters.serviceCategory && profile.serviceCategory === filters.serviceCategory) score += 20;
    return Math.min(score, 100);
  }
}
module.exports = new MatchingEngine();
