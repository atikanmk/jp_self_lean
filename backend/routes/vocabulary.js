const express = require('express');
const router = express.Router();
const Vocabulary = require('../models/Vocabulary');

// GET all vocabulary (with optional filter by jlptLevel)
router.get('/', async (req, res) => {
  try {
    const { level, search } = req.query;
    const filter = {};
    if (level && ['N5', 'N4', 'N3', 'N2', 'N1'].includes(level)) {
      filter.jlptLevel = level;
    }
    if (search) {
      filter.$or = [
        { japanese: { $regex: search, $options: 'i' } },
        { thai: { $regex: search, $options: 'i' } },
        { reading: { $regex: search, $options: 'i' } },
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
    const vocab = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!vocab) return res.status(404).json({ error: 'Vocabulary not found' });
    res.json({ message: 'Vocabulary deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
