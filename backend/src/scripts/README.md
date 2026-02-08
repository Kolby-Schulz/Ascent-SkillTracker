# Documentation for DEVELOPER MODE

This folder contains one-off and utility scripts for local development, testing, and database setup. **Run all commands from the `backend` directory** unless noted.

**Prerequisites:** MongoDB running (e.g. `docker start skill-roadmap-mongodb`), and `backend/.env` with a valid `MONGO_URI`.

---

## Scripts overview

| Script | Purpose |
|--------|--------|
| [listUsers.js](#listusersjs) | List all users in the database |
| [loginAsUser.js](#loginasuserjs) | Generate a JWT to log in as a user (force login) |
| [seedFakeUsers.js](#seedfakeusersjs) | Create 3 fake test users |
| [seedFakeUserSkills.js](#seedfakeuserskillsjs) | Give fake users skills so they appear on dashboard cards |
| [acceptAllFriendRequests.js](#acceptallfriendrequestsjs) | Accept all pending friend requests for a user |
| [compareUsers.js](#compareusersjs) | Compare two users’ attributes in the DB |
| [seedSkillTracks.js](#seedskilltracksjs) | Seed published skill-track roadmaps (Learn Skill) |

---

## listUsers.js

**What it does:** Prints every user in the database (username and email).

**When to use:** Quick check of who exists, or to get usernames for other scripts.

**Command:**
```bash
cd backend
node src/scripts/listUsers.js
```

**Output:** Total count plus one line per user: `1. katsudom (dominicpham2006@gmail.com)`.

---

## loginAsUser.js

**What it does:** Generates a JWT and user payload for a given username so you can “force login” as that user in the browser without their password. With **`--open`**, opens the frontend and logs you in automatically (no copy/paste).

**When to use:** Testing as another user (e.g. jordan_lee, katsudom), debugging friend features, or demos.

**Commands:**
```bash
cd backend
# Print token and user (then copy into Local Storage manually)
node src/scripts/loginAsUser.js <username>

# Open browser and log in automatically (frontend must be running at http://localhost:3000)
node src/scripts/loginAsUser.js <username> --open
```

**Examples:**
```bash
node src/scripts/loginAsUser.js katsudom
node src/scripts/loginAsUser.js jordan_lee --open
```

**With `--open`:** The script opens `http://localhost:3000/dev-login#token=...&user=...`. The frontend route `/dev-login` reads the hash, writes `token` and `user` to Local Storage, then redirects to `/dashboard`. Make sure the frontend is running (e.g. `npm start` in the frontend folder).

**Without `--open` (manual):**
1. Copy the printed **Token** → DevTools (F12) → Application → Local Storage → set key `token` to that value.
2. Copy the printed **User** (single-line JSON) → same place → set key `user` to that value.
3. Refresh the page. You are now logged in as that user.

**Note:** You must set **both** `token` and `user` in Local Storage; the app checks for both on load. Use a different frontend URL with `FRONTEND_URL=http://localhost:3001 node src/scripts/loginAsUser.js katsudom --open` if your app runs on another port.

---

## seedFakeUsers.js

**What it does:** Creates 3 test users in the database if they don’t already exist: `jordan_lee`, `sam-rivera`, `alex_chen`. All use password **`password123`**.

**When to use:** First-time setup or reset when you need extra users for testing friends, feed, or dashboard “friends on this skill” avatars.

**Command:**
```bash
cd backend
node src/scripts/seedFakeUsers.js
```

**Safe to run multiple times:** Skips any user that already exists (by username or email).

---

## seedFakeUserSkills.js

**What it does:** Sets **UserSkillProgress** for the 3 fake users (`jordan_lee`, `sam-rivera`, `alex_chen`) so they have the skills “Guitar”, “Web Development”, and “Photography” in progress.

**When to use:** After running `seedFakeUsers.js`, when you want those users to appear on dashboard skill cards as “also learning” for those skills (and they are your friends).

**Command:**
```bash
cd backend
node src/scripts/seedFakeUserSkills.js
```

**Note:** Only affects users that already exist. Run `seedFakeUsers.js` first if needed.

---

## acceptAllFriendRequests.js

**What it does:** Accepts **all pending friend requests** where the given user is the **recipient**. Updates each of those `Friend` records to `status: 'accepted'`.

**When to use:** You have pending requests for a user and want to accept them in bulk (e.g. for testing or demos) without using the UI.

**Command:**
```bash
cd backend
node src/scripts/acceptAllFriendRequests.js <username>
```

**Example:**
```bash
node src/scripts/acceptAllFriendRequests.js katsudom
```

**Output:** Prints the user, how many requests were accepted, or that none were found.

---

## compareUsers.js

**What it does:** Compares two users in the database by username and prints a side-by-side of their attributes (everything except `passwordHash`). Highlights which attributes differ.

**When to use:** Checking why two accounts behave differently, or confirming that a test user has the same schema as a real user.

**Command:**
```bash
cd backend
node src/scripts/compareUsers.js <username1> <username2>
```

**Example:**
```bash
node src/scripts/compareUsers.js katsudom jordan_lee
```

---

## seedSkillTracks.js

**What it does:** Seeds the database with **published skill-track roadmaps** from `backend/src/data/skillTracksSeed.json`. Creates or reuses a `demo_creator` user and only adds roadmaps that don’t already exist.

**When to use:** First-time setup or when you want the “Learn Skill” section to show the predefined tracks (e.g. JavaScript, Spanish, Guitar, Cooking, etc.).

**Command:**
```bash
cd backend
npm run seed
```

Or directly:
```bash
node src/scripts/seedSkillTracks.js
```

**More detail:** See `backend/src/data/README.md` for what gets created and how visibility works.

---

## Quick reference

| Goal | Command |
|------|--------|
| See all users | `node src/scripts/listUsers.js` |
| Log in as a user | `node src/scripts/loginAsUser.js <username>` or add `--open` to open browser and log in |
| Add 3 fake users | `node src/scripts/seedFakeUsers.js` |
| Fake users show on skill cards | `node src/scripts/seedFakeUserSkills.js` |
| Accept all requests for a user | `node src/scripts/acceptAllFriendRequests.js <username>` |
| Compare two users | `node src/scripts/compareUsers.js <user1> <user2>` |
| Seed Learn Skill roadmaps | `npm run seed` |

All of the above assume you are in the **`backend`** directory and that **MongoDB is running** (e.g. via Docker).
