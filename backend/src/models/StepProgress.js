const mongoose = require('mongoose');

const stepProgressSchema = new mongoose.Schema(
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
    stepIndex: {
      type: Number,
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// One progress entry per user per step per roadmap
stepProgressSchema.index({ userId: 1, roadmapId: 1, stepIndex: 1 }, { unique: true });

// Index for querying friend progress
stepProgressSchema.index({ roadmapId: 1, stepIndex: 1, completedAt: 1 });

module.exports = mongoose.model('StepProgress', stepProgressSchema);
