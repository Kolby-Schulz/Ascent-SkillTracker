/**
 * One-off script: list all users in the database (username, email).
 * Run from backend: node src/scripts/listUsers.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}).select('username email').lean();
    console.log('Total users:', users.length);
    console.log('---');
    users.forEach((u, i) => console.log(`${i + 1}. ${u.username} (${u.email})`));
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();
