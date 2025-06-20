const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');
const cors = require('cors');
const path = require('path');



dotenv.config();
const app = express();


app.use((req, res, next) => {
    console.log(`Received ${req.method} request: ${req.originalUrl}`);
    next();
});

// Middleware to enable CORS
app.use(cors({
    origin: '*',  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
    allowedHeaders: ['Content-Type', 'Authorization']  
}));

// Middleware to parse JSON bodies
app.use(express.json());


app.use('/pages', express.static(path.join(__dirname, 'frontend/pages')));
app.use('/styles', express.static(path.join(__dirname, 'frontend/styles')));
app.use('/assets', express.static(path.join(__dirname, 'frontend/assets')));
app.use('/scripts', express.static(path.join(__dirname, 'frontend/scripts')));



// user routes
app.use('/api', userRoutes);
app.use('/api/comments', commentRoutes);

// connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1); 
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
