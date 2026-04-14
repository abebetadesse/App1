import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { FeatureFlagProvider } from '../contexts/FeatureFlagContext';
import { PerformanceProvider } from '../contexts/PerformanceContext';
import { MoodleSyncProvider } from '../contexts/MoodleSyncContext';
import { ConnectionProvider } from '../contexts/ConnectionContext';
import { VisibilityProvider } from '../contexts/VisibilityContext';
import { KeyboardShortcutsProvider } from '../contexts/KeyboardShortcutsContext';
import { VoiceAssistantProvider } from '../contexts/VoiceAssistantContext';

export const AppProviders = ({ children }) => {
  return (
    <FeatureFlagProvider>
      <ThemeProvider>
        <NotificationProvider>
          <PerformanceProvider>
            <MoodleSyncProvider>
              <ConnectionProvider>
                <AuthProvider>
                  <VisibilityProvider>
                    <KeyboardShortcutsProvider>
                      <VoiceAssistantProvider>
                        {children}
                      </VoiceAssistantProvider>
                    </KeyboardShortcutsProvider>
                  </VisibilityProvider>
                </AuthProvider>
              </ConnectionProvider>
            </MoodleSyncProvider>
          </PerformanceProvider>
        </NotificationProvider>
      </ThemeProvider>
    </FeatureFlagProvider>
  );
};
