const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// GET progress for a session (optionally filtered by mode)
router.get('/:sessionId', async (req, res) => {
  try {
    const { mode } = req.query;
    const filter = { sessionId: req.params.sessionId };
    if (mode) filter.mode = mode;
    const progress = await Progress.find(filter).populate('vocabularyId');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET summary stats for a session
router.get('/:sessionId/summary', async (req, res) => {
  try {
    const records = await Progress.find({ sessionId: req.params.sessionId });
    const totalCorrect = records.reduce((sum, r) => sum + r.correct, 0);
    const totalIncorrect = records.reduce((sum, r) => sum + r.incorrect, 0);
    const totalAnswered = totalCorrect + totalIncorrect;
    res.json({
      totalAnswered,
      totalCorrect,
      totalIncorrect,
      accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST record an answer (correct or incorrect)
router.post('/', async (req, res) => {
  try {
    const { sessionId, vocabularyId, isCorrect, mode } = req.body;
    if (!sessionId || !vocabularyId || isCorrect === undefined) {
      return res.status(400).json({ error: 'sessionId, vocabularyId, and isCorrect are required' });
    }
    const update = isCorrect
      ? { $inc: { correct: 1 }, $set: { lastReviewed: new Date(), mode: mode || 'thai-to-japanese' } }
      : { $inc: { incorrect: 1 }, $set: { lastReviewed: new Date(), mode: mode || 'thai-to-japanese' } };

    const record = await Progress.findOneAndUpdate(
      { sessionId, vocabularyId, mode: mode || 'thai-to-japanese' },
      update,
      { upsert: true, new: true }
    );
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE progress for a session
router.delete('/:sessionId', async (req, res) => {
  try {
    await Progress.deleteMany({ sessionId: req.params.sessionId });
    res.json({ message: 'Progress cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
