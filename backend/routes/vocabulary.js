const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vocabulary = require('../models/Vocabulary');

// Escape special regex characters to prevent ReDoS
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Validate a MongoDB ObjectId from user input
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET all vocabulary (with optional filter by jlptLevel and search)
router.get('/', async (req, res) => {
  try {
    const { level, search } = req.query;
    const filter = {};
    if (level && ['N5', 'N4', 'N3', 'N2', 'N1'].includes(level)) {
      filter.jlptLevel = level;
    }
    if (search && typeof search === 'string') {
      const safeSearch = escapeRegex(search.slice(0, 100));
      filter.$or = [
        { japanese: { $regex: safeSearch, $options: 'i' } },
        { thai: { $regex: safeSearch, $options: 'i' } },
        { reading: { $regex: safeSearch, $options: 'i' } },
      ];
    }
    const vocabulary = await Vocabulary.find(filter).sort({ jlptLevel: 1, createdAt: 1 });
    res.json(vocabulary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single vocabulary item by id
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid vocabulary ID' });
    }
    const vocab = await Vocabulary.findById(req.params.id);
    if (!vocab) return res.status(404).json({ error: 'Vocabulary not found' });
    res.json(vocab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new vocabulary item
router.post('/', async (req, res) => {
  try {
    const vocab = new Vocabulary(req.body);
    await vocab.save();
    res.status(201).json(vocab);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a vocabulary item
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid vocabulary ID' });
    }
    const vocab = await Vocabulary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vocab) return res.status(404).json({ error: 'Vocabulary not found' });
    res.json(vocab);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a vocabulary item
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid vocabulary ID' });
    }
    const vocab = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!vocab) return res.status(404).json({ error: 'Vocabulary not found' });
    res.json({ message: 'Vocabulary deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
