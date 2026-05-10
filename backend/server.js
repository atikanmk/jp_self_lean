require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const vocabularyRoutes = require('./routes/vocabulary');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jp_self_learn';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'JLPT Vocabulary API is running' });
});

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Seed initial data if needed
    const { seedDatabase } = require('./data/seed');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
