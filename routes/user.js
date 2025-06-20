const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  changePassword,
  deleteUser,
  requestPasswordReset,     
  resetPassword            
} = require('../controllers/userController');

const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); 

// public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-reset', requestPasswordReset);   
router.post('/reset-password', resetPassword);         

// protected routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUser);
router.put('/change-password', authMiddleware, changePassword);
router.delete('/profile', authMiddleware, deleteUser);

module.exports = router;
