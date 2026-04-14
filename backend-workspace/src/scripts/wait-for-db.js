// scripts/wait-for-db.js
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

const waitForDatabase = async (maxAttempts = 30, delay = 2000) => {
  console.log('🔍 Waiting for database to be ready...');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await execAsync('mysqladmin ping -h mysql -u root -p${DB_PASSWORD}');
      console.log('✅ Database is ready!');
      return true;
    } catch (error) {
      console.log(`   Attempt ${attempt}/${maxAttempts}: Database not ready yet...`);
      
      if (attempt === maxAttempts) {
        console.error('💥 Database failed to become ready in time');
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

if (require.main === module) {
  waitForDatabase().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export default waitForDatabase;