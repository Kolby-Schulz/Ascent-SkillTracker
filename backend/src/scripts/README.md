# Backend Scripts Documentation

This directory contains utility scripts for managing the database, seeding data, and testing the application.

## Prerequisites

All scripts require:
- Node.js installed
- MongoDB connection configured in `.env` file
- Dependencies installed (`npm install` in the `backend` directory)

**Important:** Always run scripts from the `backend` directory:
```bash
cd backend
```

---

## Seed Scripts

### 1. `seedSkillTracks.js` - Seed Pre-loaded Skill Tracks

**Purpose:** Populates the database with pre-defined skill tracks/roadmaps that appear in the "Learn Skill" section.

**Usage:**
```bash
npm run seed
```
or
```bash
node src/scripts/seedSkillTracks.js
```

**What it does:**
- Creates a demo user (`demo_creator`) if it doesn't exist
- Seeds skill tracks from `backend/src/data/skillTracksSeed.json`
- Only creates roadmaps that don't already exist (idempotent)
- All roadmaps are published and public, visible to all users

**When to use:**
- Initial database setup
- Adding new skill tracks to the demo
- Resetting demo data

**Note:** This is the main script your teammates should run to get pre-loaded skill lists!

---

### 2. `seedFakeUsers.js` - Create Fake Users for Testing

**Purpose:** Creates 3 fake user accounts for testing friend features and social interactions.

**Usage:**
```bash
node src/scripts/seedFakeUsers.js
```

**What it does:**
- Creates 3 users:
  - `jordan_lee` (jordan.lee@example.com)
  - `sam-rivera` (sam.rivera@example.com)
  - `alex_chen` (alex.chen@example.com)
- All users have password: `password123`
- Skips users that already exist

**When to use:**
- Testing friend requests
- Testing leaderboard with multiple users
- Demo purposes

**Note:** These users have plain text passwords (not hashed). For production, use proper password hashing.

---

### 3. `seedFakeUserSkills.js` - Add Skills to Fake Users

**Purpose:** Assigns skills to the fake users so they appear as "also learning" on skill cards.

**Usage:**
```bash
node src/scripts/seedFakeUserSkills.js
```

**What it does:**
- Finds fake users created by `seedFakeUsers.js`
- Assigns skills: `Guitar`, `Web Development`, `Photography`
- Sets status to `in_progress` for all assigned skills

**When to use:**
- After running `seedFakeUsers.js`
- To populate "also learning" indicators on skill cards
- Testing social features

**Prerequisites:** Must run `seedFakeUsers.js` first.

---

## User Management Scripts

### 4. `listUsers.js` - List All Users

**Purpose:** Displays all users in the database with their usernames and emails.

**Usage:**
```bash
node src/scripts/listUsers.js
```

**Output:**
```
Total users: 5
---
1. katsudom (katsudom@example.com)
2. jordan_lee (jordan.lee@example.com)
3. sam-rivera (sam.rivera@example.com)
...
```

**When to use:**
- Quick check of registered users
- Finding usernames for other scripts
- Debugging user-related issues

---

### 5. `loginAsUser.js` - Generate Login Token for a User

**Purpose:** Generates a JWT token to log in as a specific user in the browser (useful for testing).

**Usage:**
```bash
node src/scripts/loginAsUser.js <username>
```

**Example:**
```bash
node src/scripts/loginAsUser.js katsudom
```

**What it does:**
- Finds the user by username
- Generates a JWT token
- Prints token and user data to console

**How to use the token:**
1. Copy the printed token
2. Open browser DevTools (F12)
3. Go to Application/Storage → Local Storage → your origin
4. Set key `"token"` to the printed token value
5. Set key `"user"` to the printed user JSON (optional)
6. Refresh the page

**When to use:**
- Testing as different users without logging out
- Debugging user-specific features
- Quick access to test accounts

---

### 6. `acceptAllFriendRequests.js` - Accept All Pending Friend Requests

**Purpose:** Automatically accepts all pending friend requests for a specific user.

**Usage:**
```bash
node src/scripts/acceptAllFriendRequests.js <username>
```

**Example:**
```bash
node src/scripts/acceptAllFriendRequests.js katsudom
```

**What it does:**
- Finds user by username
- Accepts all pending friend requests where user is the recipient
- Shows count of accepted requests

**When to use:**
- Bulk accepting friend requests for testing
- Setting up demo accounts with friends
- Testing friend features

---

### 7. `compareUsers.js` - Compare Two Users

**Purpose:** Compares all attributes (except password) between two users side-by-side.

**Usage:**
```bash
node src/scripts/compareUsers.js <username1> <username2>
```

**Example:**
```bash
node src/scripts/compareUsers.js katsudom jordan_lee
```

**Output:**
- Side-by-side comparison table
- Lists all attributes and their values
- Highlights differences

**When to use:**
- Debugging user data inconsistencies
- Comparing account settings
- Understanding user model differences

---

## Quick Setup Guide for Teammates

To get started with a fresh database setup:

```bash
# 1. Navigate to backend directory
cd backend

# 2. Seed pre-loaded skill tracks (IMPORTANT!)
npm run seed

# 3. (Optional) Create fake users for testing
node src/scripts/seedFakeUsers.js

# 4. (Optional) Add skills to fake users
node src/scripts/seedFakeUserSkills.js
```

---

## Troubleshooting

### Script fails with "Cannot find module"
- Make sure you're in the `backend` directory
- Run `npm install` to install dependencies

### Database connection error
- Check your `.env` file has `MONGO_URI` set correctly
- Ensure MongoDB is running

### User not found errors
- Use `listUsers.js` to see available usernames
- Usernames are case-insensitive but must match exactly

### Script hangs or doesn't exit
- Some scripts may need manual exit (Ctrl+C)
- Check database connection is properly closed

---

## Notes

- All scripts are idempotent (safe to run multiple times)
- Scripts that create data will skip existing entries
- Always run scripts from the `backend` directory
- Make sure your `.env` file is properly configured before running scripts
