const mongoose = require('mongoose');
require('dotenv').config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection;
  
  // User indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ role: 1 });
  
  // Job indexes
  await db.collection('jobs').createIndex({ clientId: 1 });
  await db.collection('jobs').createIndex({ status: 1, createdAt: -1 });
  await db.collection('jobs').createIndex({ category: 1 });
  await db.collection('jobs').createIndex({ skill: 1 });
  await db.collection('jobs').createIndex({ budget: 1 });
  
  // Proposal indexes
  await db.collection('proposals').createIndex({ jobId: 1 });
  await db.collection('proposals').createIndex({ freelancerId: 1 });
  
  console.log('✅ Database indexes created');
  process.exit();
};
run().catch(err => console.error(err));
