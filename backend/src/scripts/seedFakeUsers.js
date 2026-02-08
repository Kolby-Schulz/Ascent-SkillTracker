/**
 * Seed 3 fake users into the database.
 * Run from backend: node src/scripts/seedFakeUsers.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const FAKE_USERS = [
  { username: 'jordan_lee', email: 'jordan.lee@example.com', passwordHash: 'password123' },
  { username: 'sam-rivera', email: 'sam.rivera@example.com', passwordHash: 'password123' },
  { username: 'alex_chen', email: 'alex.chen@example.com', passwordHash: 'password123' },
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    for (const data of FAKE_USERS) {
      const exists = await User.findOne({
        $or: [{ username: data.username }, { email: data.email }],
      });
      if (exists) {
        console.log('Skip (already exists):', data.username);
        continue;
      }
      const user = await User.create(data);
      console.log('Created:', user.username, user.email);
    }
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();
