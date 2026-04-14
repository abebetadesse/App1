import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';

async function migrateToUTF8() {
  const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tham_platform',
    logging: msg => logger.info(msg)
  });

  try {
    await sequelize.authenticate();
    logger.info('Connected to database for UTF-8 migration');

    // Convert database to UTF-8
    await sequelize.query(`ALTER DATABASE ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    logger.info('✅ Database charset updated to utf8mb4');

    // Get all tables
    const [tables] = await sequelize.query('SHOW TABLES');
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      logger.info(`Converting table: ${tableName}`);
      
      // Convert table to UTF-8
      await sequelize.query(`ALTER TABLE ${tableName} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      
      // Convert all text-based columns
      const [columns] = await sequelize.query(`SHOW COLUMNS FROM ${tableName}`);
      
      for (const column of columns) {
        const columnName = column.Field;
        const columnType = column.Type.toLowerCase();
        
        if (columnType.includes('char') || columnType.includes('text')) {
          await sequelize.query(`
            ALTER TABLE ${tableName} 
            MODIFY ${columnName} ${column.Type} 
            CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
          `);
        }
      }
      
      logger.info(`✅ Table ${tableName} converted to UTF-8`);
    }

    logger.info('🎉 All tables successfully converted to UTF-8 encoding');
    
  } catch (error) {
    logger.error('❌ UTF-8 migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateToUTF8();
}

export default migrateToUTF8;