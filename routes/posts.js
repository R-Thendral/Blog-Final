const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { verifyToken, isAuthor, isAdmin } = require('../middleware/authMiddleware');

// Get all posts (public, exclude hidden)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ isHidden: false })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    // Add likes count to each post
    const Like = require('../models/Like');
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({ postId: post._id });
        return {
          ...post.toObject(),
          likesCount
        };
      })
    );
    
    res.json(postsWithLikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Only show if not hidden (unless admin)
    if (post.isHidden && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add likes count
    const Like = require('../models/Like');
    const likesCount = await Like.countDocuments({ postId: post._id });
    
    const postWithLikes = {
      ...post.toObject(),
      likesCount
    };

    res.json(postWithLikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post (author/admin only)
router.post('/', verifyToken, isAuthor, async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user.id
    });

    await post.save();
    await post.populate('author', 'username');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update post (author of post or admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();
    await post.populate('author', 'username');

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete post (author of post or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hide/Unhide post (admin only)
router.patch('/:id/hide', verifyToken, isAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.isHidden = !post.isHidden;
    await post.save();

    res.json({ message: `Post ${post.isHidden ? 'hidden' : 'unhidden'} successfully`, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

