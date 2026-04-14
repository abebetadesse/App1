require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');

const logger = require('./config/logger');
const { limiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
// Add other routes (jobs, admin, etc.) similarly

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
  path: '/socket.io/',
});

global.io = io;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(limiter);
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
// TODO: Add other routes

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Error handling
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error', err));

// Socket.io
io.on('connection', (socket) => {
  logger.info(`WebSocket client connected: ${socket.id}`);
  socket.on('disconnect', () => logger.info(`WebSocket client disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  logger.info(`Backend running on port ${PORT}`);
});
