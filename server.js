const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');
const cors = require('cors');
const path = require('path');


// 加载环境变量
dotenv.config();
const app = express();

// 中间件：打印请求信息
app.use((req, res, next) => {
    console.log(`Received ${req.method} request: ${req.originalUrl}`);
    next();
});

// 使用 CORS 中间件，允许跨域请求
app.use(cors({
    origin: '*',  // 允许所有来源的请求
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization']  // 允许的请求头
}));

// 中间件：解析 JSON 请求体
app.use(express.json());

// 处理静态文件（前端文件）
app.use('/pages', express.static(path.join(__dirname, 'frontend/pages')));
app.use('/styles', express.static(path.join(__dirname, 'frontend/styles')));
app.use('/assets', express.static(path.join(__dirname, 'frontend/assets')));
app.use('/scripts', express.static(path.join(__dirname, 'frontend/scripts')));



// 用户相关路由
app.use('/api', userRoutes);
app.use('/api/comments', commentRoutes);

// 连接 MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1); // 连接失败就退出
  });


// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
