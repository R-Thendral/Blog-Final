const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user is author
const isAuthor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === 'author' || user.role === 'admin') {
      return next();
    }
    res.status(403).json({ message: 'Access denied. Author role required' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === 'admin') {
      return next();
    }
    res.status(403).json({ message: 'Access denied. Admin role required' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { verifyToken, isAuthor, isAdmin };

