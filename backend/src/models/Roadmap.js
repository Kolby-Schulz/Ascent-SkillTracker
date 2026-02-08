const mongoose = require('mongoose');

// Resource schema (embedded within sub-skill)
const resourceSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true,
      maxlength: [500, 'URL cannot exceed 500 characters'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    type: {
      type: String,
      enum: ['video', 'article', 'practice', 'document', 'other'],
      default: 'other',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

// Sub-skill schema (embedded within roadmap)
const subSkillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Sub-skill title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Sub-skill description is required'],
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    resources: {
      type: [resourceSchema],
      default: [],
    },
    customContent: {
      type: String,
      trim: true,
      maxlength: [2000, 'Custom content cannot exceed 2000 characters'],
    },
  },
  {
    _id: true, // Allow _id for sub-skills
  }
);

// Main roadmap schema
const roadmapSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Roadmap name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    subSkills: {
      type: [subSkillSchema],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'At least one sub-skill is required',
      },
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    likedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    learnedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    visibility: {
      type: String,
      enum: ['public', 'unlisted', 'private'],
      default: 'public',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
roadmapSchema.index({ creator: 1, status: 1 });
roadmapSchema.index({ status: 1, visibility: 1 });
roadmapSchema.index({ name: 'text', description: 'text' });

// Virtual for sub-skill count
roadmapSchema.virtual('subSkillCount').get(function () {
  return this.subSkills ? this.subSkills.length : 0;
});

// Ensure virtuals are included in JSON
roadmapSchema.set('toJSON', { virtuals: true });
roadmapSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
