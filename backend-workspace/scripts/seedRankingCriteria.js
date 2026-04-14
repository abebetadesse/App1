import { RankingCriteria } from '../models.js';
import { logger } from '../utils/logger.js';

const defaultCriteria = [
  {
    name: 'course_performance',
    category: 'academic',
    weight: 0.35,
    description: 'Average grade in completed courses',
    formula: null,
    parameters: null,
    isActive: true
  },
  {
    name: 'course_completion_rate',
    category: 'academic',
    weight: 0.25,
    description: 'Percentage of available courses completed in service category',
    formula: null,
    parameters: null,
    isActive: true
  },
  {
    name: 'experience_level',
    category: 'professional',
    weight: 0.15,
    description: 'Years of professional experience',
    formula: null,
    parameters: { maxExperience: 20 },
    isActive: true
  },
  {
    name: 'certification_count',
    category: 'professional',
    weight: 0.10,
    description: 'Number of professional certifications',
    formula: null,
    parameters: { maxCertifications: 10 },
    isActive: true
  },
  {
    name: 'success_rate',
    category: 'performance',
    weight: 0.10,
    description: 'Percentage of successful client connections',
    formula: null,
    parameters: null,
    isActive: true
  },
  {
    name: 'response_time',
    category: 'performance',
    weight: 0.05,
    description: 'Average response time to client connections',
    formula: null,
    parameters: null,
    isActive: true
  }
];

async function seedRankingCriteria() {
  try {
    logger.info('Seeding ranking criteria...');

    for (const criterionData of defaultCriteria) {
      const existing = await RankingCriteria.findOne({
        where: { name: criterionData.name }
      });

      if (!existing) {
        await RankingCriteria.create(criterionData);
        logger.info(`Created ranking criterion: ${criterionData.name}`);
      }
    }

    logger.info('Ranking criteria seeding completed');
  } catch (error) {
    logger.error('Error seeding ranking criteria:', error);
    throw error;
  }
}

export {
seedRankingCriteria, defaultCriteria
};