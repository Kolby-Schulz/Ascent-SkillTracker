const mongoose = require('mongoose');

const userSkillProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['learned', 'in_progress'],
      default: 'in_progress',
    },
  },
  {
    timestamps: true,
  }
);

// One progress entry per user per skill
userSkillProgressSchema.index({ userId: 1, skillName: 1 }, { unique: true });

module.exports = mongoose.model('UserSkillProgress', userSkillProgressSchema);
