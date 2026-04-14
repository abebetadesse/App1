import express from 'express';
const router = express.Router();

// In-memory message store (replace with database in production)
let messages = [];
let onlineUsers = new Set();

// WebSocket connections (in real app, use socket.io)
// For now, we'll handle via HTTP

// GET /api/chatting/online-users
router.get('/online-users', (req, res) => {
  res.json({
    success: true,
    message: 'Online users list',
    data: {
      onlineUsers: Array.from(onlineUsers),
      count: onlineUsers.size,
    },
  });
});

// POST /api/chatting/connect
router.post('/connect', (req, res) => {
  const { userId, username } = req.body;
  
  if (userId && username) {
    onlineUsers.add({ userId, username, connectedAt: new Date().toISOString() });
    
    res.json({
      success: true,
      message: 'Connected to chat',
      data: {
        userId,
        username,
        connectionId: `conn_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'UserId and username are required',
    });
  }
});

// POST /api/chatting/disconnect
router.post('/disconnect', (req, res) => {
  const { userId } = req.body;
  
  onlineUsers.forEach(user => {
    if (user.userId === userId) {
      onlineUsers.delete(user);
    }
  });
  
  res.json({
    success: true,
    message: 'Disconnected from chat',
    data: { userId },
  });
});

// GET /api/chatting/messages
router.get('/messages', (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  
  const paginatedMessages = messages.slice(offset, offset + limit);
  
  res.json({
    success: true,
    message: 'Messages retrieved',
    data: {
      messages: paginatedMessages,
      pagination: {
        total: messages.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    },
  });
});

// POST /api/chatting/messages
router.post('/messages', (req, res) => {
  const { senderId, senderName, content, type = 'text' } = req.body;
  
  if (!senderId || !content) {
    return res.status(400).json({
      success: false,
      message: 'Sender ID and content are required',
    });
  }
  
  const newMessage = {
    id: `msg_${Date.now()}`,
    senderId,
    senderName: senderName || `User_${senderId}`,
    content,
    type,
    timestamp: new Date().toISOString(),
    readBy: [],
  };
  
  messages.push(newMessage);
  
  // Limit messages to last 1000
  if (messages.length > 1000) {
    messages = messages.slice(-1000);
  }
  
  res.json({
    success: true,
    message: 'Message sent',
    data: newMessage,
  });
});

// POST /api/chatting/messages/:messageId/read
router.post('/messages/:messageId/read', (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.body;
  
  const message = messages.find(msg => msg.id === messageId);
  if (message) {
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
    }
    
    res.json({
      success: true,
      message: 'Message marked as read',
      data: { messageId, readBy: message.readBy },
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Message not found',
    });
  }
});

export default router;