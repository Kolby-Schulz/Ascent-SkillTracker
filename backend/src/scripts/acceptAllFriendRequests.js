/**
 * Accept all pending friend requests for a user by username.
 * Run from backend directory:
 *   cd backend && node src/scripts/acceptAllFriendRequests.js <username>
 * Example: node src/scripts/acceptAllFriendRequests.js katsudom
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Friend = require('../models/Friend');

async function run() {
  const username = process.argv[2];
  if (!username) {
    console.error('Usage: node src/scripts/acceptAllFriendRequests.js <username>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      console.error('User not found:', username);
      process.exit(1);
    }

    const result = await Friend.updateMany(
      { recipient: user._id, status: 'pending' },
      { $set: { status: 'accepted' } }
    );

    console.log('User:', user.username, '(' + user.email + ')');
    console.log('Accepted', result.modifiedCount, 'friend request(s).');
    if (result.matchedCount === 0) {
      console.log('(No pending requests were found.)');
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
