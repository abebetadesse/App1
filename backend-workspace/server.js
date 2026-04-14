// ==================================================
// THAM PLATFORM ENTERPRISE BACKEND
// ==================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const { body, validationResult } = require('express-validator');
const { createServer } = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

// Cache
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Rate limiting
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true },
  path: '/socket.io/',
  transports: ['websocket', 'polling']
});
global.io = io;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// ========== MODELS ==========
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['client', 'profile_owner', 'admin'], default: 'client' },
  bio: String,
  avatar: String,
  phone: String,
  location: String,
  skills: [{ name: String, level: { type: String, enum: ['beginner', 'intermediate', 'expert'] } }],
  languages: [{ name: String, proficiency: { type: String, enum: ['basic', 'conversational', 'fluent', 'native'] } }],
  portfolio: [{ title: String, type: { type: String, enum: ['image', 'video', 'audio', 'link'] }, url: String }],
  connects: { type: Number, default: 25 },
  createdAt: { type: Date, default: Date.now }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.model('User', userSchema);

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,
  visibility: { type: String, enum: ['public', 'platform', 'invite'], default: 'public' },
  screeningQuestions: [{ question: String, required: Boolean }],
  eligibilityFilters: {
    minSuccessScore: Number,
    allowedCountries: [String],
    skillsRequired: [String]
  },
  invitedFreelancers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: String,
  subcategory: String,
  skill: String,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'in-progress', 'completed', 'cancelled'], default: 'open' },
  createdAt: { type: Date, default: Date.now, index: true }
});
const Job = mongoose.model('Job', jobSchema);

const proposalSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coverLetter: String,
  answers: [{ question: String, answer: String }],
  bidAmount: Number,
  boosted: Boolean,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Proposal = mongoose.model('Proposal', proposalSchema);

const messageSchema = new mongoose.Schema({
  conversationId: String,
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  title: String,
  content: String,
  read: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

const ratingSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  score: { type: Number, min: 1, max: 5 },
  review: String,
  createdAt: { type: Date, default: Date.now }
});
const Rating = mongoose.model('Rating', ratingSchema);

// ========== AUTH MIDDLEWARE ==========
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication required' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};

// ========== VALIDATION ==========
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  next();
};

const registerValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name required'),
  validate
];
const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  validate
];
const jobValidation = [
  body('title').notEmpty().withMessage('Title required'),
  body('description').isLength({ min: 20 }).withMessage('Description too short'),
  body('budget').isNumeric().withMessage('Budget must be numeric'),
  validate
];

// ========== ROUTES ==========
app.get('/api', (req, res) => res.json({ status: 'ok', version: '2.0' }));

