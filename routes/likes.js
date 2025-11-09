const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Like = require('../models/Like');
const Post = require('../models/Post');
const { verifyToken } = require('../middleware/authMiddleware');

// Check if user has liked a post (MUST come before /post/:postId)
router.get('/post/:postId/check', verifyToken, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    
    const like = await Like.findOne({
      postId: req.params.postId,
      userId: req.user.id
    });
    res.json({ liked: !!like });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all likes for a post (with user info) (MUST come before /post/:postId)
router.get('/post/:postId/users', async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    
    const likes = await Like.find({ postId: req.params.postId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    
    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get likes count for a post
router.get('/post/:postId', async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    
    const count = await Like.countDocuments({ postId: req.params.postId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like a post (authenticated users)
router.post('/post/:postId', verifyToken, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    
    // Check if post exists
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked this post
    const existingLike = await Like.findOne({
      postId: req.params.postId,
      userId: req.user.id
    });

    if (existingLike) {
      // If already liked, return current count
      const count = await Like.countDocuments({ postId: req.params.postId });
      return res.status(200).json({
        message: 'Post already liked',
        liked: true,
        count
      });
    }

    // Create like
    const like = new Like({
      postId: req.params.postId,
      userId: req.user.id
    });

    await like.save();

    // Get updated likes count
    const count = await Like.countDocuments({ postId: req.params.postId });

    res.status(201).json({
      message: 'Post liked successfully',
      liked: true,
      count
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - already liked
      const count = await Like.countDocuments({ postId: req.params.postId });
      return res.status(200).json({
        message: 'Post already liked',
        liked: true,
        count
      });
    }
    console.error('Like error:', error);
    res.status(500).json({ message: error.message || 'Failed to like post' });
  }
});

// Unlike a post (authenticated users)
router.delete('/post/:postId', verifyToken, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    
    const like = await Like.findOneAndDelete({
      postId: req.params.postId,
      userId: req.user.id
    });

    if (!like) {
      // If not liked, return current count
      const count = await Like.countDocuments({ postId: req.params.postId });
      return res.status(200).json({
        message: 'Post not liked',
        liked: false,
        count
      });
    }

    // Get updated likes count
    const count = await Like.countDocuments({ postId: req.params.postId });

    res.json({
      message: 'Post unliked successfully',
      liked: false,
      count
    });
  } catch (error) {
    console.error('Unlike error:', error);
    res.status(500).json({ message: error.message || 'Failed to unlike post' });
  }
});

module.exports = router;

