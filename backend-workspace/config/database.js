import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Enhanced database configuration with retry logic
const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'tham_platform',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  dialectOptions: {
    decimalNumbers: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    connectTimeout: 60000
  },
  retry: {
    max: 5,
    timeout: 60000,
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /ER_ACCESS_DENIED_ERROR/,
      /SequelizeConnectionError/
    ],
    backoffBase: 1000,
    backoffExponent: 1.5
  }
};

// Create Sequelize instance with enhanced error handling
const sequelize = new Sequelize(
  process.env.DB_NAME || 'tham_platform',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Enhanced connection function with detailed diagnostics
export const connectDatabase = async (maxRetries = 10) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      console.log(`🔌 Attempting MySQL connection (attempt ${retries + 1}/${maxRetries})...`);
      console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
      console.log(`   Database: ${dbConfig.database}`);
      console.log(`   Username: ${dbConfig.username}`);
      console.log(`   Using password: ${dbConfig.password ? 'YES' : 'NO'}`);
      
      await sequelize.authenticate();
      console.log('✅ MySQL Database connected successfully');
      
      // Sync database models with safe options
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true, force: false });
        console.log('✅ Database models synchronized');
      }
      
      return true;
    } catch (error) {
      retries++;
      console.error(`❌ MySQL Database connection failed (attempt ${retries}):`, error.message);
      
      // Provide specific troubleshooting guidance
      if (error.original) {
        switch (error.original.code) {
          case 'ER_ACCESS_DENIED_ERROR':
            console.error('💡 Solution: MySQL authentication failed');
            console.error('   Expected: User "root" with empty password or password set in .env');
            console.error('   Check: Docker Compose MySQL configuration and .env file');
            break;
          case 'ECONNREFUSED':
            console.error('💡 Solution: MySQL service not running or wrong host/port');
            console.error('   Run: docker-compose ps mysql');
            console.error('   Check: Is MySQL container running and healthy?');
            break;
          case 'ER_BAD_DB_ERROR':
            console.error('💡 Solution: Database does not exist');
            console.error('   Run: docker-compose exec mysql mysql -u root -e "CREATE DATABASE IF NOT EXISTS tham_platform;"');
            break;
          case 'ETIMEDOUT':
            console.error('💡 Solution: Connection timeout');
            console.error('   Check: Network connectivity between backend and MySQL containers');
            break;
          default:
            console.error('💡 General Solution: Check MySQL container logs');
            console.error('   Run: docker-compose logs mysql --tail=20');
        }
      }
      
      if (retries < maxRetries) {
        const delay = Math.min(5000 * retries, 30000);
        console.log(`🔄 Retrying connection in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed to connect to MySQL after ${maxRetries} attempts`);
};

// Alternative: Direct connection test
export const testDirectConnection = async () => {
  try {
    const mysql = await import('mysql2/promise');
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      connectTimeout: 10000
    });
    
    console.log('✅ Direct MySQL connection successful');
    
    // Show databases
    const [rows] = await connection.execute('SHOW DATABASES');
    console.log('📊 Available databases:', rows.map(row => row.Database).join(', '));
    
    // Show users
    const [users] = await connection.execute("SELECT user, host FROM mysql.user WHERE user LIKE '%root%'");
    console.log('👥 MySQL root users:', users.map(u => `${u.user}@${u.host}`).join(', '));
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Direct MySQL connection failed:', error.message);
    return false;
  }
};

export { sequelize };