// Auth
app.post('/api/auth/register', registerValidation, async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    const user = new User({ email, password, name, role });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, email, name, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/profile', auth, (req, res) => res.json(req.user));
app.put('/api/auth/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Jobs
app.get('/api/jobs', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const cacheKey = `jobs_${JSON.stringify(req.query)}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    let filter = { status: 'open' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.skill) filter.skill = req.query.skill;
    if (req.query.minBudget) filter.budget = { $gte: parseInt(req.query.minBudget) };
    if (req.query.maxBudget) filter.budget = { ...filter.budget, $lte: parseInt(req.query.maxBudget) };

    const jobs = await Job.find(filter).skip(skip).limit(limit).sort('-createdAt');
    const total = await Job.countDocuments(filter);
    const result = { jobs, total, page, totalPages: Math.ceil(total / limit) };
    cache.set(cacheKey, result, 30);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/jobs', auth, jobValidation, async (req, res) => {
  try {
    const job = new Job({ ...req.body, clientId: req.user._id });
    await job.save();
    cache.flushAll();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proposals
app.post('/api/proposals', auth, async (req, res) => {
  try {
    const { jobId, coverLetter, answers, bidAmount, boosted } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (boosted && req.user.connects < 5) return res.status(400).json({ error: 'Not enough Connects' });
    if (boosted) {
      req.user.connects -= 5;
      await req.user.save();
    }
    const proposal = new Proposal({ jobId, freelancerId: req.user._id, coverLetter, answers, bidAmount, boosted });
    await proposal.save();
    io.to(job.clientId.toString()).emit('proposal_received', { jobId, proposalId: proposal._id });
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/proposals/my', auth, async (req, res) => {
  const proposals = await Proposal.find({ freelancerId: req.user._id }).populate('jobId');
  res.json(proposals);
});

// Messaging
app.get('/api/messages/:userId', auth, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id, receiverId: req.params.userId },
      { senderId: req.params.userId, receiverId: req.user._id }
    ]
  }).sort('createdAt');
  res.json(messages);
});

app.post('/api/messages', auth, async (req, res) => {
  const { receiverId, text } = req.body;
  const message = new Message({ conversationId: [req.user._id, receiverId].sort().join('-'), senderId: req.user._id, receiverId, text });
  await message.save();
  io.to(receiverId).emit('new_message', message);
  res.json(message);
});

// Notifications
app.get('/api/notifications', auth, async (req, res) => {
  const notifs = await Notification.find({ userId: req.user._id }).sort('-createdAt').limit(50);
  res.json(notifs);
});

app.put('/api/notifications/:id/read', auth, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
});

// Ratings
app.post('/api/ratings', auth, async (req, res) => {
  const { toUserId, jobId, score, review } = req.body;
  const rating = new Rating({ fromUserId: req.user._id, toUserId, jobId, score, review });
  await rating.save();
  res.json(rating);
});

app.get('/api/ratings/:userId', async (req, res) => {
  const ratings = await Rating.find({ toUserId: req.params.userId }).populate('fromUserId', 'name avatar');
  const avg = ratings.reduce((s, r) => s + r.score, 0) / (ratings.length || 1);
  res.json({ ratings, averageScore: avg, count: ratings.length });
});

// Admin
app.get('/api/admin/users', auth, requireRole('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

app.get('/api/admin/analytics', auth, requireRole('admin'), async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalProposals = await Proposal.countDocuments();
  const clients = await User.countDocuments({ role: 'client' });
  const profileOwners = await User.countDocuments({ role: 'profile_owner' });
  const admins = await User.countDocuments({ role: 'admin' });
  res.json({ totalUsers, totalJobs, totalProposals, clients, profileOwners, admins, revenue: 0 });
});

// Health
app.get('/health', (req, res) => res.json({ status: 'healthy', uptime: process.uptime() }));

// WebSocket
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Invalid token'));
    socket.userId = decoded.id;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(`WebSocket connected: ${socket.id}`);
  socket.join(socket.userId);
  socket.on('disconnect', () => console.log(`WebSocket disconnected: ${socket.id}`));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`🚀 Enterprise backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}/socket.io`);
});
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });

// File upload for avatar
app.post('/api/upload/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const avatarUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl });
    res.json({ avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Portfolio file upload
app.post('/api/upload/portfolio', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Payment stub (Stripe)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
app.post('/api/payments/create-intent', auth, async (req, res) => {
  try {
    const { amount, jobId } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: { jobId, userId: req.user._id.toString() }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    // If Stripe not configured, return mock
    res.json({ clientSecret: 'mock_secret_' + Date.now() });
  }
});
const sgMail = require('@sendgrid/mail');
if (process.env.SENDGRID_API_KEY) sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.post('/api/send-email', auth, async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    if (sgMail.setApiKey) {
      await sgMail.send({ to, from: process.env.SENDGRID_FROM_EMAIL || 'noreply@thamplatform.com', subject, html });
    } else {
      console.log('Email would be sent to:', to, subject);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  details: mongoose.Schema.Types.Mixed,
  ip: String,
  createdAt: { type: Date, default: Date.now }
});
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

// Middleware to log activities (simplified)
app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = function(data) {
    if (req.user && req.method !== 'GET') {
      ActivityLog.create({ userId: req.user._id, action: `${req.method} ${req.path}`, ip: req.ip });
    }
    oldJson.call(this, data);
  };
  next();
});
app.get('/api/admin/activity-logs', auth, requireRole('admin'), async (req, res) => {
  const logs = await ActivityLog.find().sort('-createdAt').limit(100).populate('userId', 'name email');
  res.json(logs);
});
