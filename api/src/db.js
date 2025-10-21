const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || undefined;

mongoose.set('strictQuery', true);

async function connect() {
  const conn = await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB_NAME,
    autoIndex: true,
  });
  return conn;
}

async function disconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoose,
  connect,
  disconnect,
};
