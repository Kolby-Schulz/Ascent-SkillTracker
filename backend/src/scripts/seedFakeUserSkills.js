/**
 * Seed UserSkillProgress so fake users appear as "also learning" on skill cards.
 * Run from backend: node src/scripts/seedFakeUserSkills.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const UserSkillProgress = require('../models/UserSkillProgress');

const SKILL_NAMES = ['Guitar', 'Web Development', 'Photography'];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const fakeUsers = await User.find({
      username: { $in: ['jordan_lee', 'sam-rivera', 'alex_chen'] },
    });
    for (const user of fakeUsers) {
      for (const skillName of SKILL_NAMES) {
        await UserSkillProgress.findOneAndUpdate(
          { userId: user._id, skillName },
          { status: 'in_progress' },
          { new: true, upsert: true }
        );
      }
      console.log('Skills set for:', user.username);
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
