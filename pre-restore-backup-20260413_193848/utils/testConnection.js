/* eslint-disable no-unused-vars */
import { healthCheck } from '../services/api';
import { authApi } from '../services/auth';

export const testBackendConnection = async () => {
  console.log('🧪 Testing backend connection...');
  
  try {
    // Test health endpoint
    const health = await healthCheck();
    console.log('✅ Health check:', health);
    
    // Test if we can reach the backend
    if (health.success) {
      console.log('🎉 Backend is fully operational!');
      return true;
    } else {
      console.log('❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    console.error('💥 Backend connection failed:', error);
    return false;
  }
};

// Auto-test on import
testBackendConnection();