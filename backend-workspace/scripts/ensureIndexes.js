const db = require('../config/database');

(async () => {
  await db.query(`CREATE INDEX IF NOT EXISTS idx_jobs_category ON job_posts USING GIST (category_path);`);
  await db.query(`CREATE INDEX IF NOT EXISTS idx_profiles_success ON freelancer_profiles (success_score);`);
  console.log('Indexes ensured.');
  process.exit(0);
})();
