const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  score: { type: Number, min: 1, max: 5, required: true },
  review: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Rating', ratingSchema);
