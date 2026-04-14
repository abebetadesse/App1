import express from 'express';
const router = express.Router();

// Stripe webhook handler
router.post('/', async (req, res) => {
  try {
    import paymentManager from '../../server.js';.serviceManager.getPaymentManager();
    await paymentManager.handleStripeWebhook(req, res);
  } catch (error) {
    console.error('Stripe webhook processing error:', error);
    res.status(400).json({
      success: false,
      error: 'Webhook processing failed'
    });
  }
});

export default router;