const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,
  visibility: { type: String, enum: ['public', 'platform', 'invite'], default: 'public' },
  screeningQuestions: [{ question: String, required: Boolean }],
  category: String,
  subcategory: String,
  skill: String,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'open' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);
