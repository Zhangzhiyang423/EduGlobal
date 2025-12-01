const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');
const recommendationRoutes = require('./routes/recommendation');
const programmesRoutes = require('./routes/programmes');
const roiRoutes = require('./routes/roi');
const roiService = require('./services/roiService');
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


// connect MongoDB AND load ROI baseline data, then start server
Promise.all([
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }),
    roiService.loadBaseline()
]).then(() => {
    console.log('MongoDB Connected and ROI baseline loaded');
    
    // Mount all routes BEFORE listening
    console.log('Mounting userRoutes at /api');
    app.use('/api', userRoutes);
    
    console.log('Mounting commentRoutes at /api/comments');
    app.use('/api/comments', commentRoutes);
    
    console.log('Mounting recommendationRoutes at /api');
    app.use('/api', recommendationRoutes);
    
    console.log('Mounting programmesRoutes at /api');
    app.use('/api', programmesRoutes);
    
    // Simple test endpoint for debugging
    app.get('/api/test', (req, res) => {
        res.json({ status: 'server is running' });
    });
    

    // Mount review routes
    console.log('Mounting reviewRoutes at /api/reviews');
    const reviewRoutes = require('./routes/review');
    app.use('/api/reviews', reviewRoutes);

    // mount ROI routes after baseline is available
    console.log('Mounting roiRoutes at /api/roi');
    app.use('/api/roi', roiRoutes);

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
    
    // Handle server errors
    server.on('error', (err) => {
        console.error('Server error:', err);
        process.exit(1);
    });
}).catch(err => {
    console.error('Startup failed:', err && err.message ? err.message : err);
    process.exit(1);
});
