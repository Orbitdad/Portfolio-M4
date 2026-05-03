const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// ─── Auth middleware (inline) ────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ─── GET /api/blogs ──────────────────────────────────────────────────────────
// Public: returns all blogs sorted newest first
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/blogs ─────────────────────────────────────────────────────────
// Protected: only admin can create
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { text, imageUrl, date } = req.body;
    if (!text && !imageUrl) {
      return res.status(400).json({ error: 'Post must have text or an image.' });
    }
    const blog = new Blog({ text, imageUrl, date });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── DELETE /api/blogs/:id ───────────────────────────────────────────────────
// Protected: only admin can delete
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
