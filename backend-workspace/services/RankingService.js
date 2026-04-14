const { ProfileOwner, UserCourse, Course, RankingCriteria } = require('../models');
class RankingService {
  async calculateRanking(profileOwnerId) {
    const criteria = await RankingCriteria.findAll({ where: { isActive: true } });
    const userCourses = await UserCourse.findAll({ where: { userId: profileOwnerId }, include: [Course] });
    let score = 0;
    for (const c of criteria) {
      if (c.category === 'education') {
        const completed = userCourses.filter(uc => uc.completedAt).length;
        score += completed * c.weight;
      }
    }
    await ProfileOwner.update({ rankingScore: score }, { where: { id: profileOwnerId } });
    return score;
  }
}
module.exports = new RankingService();
