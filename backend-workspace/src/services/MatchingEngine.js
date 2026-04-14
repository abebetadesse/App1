// src/services/MatchingEngine.js
import { ProfileOwner, UserCourse, Course } from '../models.js';
import { Op } from 'sequelize';

class MatchingEngine {
  constructor() {
    this.weights = {
      rankingScore: 0.3,
      experience: 0.2,
      price: 0.15,
      availability: 0.15,
      skillsMatch: 0.1,
      courseCompletion: 0.1
    };
  }

  async findBestMatches(searchCriteria, limit = 10) {
    try {
      // Build base query
      const whereClause = this.buildWhereClause(searchCriteria);
      
      // Get all profile owners that match basic criteria
      const profileOwners = await ProfileOwner.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            attributes: ['id', 'email'],
            where: { isActive: true }
          },
          {
            model: UserCourse,
            include: [Course],
            required: false
          }
        ]
      });

      // Calculate scores for each profile
      const scoredProfiles = await Promise.all(
        profileOwners.map(async (profile) => {
          const customScore = await this.calculateMatchScore(profile, searchCriteria);
          const elasticScore = Math.random() * 100; // Placeholder for Elasticsearch score
          const finalScore = (elasticScore * 0.4) + (customScore * 0.6);

          return {
            id: profile.id,
            userId: profile.User.id,
            email: profile.User.email,
            serviceCategory: profile.serviceCategory,
            rankingScore: profile.rankingScore,
            professionalRank: profile.professionalRank,
            hourlyRate: profile.hourlyRate,
            experienceYears: profile.experienceYears,
            skills: profile.skills || [],
            availability: profile.availability,
            location: profile.location,
            isAvailable: profile.isAvailable,
            profileCompletion: profile.profileCompletion,
            matchScore: finalScore,
            elasticScore,
            customScore
          };
        })
      );

      // Sort by final score and return top N
      return scoredProfiles
        .filter(profile => profile.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

    } catch (error) {
      console.error('Find best matches error:', error);
      return [];
    }
  }

  async calculateMatchScore(profile, criteria) {
    let score = 0;
    
    // Ranking score component
    score += (profile.rankingScore / 100) * this.weights.rankingScore;
    
    // Experience match
    const expScore = this.calculateExperienceScore(profile.experienceYears, criteria.minExperience);
    score += expScore * this.weights.experience;
    
    // Price match
    const priceScore = this.calculatePriceScore(profile.hourlyRate, criteria.maxHourlyRate);
    score += priceScore * this.weights.price;
    
    // Availability match
    const availabilityScore = this.calculateAvailabilityScore(profile.availability, criteria.availability);
    score += availabilityScore * this.weights.availability;
    
    // Skills match
    const skillsScore = this.calculateSkillsScore(profile.skills, criteria.skills);
    score += skillsScore * this.weights.skillsMatch;
    
    // Course completion bonus
    const courseScore = this.calculateCourseScore(profile.UserCourses, criteria.requiredCourses);
    score += courseScore * this.weights.courseCompletion;
    
    return Math.min(score, 1);
  }

  calculateExperienceScore(experience, minExperience) {
    if (!minExperience) return 1;
    return Math.min(experience / minExperience, 1);
  }

  calculatePriceScore(price, maxPrice) {
    if (!maxPrice) return 1;
    if (price > maxPrice) return 0;
    return 1 - (price / maxPrice) * 0.5;
  }

  calculateAvailabilityScore(profileAvailability, requiredAvailability) {
    const availabilityRank = {
      'immediate': 4,
      '1_week': 3,
      '2_weeks': 2,
      '1_month': 1
    };
    
    if (!requiredAvailability) return 1;
    return availabilityRank[profileAvailability] >= availabilityRank[requiredAvailability] ? 1 : 0;
  }

  calculateSkillsScore(profileSkills, requiredSkills) {
    if (!requiredSkills || requiredSkills.length === 0) return 1;
    if (!profileSkills || profileSkills.length === 0) return 0;
    
    const intersection = profileSkills.filter(skill => 
      requiredSkills.includes(skill)
    ).length;
    
    const union = new Set([...profileSkills, ...requiredSkills]).size;
    
    return intersection / union;
  }

  calculateCourseScore(userCourses, requiredCourses) {
    if (!requiredCourses || requiredCourses.length === 0) return 1;
    if (!userCourses || userCourses.length === 0) return 0;
    
    const completedCourses = userCourses.filter(uc => 
      uc.status === 'completed'
    ).length;
    
    return Math.min(completedCourses / requiredCourses.length, 1);
  }

  buildWhereClause(criteria) {
    const where = {
      isAvailable: true,
      profileCompletion: { [Op.gte]: 50 } // At least 50% profile completion
    };

    if (criteria.serviceCategory) {
      where.serviceCategory = criteria.serviceCategory;
    }

    if (criteria.minExperience) {
      where.experienceYears = { [Op.gte]: criteria.minExperience };
    }

    if (criteria.maxHourlyRate) {
      where.hourlyRate = { [Op.lte]: criteria.maxHourlyRate };
    }

    if (criteria.availability) {
      where.availability = criteria.availability;
    }

    if (criteria.minProfessionalRank) {
      where.professionalRank = { [Op.gte]: criteria.minProfessionalRank };
    }

    if (criteria.location) {
      where.location = { [Op.like]: `%${criteria.location}%` };
    }

    return where;
  }
}

export default MatchingEngine;