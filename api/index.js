const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
// In serverless, connections are cached between invocations
connectDB();

// API Routes - Vercel routes /api/* to this function, so paths already include /api
app.use('/auth', require('../routes/auth'));
app.use('/posts', require('../routes/posts'));
app.use('/comments', require('../routes/comments'));
app.use('/likes', require('../routes/likes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'BlogSphere API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Export the Express app for Vercel serverless functions
module.exports = app;

