import express from 'express';
import { body, validationResult } from 'express-validator';
import { Connection, ProfileOwner, Client, User } from '../models.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create connection (client selects profile owner)
router.post('/', authenticateToken, requireRole(['client']), [
  body('profileOwnerId').isUUID().notEmpty(),
  body('searchQueryId').optional().isUUID()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        messages: errors.array()
      });
    }

    const { profileOwnerId, searchQueryId } = req.body;

    // Get client
    const client = await Client.findOne({
      where: { userId: req.user.id }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client Not Found',
        message: 'Client profile not found'
      });
    }

    // Get profile owner
    const profileOwner = await ProfileOwner.findByPk(profileOwnerId, {
      include: [User]
    });

    if (!profileOwner) {
      return res.status(404).json({
        success: false,
        error: 'Profile Owner Not Found',
        message: 'Profile owner not found'
      });
    }

    // Create connection
    const connection = await Connection.create({
      clientId: client.id,
      profileOwnerId: profileOwner.id,
      searchQueryId: searchQueryId || null,
      connectionDate: new Date()
    });

    // Get notification service from app
    const notificationService = req.app.get('notificationService');
    await notificationService.notifyProfileOwnerConnection(connection.id);

    res.status(201).json({
      success: true,
      message: 'Connection created successfully',
      data: {
        connection,
        clientPhone: client.phoneNumber, // Only revealed to the specific profile owner
        message: 'Profile owner has been notified and will contact you shortly'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Mark call as made
router.put('/:id/call-made', authenticateToken, requireRole(['profile_owner']), async (req, res, next) => {
  try {
    const connection = await Connection.findByPk(req.params.id);

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Connection Not Found',
        message: 'Connection not found'
      });
    }

    // Check if profile owner owns this connection
    const profileOwner = await ProfileOwner.findOne({
      where: { userId: req.user.id }
    });

    if (connection.profileOwnerId !== profileOwner.id) {
      return res.status(403).json({
        success: false,
        error: 'Access Denied',
        message: 'You can only update your own connections'
      });
    }

    await connection.update({
      profileOwnerCalled: true,
      calledAt: new Date(),
      status: 'contacted'
    });

    res.json({
      success: true,
      message: 'Call marked as made successfully',
      data: { connection }
    });
  } catch (error) {
    next(error);
  }
});

// Provide feedback
router.put('/:id/feedback', authenticateToken, [
  body('clientRating').optional().isInt({ min: 1, max: 5 }),
  body('clientFeedback').optional().isIn(['positive', 'neutral', 'negative']),
  body('notes').optional().isString()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        messages: errors.array()
      });
    }

    const connection = await Connection.findByPk(req.params.id);

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Connection Not Found',
        message: 'Connection not found'
      });
    }

    // Check if user is either the client or profile owner in this connection
    let hasAccess = false;
    
    if (req.user.role === 'client') {
      const client = await Client.findOne({ where: { userId: req.user.id } });
      hasAccess = connection.clientId === client.id;
    } else if (req.user.role === 'profile_owner') {
      const profileOwner = await ProfileOwner.findOne({ where: { userId: req.user.id } });
      hasAccess = connection.profileOwnerId === profileOwner.id;
    } else if (req.user.role === 'admin') {
      hasAccess = true;
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Access Denied',
        message: 'You can only provide feedback for your own connections'
      });
    }

    await connection.update({
      clientRating: req.body.clientRating,
      clientFeedback: req.body.clientFeedback,
      notes: req.body.notes,
      status: req.body.status || connection.status
    });

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { connection }
    });
  } catch (error) {
    next(error);
  }
});

// Get client connections
router.get('/client/:clientId', authenticateToken, async (req, res, next) => {
  try {
    const connections = await Connection.findAll({
      where: { clientId: req.params.clientId },
      include: [
        {
          model: ProfileOwner,
          include: [User]
        }
      ],
      order: [['connectionDate', 'DESC']]
    });

    res.json({
      success: true,
      data: { connections }
    });
  } catch (error) {
    next(error);
  }
});

// Get profile owner connections
router.get('/profile-owner/:profileOwnerId', authenticateToken, async (req, res, next) => {
  try {
    const connections = await Connection.findAll({
      where: { profileOwnerId: req.params.profileOwnerId },
      include: [
        {
          model: User,
          as: 'ClientUser',
          include: ['client']
        }
      ],
      order: [['connectionDate', 'DESC']]
    });

    res.json({
      success: true,
      data: { connections }
    });
  } catch (error) {
    next(error);
  }
});

export default router;