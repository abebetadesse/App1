import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { FeatureFlagProvider } from '../contexts/FeatureFlagContext';
import { PerformanceProvider } from '../contexts/PerformanceContext';

export const AppProviders = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      <NotificationProvider>
        <FeatureFlagProvider>
          <PerformanceProvider>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            {children}
          </PerformanceProvider>
        </FeatureFlagProvider>
      </NotificationProvider>
    </ThemeProvider>
  </AuthProvider>
);
export default AppProviders;
