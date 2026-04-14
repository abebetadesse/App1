import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/auth.js';
import { serviceManager } from '../server.js';
import { PaymentTransaction } from '../models.js';

// Payment routes
router.post('/create-intent', authenticateToken, async (req, res) => {
  try {
    const { amount, currency, provider, metadata } = req.body;
    
    // Basic validation
    if (!amount || !provider) {
      return res.status(400).json({
        success: false,
        error: 'Amount and provider are required'
      });
    }
    // Get payment service from app context or require directly
    const paymentManager = serviceManager.getPaymentManager();
    const paymentResult = await paymentManager.createPaymentIntent(provider, {
      amount,
      currency: currency || 'USD',
      customerId: req.user.id,
      metadata: {
        userId: req.user.id,
        ...metadata
      }
    });

    res.json({
      success: true,
      data: paymentResult
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Payment processing failed',
      message: error.message
    });
  }
});

router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await PaymentTransaction.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
});

router.post('/webhook/stripe', async (req, res) => {
  try {
    const paymentManager = serviceManager.getPaymentManager();
    await paymentManager.handleStripeWebhook(req, res);
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({
      success: false,
      error: 'Webhook processing failed'
    });
  }
});

export default router;