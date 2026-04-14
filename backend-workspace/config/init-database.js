import { initializeDatabase, syncDatabase } from './database.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  console.log('🚀 Initializing Tham Platform Database...');
  
  try {
    // 1. Initialize database (create if doesn't exist)
    const initResult = await initializeDatabase();
    if (!initResult.success) {
      console.error('❌ Database initialization failed:', initResult.message);
      process.exit(1);
    }
    
    console.log('✅ Database initialized successfully');
    
    // 2. Sync database models (create tables)
    console.log('🔄 Syncing database models...');
    const syncResult = await syncDatabase(false); // Don't force in production
    if (!syncResult.success) {
      console.error('❌ Database sync failed:', syncResult.message);
      process.exit(1);
    }
    
    console.log('✅ Database models synchronized');
    console.log('🎉 Database setup complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
})();