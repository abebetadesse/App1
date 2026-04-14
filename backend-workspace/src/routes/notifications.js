import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { PushSubscription } from '../models.js';
import { Notification } from '../models.js';

const router = express.Router();

router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { subscription } = req.body;
    
    // Store subscription in database
    await PushSubscription.upsert({
      userId: req.user.id,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      createdAt: new Date()
    });

    res.json({
      success: true,
      message: 'Push subscription saved successfully'
    });
  } catch (error) {
    console.error('Push subscription failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save push subscription'
    });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
});

router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { id: req.params.id, userId: req.user.id } }
    );

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update notification'
    });
  }
});

export default router;