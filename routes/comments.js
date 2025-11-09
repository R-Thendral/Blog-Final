const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Get all comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      postId: req.params.postId,
      isHidden: false 
    })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment (authenticated users)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { postId, content } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      postId,
      userId: req.user.id,
      content
    });

    await comment.save();
    await comment.populate('userId', 'username');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete comment (author of comment or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is comment author or admin
    if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hide/Unhide comment (admin only)
router.patch('/:id/hide', verifyToken, isAdmin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.isHidden = !comment.isHidden;
    await comment.save();

    res.json({ message: `Comment ${comment.isHidden ? 'hidden' : 'unhidden'} successfully`, comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

