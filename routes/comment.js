const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const auth = require('../middleware/auth');

//  CREATE comment
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  try {
    const comment = new Comment({
      title,
      content,
      userId: req.user._id
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  READ all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name'); 
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE comment
router.put('/:id', auth, async (req, res) => {
  const { title, content } = req.body;

  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ error: 'Comment not found.' });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to update this comment.' });
    }

    comment.title = title || comment.title;
    comment.content = content || comment.content;

    const updated = await comment.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ error: 'Comment not found.' });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment.' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ my own comments only
router.get('/mine', auth, async (req, res) => {
  try {
    const myComments = await Comment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(myComments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
