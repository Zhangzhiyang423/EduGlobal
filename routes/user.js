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
const authMiddleware = require('../middleware/auth'); // 用于验证 JWT 的中间件

// 公共路由
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-reset', requestPasswordReset);   // ✅ 新增
router.post('/reset-password', resetPassword);         // ✅ 新增

// 私有路由（需要验证身份）
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUser);
router.put('/change-password', authMiddleware, changePassword);
router.delete('/profile', authMiddleware, deleteUser);

module.exports = router;
