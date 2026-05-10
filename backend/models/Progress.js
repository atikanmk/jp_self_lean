const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    vocabularyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vocabulary',
      required: true,
    },
    correct: {
      type: Number,
      default: 0,
    },
    incorrect: {
      type: Number,
      default: 0,
    },
    lastReviewed: {
      type: Date,
      default: Date.now,
    },
    mode: {
      type: String,
      enum: ['thai-to-japanese', 'japanese-to-thai'],
      default: 'thai-to-japanese',
    },
  },
  { timestamps: true }
);

progressSchema.index({ sessionId: 1, vocabularyId: 1, mode: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
