// src/models/sync.js
import sequelize from '../config/database.js';
import models from './index.cjs';

const syncDatabase = async (force = false) => {
  try {
    console.log('🔄 Starting database synchronization...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Sync all models
    await sequelize.sync({ 
      force: force, // WARNING: This drops all tables if true
      alter: process.env.NODE_ENV === 'development' // Auto-alter tables in development
    });
    
    console.log('✅ Database synchronized successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
};

// Export the function
export {
syncDatabase
};