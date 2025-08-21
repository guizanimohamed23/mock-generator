const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartmock';
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  isConnected = true;
  console.log('Connected to MongoDB');
}

module.exports = { connectToDatabase };


