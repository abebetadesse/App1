const mongoose = require('mongoose');
require('dotenv').config();

const createIndexes = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection;
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ role: 1 });
  console.log('Indexes created');
  process.exit();
};
createIndexes().catch(console.error);
