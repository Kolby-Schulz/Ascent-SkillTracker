const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const skillTracksData = require('../data/skillTracksSeed.json');
require('dotenv').config();

const seedSkillTracks = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find or create a demo user for the seed data
    let demoUser = await User.findOne({ username: 'demo_creator' });
    
    if (!demoUser) {
      // Create demo user if it doesn't exist
      const hashedPassword = await bcrypt.hash('demo123456', 10);
      demoUser = await User.create({
        username: 'demo_creator',
        email: 'demo@example.com',
        passwordHash: hashedPassword,
        roles: ['user'],
        privacy: 'public',
        bio: 'Demo account for seed skill tracks',
      });
      console.log('Created demo user:', demoUser.username);
    } else {
      console.log('Using existing demo user:', demoUser.username);
    }

    // Check for existing seed roadmaps and create only missing ones
    const existingRoadmaps = await Roadmap.find({ 
      creator: demoUser._id,
      name: { $in: skillTracksData.map(track => track.name) }
    });
    
    const existingNames = new Set(existingRoadmaps.map(r => r.name));
    const roadmapsToCreate = skillTracksData.filter(track => !existingNames.has(track.name));
    
    if (existingRoadmaps.length > 0) {
      console.log(`Found ${existingRoadmaps.length} existing roadmaps. Skipping...`);
      existingRoadmaps.forEach(roadmap => {
        console.log(`  - ${roadmap.name} (already exists)`);
      });
    }

    // Create only missing roadmaps from seed data
    const createdRoadmaps = [];
    
    for (const trackData of roadmapsToCreate) {
      const roadmap = await Roadmap.create({
        name: trackData.name,
        description: trackData.description || '',
        creator: demoUser._id,
        status: 'published',
        visibility: 'public',
        tags: trackData.tags || [],
        category: trackData.tags && trackData.tags[0] ? trackData.tags[0] : 'General',
        subSkills: trackData.subSkills.map((subSkill, index) => ({
          title: subSkill.title,
          description: subSkill.description,
          order: subSkill.order || index + 1,
          resources: (subSkill.resources || []).map((resource, resIndex) => ({
            url: resource.url,
            title: resource.title || '',
            type: resource.type || 'other',
            order: resource.order !== undefined ? resource.order : resIndex,
          })),
        })),
      });
      
      createdRoadmaps.push(roadmap);
      console.log(`✓ Created roadmap: ${roadmap.name}`);
    }

    const totalRoadmaps = existingRoadmaps.length + createdRoadmaps.length;
    console.log(`\n✅ Seed data check complete!`);
    console.log(`   Total roadmaps available: ${totalRoadmaps}`);
    if (createdRoadmaps.length > 0) {
      console.log(`   Newly created: ${createdRoadmaps.length}`);
      createdRoadmaps.forEach(roadmap => {
        console.log(`     - ${roadmap.name} (${roadmap.tags.join(', ')})`);
      });
    }
    console.log('\n📌 All roadmaps are published and public - visible to all users!');

    // Close database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding skill tracks:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed script
seedSkillTracks();
