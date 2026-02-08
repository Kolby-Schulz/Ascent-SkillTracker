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
3. Deletes any existing roadmaps with the same names (to avoid duplicates)
4. Creates all 8 skill tracks as published roadmaps
5. Each roadmap includes:
   - Name and description
   - Appropriate tags/categories
   - 4 sub-skills with step-by-step progression
   - Resources (articles and videos) for each sub-skill

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
- The script will replace existing roadmaps with the same names if they exist
