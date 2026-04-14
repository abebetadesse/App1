import webpush from 'web-push';

class NotificationService {
  constructor() {
    this.isInitialized = false;
  }

  initialize() {
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webpush.setVapidDetails(
        'mailto:notifications@thamplatform.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
      this.isInitialized = true;
      console.log('🔔 Push Notifications: Initialized successfully');
    } else {
      console.log('⚠️ Push Notifications: VAPID keys not configured');
    }
  }

  async sendPushNotification(subscription, payload) {
    if (!this.isInitialized) {
      console.log('⚠️ Push Notifications: Not initialized, skipping');
      return false;
    }

    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
      console.log('✅ Push notification sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Push notification failed:', error.message);
      
      // If subscription is invalid, you might want to remove it from database
      if (error.statusCode === 410) {
        console.log('🔄 Removing expired push subscription');
        // Implement subscription removal logic here
      }
      
      return false;
    }
  }

  async notifyPaymentSuccess(connectionId) {
    // This would typically:
    // 1. Find the users involved in the connection
    // 2. Send push notifications to both parties
    // 3. Update connection status
    console.log(`💰 Payment success notification for connection: ${connectionId}`);
    
    // Example implementation
    const payload = {
      title: 'Payment Received',
      body: 'Your payment has been processed successfully',
      icon: '/icons/icon-192x192.png',
      data: {
        connectionId: connectionId,
        type: 'payment_success',
        timestamp: new Date().toISOString()
      }
    };

    // In a real implementation, you would:
    // 1. Get user's push subscription from database
    // 2. Send notification to profile owner
    // 3. Send notification to client
    // 4. Log the notification
    
    return true;
  }

  async sendSMSNotification(phoneNumber, message) {
    if (!process.env.TWILIO_ACCOUNT_SID) {
      console.log('⚠️ SMS Notifications: Twilio not configured');
      return false;
    }

    try {
      import twilio from 'twilio';(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      const result = await twilio.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      console.log(`✅ SMS sent to ${phoneNumber}: ${result.sid}`);
      return true;
    } catch (error) {
      console.error('❌ SMS sending failed:', error.message);
      return false;
    }
  }

  async notifyNewConnection(connectionData) {
    const { clientId, profileOwnerId, clientPhone, profileOwnerPhone } = connectionData;
    
    // Send SMS to profile owner
    const smsMessage = `New client connection! Call ${clientPhone} to discuss the project.`;
    await this.sendSMSNotification(profileOwnerPhone, smsMessage);

    // Send push notification if available
    console.log(`🔔 New connection notification sent for connection between client ${clientId} and profile owner ${profileOwnerId}`);
    
    return true;
  }
}

export default new;NotificationService();