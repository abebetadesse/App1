export const initializeRealTimeServices = () => {
  console.log('Real-time services initialized');
};

export const subscribeToChannel = (channel, callback) => {
  console.log(`Subscribed to ${channel}`);
  return () => {};
};

export default { initializeRealTimeServices, subscribeToChannel };
