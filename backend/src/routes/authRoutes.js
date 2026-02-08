const express = require('express');
const router = express.Router();
const { register, login, getMe, getUserProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const {
  registerValidation,
  loginValidation,
} = require('../validations/authValidation');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/user/:userId', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
