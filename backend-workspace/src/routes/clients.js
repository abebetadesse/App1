import express from 'express';
import { body, validationResult } from 'express-validator';
import { Client, User, Connection } from '../models.js';
const router = express.Router();
import clientController from '../controllers/clientController.js';
import { authenticateToken, requireRole, requireAdmin } from '../middleware/auth.js';

// Admin only routes
router.get('/', authenticateToken, requireAdmin, clientController.getAllClients);
router.get('/:id', authenticateToken, requireAdmin, clientController.getClient);
router.put('/:id', authenticateToken, requireAdmin, clientController.updateClient);

// Client access to their own data
router.get('/:clientId/connections', authenticateToken, clientController.getConnections);
router.get('/:clientId/stats', authenticateToken, clientController.getClientStats);
// Get client by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['email', 'role', 'isActive']
      }]
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client Not Found',
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: { client }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user's client profile
router.get('/me/profile', authenticateToken, requireRole(['client']), async (req, res, next) => {
  try {
    const client = await Client.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ['email', 'role', 'isActive', 'createdAt']
        },
        {
          model: Connection,
          as: 'connections',
          limit: 10,
          order: [['connectionDate', 'DESC']]
        }
      ]
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client Profile Not Found',
        message: 'Client profile not found for this user'
      });
    }

    res.json({
      success: true,
      data: { client }
    });
  } catch (error) {
    next(error);
  }
});

// Update client profile
router.put('/:id', authenticateToken, requireRole(['client']), [
  body('companyName').optional().isString().trim(),
  body('industry').optional().isString().trim(),
  body('contactPreference').optional().isIn(['phone', 'email', 'both'])
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

    const client = await Client.findByPk(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client Not Found',
        message: 'Client not found'
      });
    }

    // Check if user owns this profile
    if (client.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access Denied',
        message: 'You can only update your own profile'
      });
    }

    const updatedClient = await client.update(req.body);

    res.json({
      success: true,
      message: 'Client profile updated successfully',
      data: { client: updatedClient }
    });
  } catch (error) {
    next(error);
  }
});

export default router;