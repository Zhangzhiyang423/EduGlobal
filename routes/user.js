const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  changePassword
} = require('../controllers/userController');

const router = express.Router();
const authMiddleware = require('../middleware/auth'); // 用于验证 JWT 的中间件

// 公共路由
router.post('/register', registerUser);
router.post('/login', loginUser);

// 私有路由（需要验证身份）
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUser);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
