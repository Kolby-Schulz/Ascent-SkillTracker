const { body, param } = require('express-validator');

exports.createRoadmapValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Roadmap name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('subSkills')
    .isArray({ min: 1 })
    .withMessage('At least one sub-skill is required'),
  
  body('subSkills.*.title')
    .trim()
    .notEmpty()
    .withMessage('Sub-skill title is required')
    .isLength({ max: 100 })
    .withMessage('Sub-skill title cannot exceed 100 characters'),
  
  body('subSkills.*.description')
    .trim()
    .notEmpty()
    .withMessage('Sub-skill description is required')
    .isLength({ max: 300 })
    .withMessage('Sub-skill description cannot exceed 300 characters'),
  
  body('subSkills.*.order')
    .isInt({ min: 1 })
    .withMessage('Sub-skill order must be a positive integer'),
  
  body('subSkills.*.resources')
    .optional()
    .isArray()
    .withMessage('Resources must be an array'),
  
  body('subSkills.*.resources.*.url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Resource URL must be valid'),
  
  body('subSkills.*.resources.*.title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Resource title cannot exceed 100 characters'),
  
  body('subSkills.*.resources.*.type')
    .optional()
    .isIn(['video', 'article', 'practice', 'document', 'other'])
    .withMessage('Resource type must be video, article, practice, document, or other'),
  
  body('subSkills.*.customContent')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Custom content cannot exceed 2000 characters'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
  
  body('visibility')
    .optional()
    .isIn(['public', 'unlisted', 'private'])
    .withMessage('Visibility must be public, unlisted, or private'),
  
  body('category')
    .optional()
    .trim(),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
];

exports.updateRoadmapValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid roadmap ID'),
  
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Roadmap name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('subSkills')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one sub-skill is required'),
  
  body('subSkills.*.title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Sub-skill title is required')
    .isLength({ max: 100 })
    .withMessage('Sub-skill title cannot exceed 100 characters'),
  
  body('subSkills.*.description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Sub-skill description is required')
    .isLength({ max: 300 })
    .withMessage('Sub-skill description cannot exceed 300 characters'),
  
  body('subSkills.*.order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sub-skill order must be a positive integer'),
  
  body('subSkills.*.resources')
    .optional()
    .isArray()
    .withMessage('Resources must be an array'),
  
  body('subSkills.*.resources.*.url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Resource URL must be valid'),
  
  body('subSkills.*.resources.*.title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Resource title cannot exceed 100 characters'),
  
  body('subSkills.*.resources.*.type')
    .optional()
    .isIn(['video', 'article', 'practice', 'document', 'other'])
    .withMessage('Resource type must be video, article, practice, document, or other'),
  
  body('subSkills.*.customContent')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Custom content cannot exceed 2000 characters'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
  
  body('visibility')
    .optional()
    .isIn(['public', 'unlisted', 'private'])
    .withMessage('Visibility must be public, unlisted, or private'),
];

exports.roadmapIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid roadmap ID'),
];
