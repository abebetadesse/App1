class NotificationService {
  constructor() {
    this.listeners = [];
    this.counter = 0;
    this.interval = null;
  }
  connect() {
    if (this.interval) return;
    this.interval = setInterval(() => {
      const types = ['connection', 'message', 'course', 'ranking'];
      const type = types[Math.floor(Math.random() * types.length)];
      const titles = {
        connection: 'New Connection Request',
        message: 'New Message Received',
        course: 'Course Progress Update',
        ranking: 'Your Rank Has Changed'
      };
      const notification = {
        id: ++this.counter,
        type,
        title: titles[type],
        message: `You have a new ${type} notification.`,
        timestamp: new Date().toISOString(),
        read: false
      };
      this.listeners.forEach(cb => cb(notification));
    }, 30000); // every 30 seconds
  }
  disconnect() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }
  subscribe(callback) {
    this.listeners.push(callback);
    return () => { this.listeners = this.listeners.filter(cb => cb !== callback); };
  }
}
export const notificationService = new NotificationService();
