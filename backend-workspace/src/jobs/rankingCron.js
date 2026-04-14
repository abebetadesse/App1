import cron from 'node-cron';
import rankingService from '../services/RankingService.js';
import { logger } from '../utils/logger.js';

class RankingCron {
  start() {
    // Run every day at 2 AM
    cron.schedule('0 2 * * *', async () => {
      try {
        logger.info('Starting scheduled ranking update...');
        await rankingService.updateStaleRanks(24);
        logger.info('Scheduled ranking update completed');
      } catch (error) {
        logger.error('Error in scheduled ranking update:', error);
      }
    });

    // Run every Sunday at 3 AM for full recalculation
    cron.schedule('0 3 * * 0', async () => {
      try {
        logger.info('Starting weekly full ranking recalculation...');
        await rankingService.recalculateAllRanks();
        logger.info('Weekly full ranking recalculation completed');
      } catch (error) {
        logger.error('Error in weekly ranking recalculation:', error);
      }
    });

    logger.info('Ranking cron jobs started');
  }
}

export default new;RankingCron();