const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');

// Default data
const defaultData = {
  users: [
    { id: 1, email: 'admin@tham.com', name: 'Admin User', role: 'admin', password: 'admin123', createdAt: new Date().toISOString() },
    { id: 2, email: 'client@example.com', name: 'Client User', role: 'client', password: 'client123', createdAt: new Date().toISOString() },
    { id: 3, email: 'profile@example.com', name: 'Profile Owner', role: 'profile_owner', password: 'profile123', createdAt: new Date().toISOString() }
  ],
  profiles: [],
  documents: [],
  connections: [],
  announcements: [],
  badges: [],
  categories: [],
  rankingWeights: {},
  analytics: { stats: { users: 3, profileOwners: 1, clients: 1, admins: 1, connections: 0, revenue: 0 }, growth: [0, 0, 0, 0] }
};

// Read database
function readDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB:', err);
  }
  return JSON.parse(JSON.stringify(defaultData)); // clone
}

// Write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Helper to get collection
function getCollection(name) {
  const db = readDB();
  return db[name];
}

// Helper to update collection
function updateCollection(name, updater) {
  const db = readDB();
  db[name] = updater(db[name]);
  writeDB(db);
  return db[name];
}

// Helper to find one
function findOne(collection, query) {
  const items = getCollection(collection);
  return items.find(item => Object.keys(query).every(key => item[key] === query[key]));
}

// Helper to insert
function insert(collection, item) {
  let newItem = { ...item, id: Date.now() };
  updateCollection(collection, (arr) => [...arr, newItem]);
  return newItem;
}

// Helper to update
function update(collection, query, updates) {
  let updatedItem = null;
  updateCollection(collection, (arr) => {
    const index = arr.findIndex(item => Object.keys(query).every(key => item[key] === query[key]));
    if (index !== -1) {
      updatedItem = { ...arr[index], ...updates };
      arr[index] = updatedItem;
    }
    return arr;
  });
  return updatedItem;
}

// Helper to delete
function remove(collection, query) {
  let deleted = false;
  updateCollection(collection, (arr) => {
    const newArr = arr.filter(item => !Object.keys(query).every(key => item[key] === query[key]));
    deleted = newArr.length !== arr.length;
    return newArr;
  });
  return deleted;
}

module.exports = { readDB, writeDB, getCollection, updateCollection, findOne, insert, update, remove };
