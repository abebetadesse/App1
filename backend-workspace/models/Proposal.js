const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coverLetter: String,
  answers: [{ question: String, answer: String }],
  bidAmount: Number,
  boosted: Boolean,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Proposal', proposalSchema);
