/**
 * Generate a JWT for a user by username (for logging in as that user in the app).
 * Run from backend directory:
 *   cd backend && node src/scripts/loginAsUser.js <username>
 *
 * Prints the token and user info. To use in the browser:
 *   1. Open DevTools (F12) -> Application (or Storage) -> Local Storage -> your origin
 *   2. Set key "token" to the printed token value
 *   3. Set key "user" to the printed user JSON (optional; app may refetch)
 *   4. Refresh the page
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

async function run() {
  const username = process.argv[2];
  if (!username) {
    console.error('Usage: node src/scripts/loginAsUser.js <username>');
    console.error('Example: node src/scripts/loginAsUser.js katsudom');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ username: username.toLowerCase().trim() }).select(
      'username email roles privacy bio profilePicture'
    );
    if (!user) {
      console.error('User not found:', username);
      process.exit(1);
    }

    const token = generateToken(user._id);
    const userPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      privacy: user.privacy,
      bio: user.bio,
      profilePicture: user.profilePicture,
    };

    console.log('--- Log in as:', user.username, '---');
    console.log('');
    console.log('Token (copy to localStorage key "token"):');
    console.log(token);
    console.log('');
    console.log('User (copy to localStorage key "user"):');
    console.log(JSON.stringify(userPayload));
    console.log('');
    console.log('Browser: DevTools -> Application -> Local Storage -> set BOTH "token" and "user" to the values above, then refresh.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();
