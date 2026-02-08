const express = require('express');
const {
  createRoadmap,
  getRoadmaps,
  getMyRoadmaps,
  getRoadmapById,
  updateRoadmap,
  deleteRoadmap,
  publishRoadmap,
  unpublishRoadmap,
  toggleLike,
} = require('../controllers/roadmapController');
const { protect } = require('../middlewares/auth');
const {
  createRoadmapValidation,
  updateRoadmapValidation,
  roadmapIdValidation,
} = require('../validations/roadmapValidation');

const router = express.Router();

// Public routes
router.get('/', getRoadmaps);
router.get('/:id', roadmapIdValidation, getRoadmapById);

// Protected routes (require authentication)
router.post('/', protect, createRoadmapValidation, createRoadmap);
router.get('/user/my-roadmaps', protect, getMyRoadmaps);
router.put('/:id', protect, updateRoadmapValidation, updateRoadmap);
router.delete('/:id', protect, roadmapIdValidation, deleteRoadmap);
router.put('/:id/publish', protect, roadmapIdValidation, publishRoadmap);
router.put('/:id/unpublish', protect, roadmapIdValidation, unpublishRoadmap);
router.put('/:id/like', protect, roadmapIdValidation, toggleLike);

module.exports = router;
