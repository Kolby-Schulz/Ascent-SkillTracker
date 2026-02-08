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
const { execSync } = require('child_process');
const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

function openBrowser(url) {
  const quoted = `"${url.replace(/"/g, '\\"')}"`;
  try {
    if (process.platform === 'win32') {
      execSync(`start "" ${quoted}`, { shell: true, stdio: 'ignore' });
    } else if (process.platform === 'darwin') {
      execSync(`open ${quoted}`, { stdio: 'ignore' });
    } else {
      execSync(`xdg-open ${quoted}`, { stdio: 'ignore' });
    }
  } catch (e) {
    console.error('Could not open browser:', e.message);
  }
}

async function run() {
  const args = process.argv.slice(2).filter((a) => a !== '--open');
  const openBrowserFlag = process.argv.includes('--open');
  const username = args[0];
  if (!username) {
    console.error('Usage: node src/scripts/loginAsUser.js <username> [--open]');
    console.error('Example: node src/scripts/loginAsUser.js katsudom');
    console.error('         node src/scripts/loginAsUser.js katsudom --open   (open browser and log in)');
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

    if (openBrowserFlag) {
      const hash = `token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userPayload))}`;
      const url = `${FRONTEND_URL}/dev-login#${hash}`;
      console.log('Opening browser to log in…');
      openBrowser(url);
      console.log('If the app is running at', FRONTEND_URL + ', you should be logged in.');
    } else {
      console.log('');
      console.log('1) Token - copy the ONE line below (ignore line wraps) into localStorage key "token":');
      console.log('---BEGIN TOKEN---');
      console.log(token);
      console.log('---END TOKEN---');
      console.log('');
      console.log('2) User - copy the ONE line below (ignore line wraps) into localStorage key "user":');
      console.log('---BEGIN USER---');
      console.log(JSON.stringify(userPayload));
      console.log('---END USER---');
      console.log('');
      console.log('Or run with --open to open the browser and log in automatically:');
      console.log('  node src/scripts/loginAsUser.js', user.username, '--open');
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
