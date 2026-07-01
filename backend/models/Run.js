const mongoose = require('mongoose');

const RunSchema = new mongoose.Schema({
  companyName: String,
  companyDomain: String,
  userProduct: String,
  signals: Array,
  contact: Object,
  outreach: Array,
  hubspotContactId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Run', RunSchema);