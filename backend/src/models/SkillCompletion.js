const mongoose = require('mongoose');

const skillCompletionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
    },
    roadmapName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      required: true,
    },
    daysToComplete: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One completion entry per user per roadmap
skillCompletionSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

// Indexes for leaderboard queries
skillCompletionSchema.index({ userId: 1, completedAt: -1 });
skillCompletionSchema.index({ category: 1, completedAt: -1 });
skillCompletionSchema.index({ tags: 1, completedAt: -1 });

module.exports = mongoose.model('SkillCompletion', skillCompletionSchema);
