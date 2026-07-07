const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const pipelineRoutes = require('./routes/pipeline');
const plgRoutes = require('./routes/plg');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', pipelineRoutes);
app.use('/api', plgRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Signal Engine is running 🚀' });
});

// Connect to MongoDB then start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });