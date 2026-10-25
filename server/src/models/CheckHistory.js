const mongoose = require('mongoose');

const checkHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkType: { type: String, enum: ['url', 'message'], required: true },
  inputContent: { type: String, required: true },
  resultStatus: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CheckHistory', checkHistorySchema);