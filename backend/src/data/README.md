# Skill Tracks Seed Data

This directory contains seed data for populating the database with pre-existing skill tracks for demo purposes.

## Contents

- `skillTracksSeed.json` - Contains 8 diverse skill tracks covering different categories:
  - **JavaScript Fundamentals** (Technology)
  - **Spanish for Beginners** (Languages)
  - **Digital Photography Basics** (Photography)
  - **Beginner Guitar** (Music)
  - **Healthy Cooking Fundamentals** (Cooking)
  - **Introduction to Running** (Fitness)
  - **Creative Writing Basics** (Writing)
  - **Personal Finance Basics** (Business)

## Running the Seed Script

To populate your database with these skill tracks, run:

```bash
npm run seed
```

Or directly:

```bash
node src/scripts/seedSkillTracks.js
```

## What the Script Does

1. Connects to your MongoDB database
2. Creates or finds a demo user account (`demo_creator`)
3. Checks for existing roadmaps and only creates missing ones (safe to run multiple times)
4. Creates all 8 skill tracks as **published and public** roadmaps
5. Each roadmap includes:
   - Name and description
   - Appropriate tags/categories
   - 4 sub-skills with step-by-step progression
   - Resources (articles and videos) for each sub-skill

## Important: Data Visibility

**All roadmaps created by this script are visible to ALL users!** They appear in the "Learn Skill" section for anyone who logs in, regardless of which user account they use. This is because:
- All roadmaps have `status: 'published'`
- All roadmaps have `visibility: 'public'`
- The backend API returns all published, public roadmaps to any user

## For Team Members

If you're setting up the project for the first time or want to ensure the seed data is available:

1. Make sure your Docker containers are running (especially MongoDB)
2. Navigate to the backend directory: `cd backend`
3. Run the seed script: `npm run seed`
4. The skill tracks will now be available to all users in the "Learn Skill" section

## Demo User Account

The seed script creates a demo user with:
- Username: `demo_creator`
- Email: `demo@example.com`
- Password: `demo123456`

You can use this account to log in and see the created roadmaps, or the roadmaps will appear in the "Learn Skill" section for all users.

## Notes

- All roadmaps are created with `status: 'published'` and `visibility: 'public'`
- Resources include real, working URLs to educational content
- Each skill track has 4 sub-skills with 2 resources each (typically 1 article + 1 video)
- The script is **idempotent** - it checks for existing roadmaps and only creates missing ones
- Safe to run multiple times without creating duplicates
- If using a shared database (like in production), run the seed script once and all users will see the data
