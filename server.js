const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');

// 加载环境变量
dotenv.config();

// 初始化 Express 应用
const app = express();

// 中间件：解析 JSON 请求体
app.use(express.json());

// 连接 MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1); // 连接失败就退出
  });

// 用户相关路由
app.use('/api', userRoutes);

// 启动服务
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
