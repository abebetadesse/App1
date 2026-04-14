// backend/src/routes/moodle.js
import express from 'express';
const router = express.Router();

const simpleAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }
  req.user = { userId: 1, email: 'user@example.com', role: 'profile_owner' };
  next();
};

router.use(simpleAuth);

router.post('/link-account', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Moodle account linked successfully',
    data: {
      moodleUserId: 12345,
      username: req.body.username
    }
  });
});

router.get('/courses', (req, res) => {
  res.json({
    success: true,
    data: {
      courses: [
        { id: 1, name: 'Web Development Basics', progress: 75 },
        { id: 2, name: 'Advanced JavaScript', progress: 25 }
      ]
    }
  });
});

export default router;