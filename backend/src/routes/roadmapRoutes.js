const express = require('express');
const {
  createRoadmap,
  getRoadmaps,
  getMyRoadmaps,
  getRoadmapById,
  getMyRoadmapForView,
  updateRoadmap,
  deleteRoadmap,
  publishRoadmap,
  unpublishRoadmap,
  toggleLike,
} = require('../controllers/roadmapController');
const { protect, optionalProtect } = require('../middlewares/auth');
const {
  createRoadmapValidation,
  updateRoadmapValidation,
  roadmapIdValidation,
} = require('../validations/roadmapValidation');

const router = express.Router();

// Public routes
router.get('/', getRoadmaps);
// More specific routes before /:id to avoid "user" being matched as id
router.get('/user/my-roadmaps', protect, getMyRoadmaps);
router.get('/user/view/:id', protect, roadmapIdValidation, getMyRoadmapForView);
router.get('/:id', optionalProtect, roadmapIdValidation, getRoadmapById);

// Protected routes (require authentication)
router.post('/', protect, createRoadmapValidation, createRoadmap);
router.put('/:id', protect, updateRoadmapValidation, updateRoadmap);
router.delete('/:id', protect, roadmapIdValidation, deleteRoadmap);
router.put('/:id/publish', protect, roadmapIdValidation, publishRoadmap);
router.put('/:id/unpublish', protect, roadmapIdValidation, unpublishRoadmap);
router.put('/:id/like', protect, roadmapIdValidation, toggleLike);

module.exports = router;
