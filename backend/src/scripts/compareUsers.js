/**
 * Compare two users by username (all attributes except passwordHash).
 * Run from backend: node src/scripts/compareUsers.js katsudom jordan_lee
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  const [name1, name2] = process.argv.slice(2);
  if (!name1 || !name2) {
    console.error('Usage: node src/scripts/compareUsers.js <username1> <username2>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const u1 = await User.findOne({ username: name1.toLowerCase() }).select('-passwordHash').lean();
    const u2 = await User.findOne({ username: name2.toLowerCase() }).select('-passwordHash').lean();

    if (!u1) {
      console.error('User not found:', name1);
      process.exit(1);
    }
    if (!u2) {
      console.error('User not found:', name2);
      process.exit(1);
    }

    const keys = [...new Set([...Object.keys(u1), ...Object.keys(u2)])].filter((k) => k !== '__v').sort();
    console.log('Attribute comparison (same schema for both):\n');
    console.log('Attribute          |', name1.padEnd(16), '|', name2);
    console.log('-'.repeat(60));

    const diff = [];
    for (const k of keys) {
      const v1 = u1[k] === undefined ? '(not set)' : JSON.stringify(u1[k]);
      const v2 = u2[k] === undefined ? '(not set)' : JSON.stringify(u2[k]);
      const same = v1 === v2;
      if (!same) diff.push(k);
      const pad = 17 - k.length;
      console.log(k.padEnd(17), '|', v1.slice(0, 18).padEnd(16), '|', v2.slice(0, 18));
    }
    console.log('-'.repeat(60));
    if (diff.length) {
      console.log('Differences:', diff.join(', '));
    } else {
      console.log('No value differences (only _id/createdAt/updatedAt may differ).');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();
