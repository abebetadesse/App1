class RankingService {
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
    const normalizedScore = (totalScore / maxPossibleScore) * 100;
    
    // Update profile with new ranking
    const rank = this.scoreToRank(normalizedScore);
    await profile.update({
      rankingScore: normalizedScore,
      professionalRank: rank,
      lastRankingUpdate: new Date()
    });
    
    return { score: normalizedScore, rank };
  }

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
      
      default:
        return await this.calculateCustomCriterionScore(profile, criterion);
    }
  }

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

  async calculateCourseGradesScore(profile, criterion) {
    if (profile.UserCourses.length === 0) return 0;
    
    const averageGrade = profile.UserCourses.reduce((sum, uc) => 
      sum + (uc.finalGrade || 0), 0
    ) / profile.UserCourses.length;
    
    return averageGrade / 100; // Normalize to 0-1
  }

  calculateExperienceScore(profile, criterion) {
    const maxExperience = criterion.parameters?.maxExperience || 20;
    return Math.min(profile.experienceYears / maxExperience, 1);
  }

  calculateCertificationScore(profile, criterion) {
    const maxCertifications = criterion.parameters?.maxCertifications || 10;
    const certCount = profile.certificates ? profile.certificates.length : 0;
    return Math.min(certCount / maxCertifications, 1);
  }

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

  scoreToRank(score) {
    // Convert 0-100 score to 1-5 star ranking
    if (score >= 90) return 5;
    if (score >= 80) return 4;
    if (score >= 70) return 3;
    if (score >= 60) return 2;
    return 1;
  }

  async recalculateAllRanks() {
    const profileOwners = await ProfileOwner.findAll();
    
    for (const profileOwner of profileOwners) {
      await this.calculateProfessionalRank(profileOwner.id);
    }
    
    return profileOwners.length;
  }
}