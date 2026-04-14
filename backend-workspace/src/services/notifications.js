class NotificationService {
  constructor(io) {
    this.io = io;
    this.smsProvider = new SMSProvider();
    this.pushService = new PushNotificationService();
  }

  async notifyProfileOwnerConnection(connectionId) {
    const connection = await Connection.findByPk(connectionId, {
      include: [
        { model: Client, include: [User] },
        { model: ProfileOwner, include: [User] }
      ]
    });
    
    if (!connection) {
      throw new Error('Connection not found');
    }
    
    // Prepare notification message
    const message = `A client has selected your profile! Call them at: ${connection.Client.phoneNumber}`;
    const notificationData = {
      connectionId: connection.id,
      clientName: connection.Client.User.email, // Use email or actual name field
      clientPhone: connection.Client.phoneNumber,
      profileOwnerId: connection.profileOwnerId
    };
    
    let notificationMethods = [];
    
    // Send in-app notification (WebSocket)
    this.sendInAppNotification(connection.ProfileOwner.userId, {
      type: 'connection',
      title: 'New Client Connection',
      message: message,
      data: notificationData
    });
    notificationMethods.push('in_app');
    
    // Send push notification
    if (connection.ProfileOwner.receivePushNotifications) {
      await this.sendPushNotification(connection.ProfileOwner.userId, {
        title: 'New Client Connection',
        body: message,
        data: notificationData
      });
      notificationMethods.push('push');
    }
    
    // Send SMS notification
    if (connection.ProfileOwner.receiveSmsNotifications && connection.ProfileOwner.isPhoneVerified) {
      await this.sendSMS(connection.ProfileOwner.phoneNumber, message);
      notificationMethods.push('sms');
    }
    
    // Update connection record
    await connection.update({
      profileOwnerNotified: true,
      notificationMethod: notificationMethods.join(','),
      notifiedAt: new Date()
    });
    
    return notificationMethods;
  }

  sendInAppNotification(userId, notification) {
    this.io.to(`user_${userId}`).emit('notification', {
      ...notification,
      id: generateId(),
      timestamp: new Date()
    });
  }

  async sendPushNotification(userId, notification) {
    try {
      const pushToken = await this.getUserPushToken(userId);
      if (pushToken) {
        await this.pushService.send(pushToken, notification);
      }
    } catch (error) {
      console.error('Push notification failed:', error);
    }
  }

  async sendSMS(phoneNumber, message) {
    try {
      await this.smsProvider.send(phoneNumber, message);
    } catch (error) {
      console.error('SMS notification failed:', error);
    }
  }

  async getUserPushToken(userId) {
    // Retrieve push token from database
    const user = await User.findByPk(userId);
    return user.pushToken;
  }
}