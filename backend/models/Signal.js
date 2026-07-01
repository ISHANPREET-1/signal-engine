const mongoose = require('mongoose');

const SignalSchema = new mongoose.Schema({
  company: String,
  signalType: String,
  signalDetail: String,
  description: String,
  source: String,
  url: String,
  date: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Signal', SignalSchema);