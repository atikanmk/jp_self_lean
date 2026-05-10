const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema(
  {
    japanese: {
      type: String,
      required: true,
      trim: true,
    },
    reading: {
      type: String,
      required: true,
      trim: true,
    },
    thai: {
      type: String,
      required: true,
      trim: true,
    },
    jlptLevel: {
      type: String,
      required: true,
      enum: ['N5', 'N4', 'N3', 'N2', 'N1'],
    },
    partOfSpeech: {
      type: String,
      default: '',
      trim: true,
    },
    example: {
      japanese: { type: String, default: '' },
      thai: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

vocabularySchema.index({ jlptLevel: 1 });
vocabularySchema.index({ japanese: 'text', thai: 'text' });

module.exports = mongoose.model('Vocabulary', vocabularySchema);
