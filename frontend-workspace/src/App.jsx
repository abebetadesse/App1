import Home from './pages/Home';
import React, { useRef, useState, useEffect, useCallback, useMemo, Suspense, lazy } from "react";
/* eslint-disable no-unused-vars */
import { AppProviders } from './providers/AppProviders';
import analytics from './services/analytics';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation, 
  useNavigate
} from 'react-router-dom';

// Context Providers
import { useAuth } from './contexts/AuthContext';
import { useNotification } from './contexts/NotificationContext';
import { useTheme } from './contexts/ThemeContext';
import { useFeatureFlag } from './contexts/FeatureFlagContext';
import { usePerformanceMetrics } from './contexts/PerformanceContext';
import { useMoodleSync } from './contexts/MoodleSyncContext';
import { useConnectionManager } from './contexts/ConnectionContext';

// Layout Components
import Layout from './components/layout/Layout';
import EnhancedSidebar from './components/layout/EnhancedSidebar';
import QuickActionsPanel from './components/layout/QuickActionsPanel';
import VoiceCommandInterface from './components/voice/VoiceCommandInterface';
import AINavigationAssistant from './components/ai/AINavigationAssistant';
import MoodleSyncStatus from './components/moodle/MoodleSyncStatus';
import ConnectionManager from './components/connections/ConnectionManager';

// Route Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import MoodleIntegratedRoute from './components/auth/MoodleIntegratedRoute';

// UI Components
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/error/ErrorBoundary';
import NetworkStatus from './components/common/NetworkStatus';
import PerformanceMonitor from './components/common/PerformanceMonitor';
import SecurityMonitor from './components/common/SecurityMonitor';
import MemoryMonitor from './components/common/MemoryMonitor';
import TutorialOverlay from './components/tutorial/TutorialOverlay';
import AccessibilityToolbar from './components/accessibility/AccessibilityToolbar';
import MoodleProgressTracker from './components/moodle/MoodleProgressTracker';
import ConnectionNotificationPanel from './components/connections/ConnectionNotificationPanel';

// Notification System
import { Toaster } from 'react-hot-toast';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_mock");
import NotificationCenter from './components/notifications/NotificationCenter';

// Enhanced Utilities
import { initializeAnalytics, trackPageView, trackEvent, trackPerformance } from './utils/analytics';
import { initializeErrorReporting } from './utils/errorReporting';
import { initializeFeatureFlags } from './utils/featureFlags';
import { initializeMoodleSync, syncMoodleCourses } from './utils/moodleIntegration';
import { initializeRealTimeServices } from './utils/realTimeServices';
import { initializeVoiceAssistant } from './utils/voiceAssistant';
import { initializeConnectionManager } from './utils/connectionManager';
import { initializeSearchOptimization } from './utils/searchOptimization';
import { initializePerformanceOptimizer } from './utils/performanceOptimizer';

// Enhanced Hooks
import { useIdleTimer } from './hooks/useIdleTimer';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useMemoryStatus } from './hooks/useMemoryStatus';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTutorial } from './hooks/useTutorial';
import { useVoiceCommands } from './hooks/useVoiceCommands';
import { useOfflineSync } from './hooks/useOfflineSync';
import { useSearchOptimization } from './hooks/useSearchOptimization';
import { useAIPerformanceOptimization } from './hooks/useAIPerformanceOptimization';

// Error Fallback Component
import { AIErrorFallback } from './components/error/AIErrorFallback';

import './App.css';

// Initialize analytics safely
analytics.init();

// ... [rest of the advanced App.jsx content exactly as provided above] ...
// ========== AI Performance Monitoring Hook (unchanged) ==========
const useAIPerformance = (componentName, options = {}) => {
  // ... same as original (kept for completeness)
  const startTime = useRef(performance.now());
  const mounted = useRef(false);
  const { markMetric, recordMetric, predictPerformance } = usePerformanceMetrics();
  const { enabled: performanceTracking } = useFeatureFlag('ai_performance_tracking');
  const { optimizeComponent } = useAIPerformanceOptimization();

  const metrics = useRef({
    firstRender: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    interactionCount: 0,
    predictionAccuracy: 0,
    anomalyDetected: false,
    moodleSyncImpact: 0,
    connectionLoad: 0
  });

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const loadTime = performance.now() - startTime.current;
      metrics.current.firstRender = loadTime;

      if (performanceTracking) {
        predictPerformance(componentName, loadTime).then(prediction => {
          metrics.current.predictionAccuracy = prediction.accuracy;
          metrics.current.anomalyDetected = prediction.anomaly;
          metrics.current.moodleSyncImpact = prediction.moodleImpact || 0;
          
          if (prediction.anomaly) {
            trackEvent('performance_anomaly_detected', {
              component: componentName,
              expected: prediction.expected,
              actual: loadTime,
              deviation: prediction.deviation,
              moodle_impact: prediction.moodleImpact
            });
          }
        });

        recordMetric('ai_component_load_time', loadTime, {
          component: componentName,
          environment: import.meta.env.NODE_ENV,
          user_device: navigator.hardwareConcurrency || 'unknown',
          connection_type: navigator.connection?.effectiveType || 'unknown',
          moodle_synced: localStorage.getItem('moodle_last_sync') || 'unknown',
          active_connections: JSON.parse(localStorage.getItem('active_connections') || '[]').length
        });

        trackPerformance('component_ai_insights', {
          component: componentName,
          load_time: loadTime,
          prediction_accuracy: metrics.current.predictionAccuracy,
          moodle_sync_status: metrics.current.moodleSyncImpact,
          connection_load: metrics.current.connectionLoad,
          timestamp: new Date().toISOString()
        });

        if (import.meta.env.NODE_ENV === 'development') {
          console.log(`🚀 AI ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
          console.log(`📊 Performance Prediction Accuracy: ${metrics.current.predictionAccuracy}%`);
          console.log(`🎯 Moodle Sync Impact: ${metrics.current.moodleSyncImpact}%`);
        }
      }
    }

    return () => {
      // Cleanup if needed (e.g., abort ongoing predictions)
    };
  }, [componentName, performanceTracking, recordMetric, predictPerformance]);

  return {
    mark: useCallback((eventName, additionalData = {}) => {
      const time = performance.now() - startTime.current;
      if (performanceTracking) {
        markMetric(eventName, time, {
          component: componentName,
          ai_enhanced: true,
          moodle_context: additionalData.moodleContext,
          connection_context: additionalData.connectionContext,
          ...additionalData
        });
      }
    }, [componentName, performanceTracking, markMetric]),

    recordInteraction: useCallback((interactionType, data = {}) => {
      metrics.current.interactionCount++;
      const interactionComplexity = data.complexity || 'simple';
      const interactionValue = data.value || 1;
      const moodleContext = data.moodleContext || 'none';
      
      trackEvent('ai_user_interaction', {
        component: componentName,
        interaction_type: interactionType,
        interaction_complexity: interactionComplexity,
        interaction_value: interactionValue,
        total_interactions: metrics.current.interactionCount,
        session_duration: performance.now() - startTime.current,
        moodle_context: moodleContext,
        connection_status: data.connectionStatus,
        ...data
      });
    }, [componentName]),

    getAIMetrics: () => ({ 
      ...metrics.current,
      performanceScore: calculatePerformanceScore(metrics.current),
      moodleOptimization: calculateMoodleOptimization(metrics.current)
    }),

    optimizeComponent: useCallback((optimizationStrategy, context = {}) => {
      const optimization = optimizeComponent(componentName, optimizationStrategy, {
        current_performance: metrics.current.firstRender,
        moodle_context: context.moodleContext,
        connection_context: context.connectionContext,
        ...context
      });

      trackEvent('ai_optimization_suggested', {
        component: componentName,
        strategy: optimizationStrategy,
        current_performance: metrics.current.firstRender,
        expected_improvement: optimization.expectedImprovement,
        moodle_aware: optimization.moodleAware,
        connection_optimized: optimization.connectionOptimized
      });

      return optimization;
    }, [componentName, optimizeComponent])
  };
};

// ========== AI-Powered Lazy Loading (unchanged) ==========
const createAILazyComponent = (importFn, componentName, options = {}) => {
  // ... same as original (kept for brevity)
  const {
    retryCount = 3,
    timeout = 15000,
    preload = 'intelligent',
    priority = 'medium',
    chunkName = componentName.toLowerCase().replace(/\s+/g, '-'),
    fallback: customFallback,
    errorBoundary: CustomErrorBoundary = ErrorBoundary,
    predictiveLoading = true,
    moodleAware = false,
    connectionAware = false
  } = options;

  // AI predictive preloading
  if (predictiveLoading && typeof window !== 'undefined') {
    const predictLoadNeed = () => {
      const userBehavior = JSON.parse(localStorage.getItem('user_behavior') || '{}');
      const moodleStatus = JSON.parse(localStorage.getItem('moodle_sync_status') || '{}');
      const componentUsage = userBehavior[componentName] || 0;
      const likelyToUse = componentUsage > 2 || 
                         preload === 'immediate' ||
                         (moodleAware && moodleStatus.synced) ||
                         (connectionAware && userBehavior.hasActiveConnections);

      if (likelyToUse) {
        setTimeout(() => {
          importFn().catch(() => {
            console.warn(`AI Preload failed for ${componentName}`);
          });
        }, moodleAware ? 500 : 1000);
      }
    };

    if (preload === 'intelligent') {
      predictLoadNeed();
    } else if (preload === 'immediate') {
      importFn().catch(() => {});
    }
  }

  const LazyComponent = React.lazy(() => {
    return new Promise((resolve, reject) => {
      let retries = 0;
      let timeoutId;

      const attemptImport = async () => {
        try {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            reject(new Error(`AI Import timeout for ${componentName} after ${timeout}ms`));
          }, timeout);

          const component = await importFn();
          clearTimeout(timeoutId);
          
          trackEvent('ai_component_load_success', {
            component: componentName,
            retries: retries,
            load_strategy: preload,
            moodle_aware: moodleAware,
            connection_aware: connectionAware,
            timestamp: new Date().toISOString()
          });
          
          resolve(component);
        } catch (error) {
          clearTimeout(timeoutId);
          retries++;

          if (retries <= retryCount) {
            console.warn(`AI Retrying ${componentName} import (${retries}/${retryCount})`);
            const baseDelay = moodleAware ? 500 : 1000;
            const backoffDelay = Math.min(baseDelay * Math.pow(2, retries - 1), 30000);
            
            trackEvent('ai_component_retry', {
              component: componentName,
              attempt: retries,
              backoff_delay: backoffDelay,
              moodle_context: moodleAware,
              error: error.message
            });
            
            setTimeout(attemptImport, backoffDelay);
          } else {
            const finalError = new Error(`AI Failed to load ${componentName} after ${retryCount} attempts: ${error.message}`);
            trackEvent('ai_component_load_failed', {
              component: componentName,
              attempts: retries,
              error: finalError.message,
              chunk: chunkName,
              moodle_impact: moodleAware
            });
            reject(finalError);
          }
        }
      };

      attemptImport();
    });
  });

  const EnhancedAIComponent = React.memo((props) => {
    const performance = useAIPerformance(componentName);
    const [hasError, setHasError] = useState(false);
    const [optimizationApplied, setOptimizationApplied] = useState(false);
    const { isVisible, ref } = useIntersectionObserver({ threshold: 0.05 });
    const { isLowEndDevice } = useMemoryStatus();
    const { lastSync: moodleLastSync } = useMoodleSync();
    const { activeConnections } = useConnectionManager();

    useEffect(() => {
      if (isVisible && !optimizationApplied) {
        performance.mark('ai_component_visible', {
          moodleContext: moodleAware ? 'active' : 'none',
          connectionContext: connectionAware ? activeConnections.length : 0
        });
        
        if (isLowEndDevice) {
          const optimization = performance.optimizeComponent('low_end_optimization', {
            moodleContext: moodleAware,
            connectionContext: connectionAware
          });
          setOptimizationApplied(true);
        }
      }
    }, [isVisible, optimizationApplied, performance, isLowEndDevice, moodleAware, connectionAware, activeConnections]);

    if (hasError && customFallback) {
      return customFallback;
    }

    const component = (
      <div 
        ref={ref} 
        data-component={componentName} 
        data-chunk={chunkName}
        data-ai-optimized={optimizationApplied}
        data-moodle-aware={moodleAware}
        data-connection-aware={connectionAware}
        className={`ai-enhanced-component ${isLowEndDevice ? 'low-end-optimized' : ''} ${moodleAware ? 'moodle-integrated' : ''}`}
      >
        <LazyComponent {...props} />
      </div>
    );

    return (
      <CustomErrorBoundary 
        fallback={
          <div className="ai-component-error">
            <div className="error-content">
              <h3>🤖 AI Assistant</h3>
              <p>We encountered an issue loading {componentName}</p>
              {moodleAware && (
                <div className="moodle-context-info">
                  <p>📚 Moodle Integration: Active</p>
                  <p>Last Sync: {moodleLastSync || 'Never'}</p>
                </div>
              )}
              <div className="error-actions">
                <button 
                  onClick={() => window.location.reload()}
                  className="ai-retry-button primary"
                >
                  🔄 Reload Application
                </button>
                <button 
                  onClick={() => setHasError(false)}
                  className="ai-retry-button secondary"
                >
                  ⚡ Retry Component
                </button>
                <button 
                  onClick={() => performance.optimizeComponent('error_recovery', { moodleContext: moodleAware })}
                  className="ai-optimize-button"
                >
                  🛠️ Optimize Performance
                </button>
                {moodleAware && (
                  <button 
                    onClick={() => syncMoodleCourses()}
                    className="ai-moodle-sync-button"
                  >
                    📚 Sync Moodle Data
                  </button>
                )}
              </div>
            </div>
          </div>
        }
        onError={(error, errorInfo) => {
          setHasError(true);
          trackEvent('ai_component_load_error', {
            component: componentName,
            error: error.message,
            chunk: chunkName,
            stack: errorInfo.componentStack,
            ai_suggested_fix: 'component_optimization',
            moodle_context: moodleAware,
            connection_context: connectionAware
          });
        }}
        resetKeys={[hasError]}
      >
        {component}
      </CustomErrorBoundary>
    );
  });

  EnhancedAIComponent.displayName = `AILazy(${componentName})`;
  EnhancedAIComponent.preload = importFn;
  EnhancedAIComponent.chunkName = chunkName;
  EnhancedAIComponent.aiMetadata = {
    predictiveLoading,
    moodleAware,
    connectionAware,
    optimizationStrategies: ['lazy_loading', 'predictive_prefetch', 'adaptive_retry', 'context_aware_optimization']
  };

  return EnhancedAIComponent;
};

// ========== Component Registry (unchanged) ==========
const ComponentRegistry = {
  Home: createAILazyComponent(() => import('./pages/Home'), 'Home', { 
    preload: 'intelligent', 
    priority: 'high',
    chunkName: 'home',
    predictiveLoading: true
  }),
  Login: createAILazyComponent(() => import('./pages/auth/Login'), 'Login', {
    preload: 'intelligent',
    priority: 'high',
    chunkName: 'auth',
    predictiveLoading: true
  }),
  Register: createAILazyComponent(() => import('./pages/auth/Register'), 'Register', {
    preload: 'intelligent',
    priority: 'high',
    chunkName: 'auth'
  }),
  ProfileOwnerDashboard: createAILazyComponent(() => import('./pages/profile-owner/Dashboard'), 'ProfileOwnerDashboard', {
    preload: 'intelligent',
    priority: 'high',
    chunkName: 'profile-owner',
    predictiveLoading: true,
    moodleAware: true,
    connectionAware: true
  }),
  MyCourses: createAILazyComponent(() => import('./pages/profile-owner/MyCourses'), 'MyCourses', {
    chunkName: 'profile-owner-moodle',
    predictiveLoading: true,
    moodleAware: true
  }),
  ProfileEditor: createAILazyComponent(() => import('./pages/profile-owner/ProfileEdit'), 'ProfileEditor', {
    chunkName: 'profile-owner',
    predictiveLoading: true,
    moodleAware: true
  }),
  ClientDashboard: createAILazyComponent(() => import('./pages/client/Dashboard'), 'ClientDashboard', {
    preload: 'intelligent',
    priority: 'high',
    chunkName: 'client',
    predictiveLoading: true,
    connectionAware: true
  }),
  AdvancedSearch: createAILazyComponent(() => import('./pages/client/Search'), 'AdvancedSearch', {
    chunkName: 'client-search',
    predictiveLoading: true,
    connectionAware: true
  }),
  ConnectionManager: createAILazyComponent(() => import('./pages/client/ConnectionManager'), 'ConnectionManager', {
    chunkName: 'client-connections',
    connectionAware: true
  }),
  AdminDashboard: createAILazyComponent(() => import('./pages/admin/Dashboard'), 'AdminDashboard', {
    preload: 'intelligent',
    priority: 'high',
    chunkName: 'admin',
    predictiveLoading: true
  }),
  MoodleAdmin: createAILazyComponent(() => import('./pages/admin/MoodleAdmin'), 'MoodleAdmin', {
    chunkName: 'admin-moodle',
    moodleAware: true
  }),
  AIChatAssistant: createAILazyComponent(() => import('./components/ai/AIChatAssistant'), 'AIChatAssistant', {
    preload: 'on-demand',
    chunkName: 'ai-assistant'
  }),
  VoiceCommandPanel: createAILazyComponent(() => import('./components/voice/VoiceCommandPanel'), 'VoiceCommandPanel', {
    preload: 'on-demand',
    chunkName: 'voice-interface'
  }),
  Maintenance: createAILazyComponent(() => import('./pages/errors/Maintenance'), 'Maintenance', {
    chunkName: 'errors'
  }),
  NotFound: createAILazyComponent(() => import('./pages/errors/NotFound'), 'NotFound', {
    chunkName: 'errors'
  })
};

// ========== ENHANCED AISuspenseFallback ==========
const AISuspenseFallback = ({ routeName = '', showTips = true, variant = 'default', userContext = {} }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('ai_initializing');
  const [personalizedTips, setPersonalizedTips] = useState([]);
  const { isLowEndDevice } = useMemoryStatus();
  const { user } = useAuth();
  const { lastSync: moodleLastSync, isSyncing: moodleSyncing } = useMoodleSync();

  const loadingPhases = useMemo(() => [
    { name: 'ai_initializing', duration: 800, weight: 15, message: 'AI System Initializing...' },
    { name: 'analyzing_preferences', duration: 1200, weight: 20, message: 'Analyzing Your Preferences...' },
    { name: 'loading_ai_assets', duration: 1500, weight: 25, message: 'Loading AI Components...' },
    { name: 'syncing_moodle_data', duration: moodleSyncing ? 2000 : 500, weight: 15, message: 'Syncing Moodle Data...' },
    { name: 'optimizing_experience', duration: 1000, weight: 15, message: 'Optimizing Your Experience...' },
    { name: 'finalizing_setup', duration: 800, weight: 10, message: 'Finalizing AI Setup...' }
  ], [moodleSyncing]);

  // Personalized tips generation
  useEffect(() => {
    const generatePersonalizedTips = () => {
      const baseTips = [
        "💡 AI Tip: Complete your Moodle courses to boost your professional ranking by up to 300%",
        "🚀 Pro Feature: Use voice commands for hands-free navigation - try saying 'Hey Tham, search for developers'",
        "📊 Insight: Profile owners with complete profiles get 5x more client connections",
        "🎯 Smart Search: Use our AI-powered search to find perfect matches in seconds",
        "🔔 Notification: Enable real-time alerts to never miss connection opportunities",
        "📱 Mobile: Download our app for instant notifications and on-the-go access",
        "⚡ Performance: Our AI optimizes loading based on your device and connection",
        "🎨 Personalization: Customize your dashboard for your specific workflow needs"
      ];

      if (user?.role === 'profile_owner') {
        baseTips.unshift(
          "🌟 Profile Boost: Upload certificates and portfolio to increase visibility by 200%",
          "📈 Ranking Tip: Complete advanced Moodle courses for premium ranking benefits",
          "💼 Opportunity: Set your availability to 'immediate' for 3x more connection requests",
          moodleLastSync ? 
            `📚 Moodle Sync: Last updated ${new Date(moodleLastSync).toLocaleDateString()}` :
            "📚 Moodle: Connect your account to access professional courses and ranking"
        );
      } else if (user?.role === 'client') {
        baseTips.unshift(
          "🔍 Search Pro: Use our AI matching algorithm for perfect candidate selection",
          "💬 Communication: Enable instant notifications for real-time profile owner responses",
          "📋 Project Setup: Detailed project descriptions attract higher-quality candidates",
          "🤝 Connection: Selected profile owners receive instant notifications with your contact"
        );
      }

      if (moodleSyncing) {
        baseTips.unshift("🔄 Moodle Sync: Your course progress is being updated in real-time...");
      }

      return baseTips;
    };

    setPersonalizedTips(generatePersonalizedTips());
  }, [user, moodleLastSync, moodleSyncing]);

  // Progress animation using requestAnimationFrame
  useEffect(() => {
    let rafId;
    let startTime = performance.now();
    const totalDuration = loadingPhases.reduce((sum, p) => sum + p.duration, 0);
    let lastPhase = null;

    const updateProgress = (now) => {
      const elapsed = now - startTime;
      const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(progressPercent);

      // Determine current phase
      let accumulated = 0;
      let phaseFound = false;
      for (const phase of loadingPhases) {
        if (elapsed < accumulated + phase.duration) {
          if (lastPhase !== phase.name) {
            setCurrentPhase(phase.name);
            lastPhase = phase.name;
          }
          phaseFound = true;
          break;
        }
        accumulated += phase.duration;
      }
      if (!phaseFound && loadingPhases.length > 0) {
        if (lastPhase !== loadingPhases[loadingPhases.length - 1].name) {
          setCurrentPhase(loadingPhases[loadingPhases.length - 1].name);
          lastPhase = loadingPhases[loadingPhases.length - 1].name;
        }
      }

      if (progressPercent < 100) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [loadingPhases]);

  // Tip rotation
  const [currentTip, setCurrentTip] = useState(0);
  useEffect(() => {
    if (showTips && personalizedTips.length > 0) {
      const tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % personalizedTips.length);
      }, 4500);
      return () => clearInterval(tipInterval);
    }
  }, [showTips, personalizedTips.length]);

  return (
    <div className={`ai-suspense-fallback ai-suspense-fallback--${variant}`}>
      <div className="ai-suspense-fallback__content">
        <div className="ai-loading-header">
          <div className="ai-loader">
            <div className="ai-pulse"></div>
            <div className="ai-orbits">
              <div className="orbit orbit-1"></div>
              <div className="orbit orbit-2"></div>
              <div className="orbit orbit-3"></div>
            </div>
            {moodleSyncing && <div className="moodle-sync-indicator">📚</div>}
          </div>
          <h3 className="ai-loading-title">
            {loadingPhases.find(p => p.name === currentPhase)?.message || 'AI Optimizing Your Experience...'}
          </h3>
        </div>

        <LoadingSpinner 
          message={routeName ? `AI Loading ${routeName}...` : 'AI Personalizing Your Experience...'}
          showProgress={true}
          progress={progress}
          size={isLowEndDevice ? 'medium' : 'large'}
          variant={variant}
          aiEnhanced={true}
          moodleSyncing={moodleSyncing}
        />
        
        <div className="ai-suspense-fallback__phase">
          <span className="ai-phase-indicator">
            <span className="ai-badge">AI</span>
            {currentPhase.replace(/_/g, ' ')}
          </span>
          <span className="ai-confidence">Confidence: {Math.min(progress + 20, 95)}%</span>
          {moodleSyncing && <span className="moodle-sync-badge">Moodle Syncing</span>}
        </div>

        {showTips && personalizedTips.length > 0 && (
          <div className="ai-suspense-fallback__tips">
            <div className="ai-tip-header">
              <span className="ai-tip-icon">🤖</span>
              <span className="ai-tip-title">AI Assistant Tip</span>
              {moodleSyncing && <span className="moodle-sync-pulse"></span>}
            </div>
            <p className="ai-tip-content">{personalizedTips[currentTip]}</p>
            <div className="ai-tip-progress">
              {personalizedTips.map((_, index) => (
                <div 
                  key={index}
                  className={`ai-tip-dot ${index === currentTip ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        )}

        {variant === 'minimal' && (
          <div className="ai-suspense-fallback__minimal-overlay">
            <div className="ai-pulse-animation"></div>
            <div className="ai-optimization-badge">AI Optimized</div>
            {moodleSyncing && <div className="moodle-minimal-sync">📚</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ========== AI Route Configuration ==========
const createAIRouteConfig = () => {
  const baseConfig = {
    public: [
      {
        path: '/',
        component: ComponentRegistry.Home,
        name: 'Home',
        exact: true,
        metadata: {
          title: 'Tham Platform - AI-Powered Professional Matching',
          description: 'Connect with perfectly matched professionals using our AI algorithms',
          featureFlag: 'home_page_ai_v3',
          ai: {
            personalization: 'high',
            recommendation: true,
            predictive: true
          },
          moodle: {
            integration: false
          },
          seo: {
            priority: 1.0,
            changefreq: 'hourly'
          }
        }
      },
      {
        path: '/login',
        component: ComponentRegistry.Login,
        name: 'Login',
        publicOnly: true,
        metadata: {
          title: 'Login - Tham Platform',
          featureFlag: 'auth_ai_v2',
          ai: {
            personalization: 'medium',
            security: 'enhanced'
          },
          security: {
            requireCSRF: true,
            rateLimit: 'ai_enhanced',
            biometric: true
          }
        }
      }
    ],
    protected: [
      {
        path: '/profile-owner/dashboard',
        component: ComponentRegistry.ProfileOwnerDashboard,
        name: 'Profile Owner Dashboard',
        requiredRole: 'profile_owner',
        metadata: {
          title: 'AI Dashboard - Profile Owner',
          featureFlag: 'profile_owner_dashboard_ai_v3',
          ai: {
            personalization: 'high',
            analytics: 'real_time',
            recommendations: true,
            moodle_integration: true
          },
          moodle: {
            integration: true,
            required: false,
            syncOnEnter: true
          },
          connections: {
            realTime: true,
            notifications: true
          },
          analytics: {
            category: 'profile_owner',
            action: 'view_ai_dashboard'
          }
        }
      },
      {
        path: '/profile-owner/courses',
        component: ComponentRegistry.MyCourses,
        name: 'My Courses',
        requiredRole: 'profile_owner',
        metadata: {
          title: 'My Courses - Moodle Integration',
          featureFlag: 'moodle_integration_v2',
          ai: {
            personalization: 'high',
            progress_tracking: true,
            recommendation: true
          },
          moodle: {
            integration: true,
            required: true,
            syncOnEnter: true
          }
        }
      },
      {
        path: '/client/dashboard',
        component: ComponentRegistry.ClientDashboard,
        name: 'Client Dashboard',
        requiredRole: 'client',
        metadata: {
          title: 'AI Dashboard - Client',
          featureFlag: 'client_dashboard_ai_v3',
          ai: {
            personalization: 'high',
            matching: 'ai_enhanced',
            real_time: true
          },
          connections: {
            realTime: true,
            management: true
          }
        }
      },
      {
        path: '/client/search',
        component: ComponentRegistry.AdvancedSearch,
        name: 'Advanced Search',
        requiredRole: 'client',
        metadata: {
          title: 'AI Search - Find Professionals',
          featureFlag: 'ai_search_v2',
          ai: {
            personalization: 'high',
            matching: 'neural_network',
            filters: 'adaptive'
          },
          connections: {
            instant: true,
            notifications: true
          }
        }
      },
      {
        path: '/client/connections',
        component: ComponentRegistry.ConnectionManager,
        name: 'Connection Manager',
        requiredRole: 'client',
        metadata: {
          title: 'Connection Manager',
          featureFlag: 'connection_manager_v1',
          connections: {
            management: true,
            analytics: true
          }
        }
      }
    ],
    error: [
      {
        path: '/maintenance',
        component: ComponentRegistry.Maintenance,
        name: 'Maintenance',
        metadata: {
          title: 'Maintenance - Tham Platform',
          noIndex: true,
          ai: {
            personalization: 'low',
            status_updates: true
          }
        }
      }
    ]
  };

  return baseConfig;
};

// ========== Enhanced AI Route Tracker with Stable Dependencies ==========
const AIRouteTracker = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { trackNavigation, predictNextRoute } = usePerformanceMetrics();
  const { lastSync: moodleLastSync } = useMoodleSync();
  const { activeConnections } = useConnectionManager();
  const previousPath = useRef('');
  const navigationStartTime = useRef(0);
  const routeHistory = useRef([]);

  const stablePredictNextRoute = useCallback((history, context) => {
    return predictNextRoute(history, context);
  }, [predictNextRoute]);

  useEffect(() => {
    navigationStartTime.current = performance.now();

    return () => {
      if (navigationStartTime.current) {
        const navigationTime = performance.now() - navigationStartTime.current;
        trackNavigation(previousPath.current, location.pathname, navigationTime);
        
        trackEvent('ai_navigation_complete', {
          from: previousPath.current,
          to: location.pathname,
          duration: navigationTime,
          user_role: user?.role,
          route_complexity: 'high',
          moodle_sync_age: moodleLastSync ? Date.now() - new Date(moodleLastSync).getTime() : 'never',
          active_connections: activeConnections.length
        });
      }
    };
  }, [location.pathname, trackNavigation, user, moodleLastSync, activeConnections]);

  useEffect(() => {
    const currentPath = location.pathname;
    routeHistory.current.push(currentPath);
    if (routeHistory.current.length > 5) {
      routeHistory.current.shift();
    }

    if (routeHistory.current.length >= 3) {
      stablePredictNextRoute(routeHistory.current, {
        userRole: user?.role,
        moodleLinked: !!moodleLastSync,
        activeConnections: activeConnections.length
      }).then(prediction => {
        if (prediction.confidence > 0.7) {
          const predictedComponent = Object.values(ComponentRegistry).find(
            comp => comp.chunkName === prediction.route
          );
          if (predictedComponent?.preload) {
            predictedComponent.preload();
          }
        }
      });
    }

    trackPageView(currentPath, {
      user_id: user?.id,
      user_role: user?.role,
      previous_path: previousPath.current,
      session_id: sessionStorage.getItem('ai_session_id'),
      route_history: routeHistory.current,
      moodle_sync_status: moodleLastSync ? 'synced' : 'not_synced',
      active_connections: activeConnections.length,
      ai_confidence: 'high',
      timestamp: new Date().toISOString()
    });

    performance.mark(`ai_route_change_${currentPath}`, {
      moodleContext: currentPath.includes('moodle') ? 'active' : 'inactive',
      connectionContext: activeConnections.length
    });

    document.title = `Tham AI - ${currentPath.split('/').pop() || 'Dashboard'}`;
    previousPath.current = currentPath;

    return () => {
      performance.clearMarks(`ai_route_change_${currentPath}`);
    };
  }, [location, user, stablePredictNextRoute, moodleLastSync, activeConnections]);

  return null;
};

// ========== AI Route Element Factory ==========
const createAIEnhancedRouteElement = (route, isProtected = false) => {
  const RouteComponent = route.component;
  
  const routeElement = (
    <ErrorBoundary 
      fallback={
        <div className="ai-route-error">
          <h3>🤖 AI Route Assistant</h3>
          <p>We are optimizing this route for you...</p>
          {route.metadata.moodle?.integration && (
            <div className="moodle-route-context">
              <p>📚 Moodle Integration: {route.metadata.moodle.required ? "Required" : "Optional"}</p>
            </div>
          )}
          <button onClick={() => window.location.reload()}>
            Let AI Re-optimize
          </button>
        </div>
      }
      onError={(error) => {
        trackEvent("ai_route_error", {
          route: route.path,
          name: route.name,
          error: error.message,
          ai_suggested_fix: "route_optimization",
          moodle_integration: route.metadata.moodle?.integration || false
        });
      }}
    >
      <Suspense 
        fallback={
          <AISuspenseFallback 
            routeName={route.name}
            showTips={!route.publicOnly}
            variant={route.metadata?.loadingVariant || "default"}
          />
        }
      >
        {route.metadata.moodle?.integration ? (
          <MoodleIntegratedRoute
            required={route.metadata.moodle.required}
            syncOnEnter={route.metadata.moodle.syncOnEnter}
          >
            <RouteComponent />
          </MoodleIntegratedRoute>
        ) : (
          <RouteComponent />
        )}
      </Suspense>
    </ErrorBoundary>
  );

  if (!isProtected) {
    return (
      <Route 
        key={route.path}
        path={route.path}
        element={
          <PublicRoute 
            publicOnly={route.publicOnly}
            securityLevel={route.metadata?.security?.level}
            aiEnhancements={route.metadata?.ai}
          >
            {routeElement}
          </PublicRoute>
        }
      />
    );
  }

  return (
    <Route 
      key={route.path}
      path={route.path}
      element={
        <RoleBasedRoute 
          requiredRole={route.requiredRole}
          permissions={route.metadata?.permissions}
          security={route.metadata?.security}
          aiFeatures={route.metadata?.ai}
          connectionFeatures={route.metadata?.connections}
        >
          {routeElement}
        </RoleBasedRoute>
      }
    />
  );
};

// ========== AI Role-Based Redirect ==========
const AIRoleBasedRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { lastSync: moodleLastSync, isLinked: moodleLinked } = useMoodleSync();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { startTutorial } = useTutorial();

  const getAIRedirectPath = useCallback((userRole, userProfile = {}) => {
    const intelligentRedirects = {
      profile_owner: {
        path: '/profile-owner/dashboard',
        tutorial: 'profile_owner_onboarding',
        features: ['moodle_integration', 'profile_optimization'],
        moodleRequired: true,
        connectionFeatures: true
      },
      client: {
        path: '/client/dashboard',
        tutorial: 'client_onboarding',
        features: ['ai_search', 'real_time_matching'],
        connectionFeatures: true
      },
      admin: {
        path: '/admin/dashboard',
        tutorial: 'admin_onboarding',
        features: ['analytics', 'user_management']
      },
      default: {
        path: '/dashboard',
        tutorial: 'general_onboarding',
        features: ['basic_navigation']
      }
    };

    const redirectConfig = intelligentRedirects[userRole] || intelligentRedirects.default;
    const userBehavior = JSON.parse(localStorage.getItem('user_behavior') || '{}');
    
    if (userRole === 'profile_owner' && !moodleLinked && redirectConfig.moodleRequired) {
      return {
        ...redirectConfig,
        path: '/profile-owner/moodle-setup',
        tutorial: 'moodle_setup',
        features: ['moodle_integration_setup']
      };
    }
    
    if (userBehavior.preferredRoute && userBehavior.preferredRoute !== redirectConfig.path) {
      return {
        ...redirectConfig,
        path: userBehavior.preferredRoute
      };
    }

    return redirectConfig;
  }, [moodleLinked]);

  useEffect(() => {
    if (isRedirecting || !user) return;

    const performAIRedirect = async () => {
      setIsRedirecting(true);

      try {
        const redirectConfig = getAIRedirectPath(user.role, user);
        await new Promise(resolve => setTimeout(resolve, moodleLinked ? 200 : 400));

        if (user.firstLogin) {
          showNotification({
            type: 'success',
            title: `🎉 Welcome to Tham AI, ${user.firstName || 'Valued User'}!`,
            message: moodleLinked ? 
              `I've personalized your ${user.role} experience with AI enhancements and Moodle integration.` :
              `I've personalized your ${user.role} experience. Let's set up Moodle integration for enhanced features.`,
            duration: 8000,
            action: {
              label: 'Start AI Tour',
              onClick: () => startTutorial(redirectConfig.tutorial)
            }
          });

          trackEvent('ai_onboarding_started', {
            user_role: user.role,
            tutorial_type: redirectConfig.tutorial,
            ai_features: redirectConfig.features,
            moodle_linked: moodleLinked,
            connection_features: redirectConfig.connectionFeatures
          });
        }

        trackEvent('ai_smart_redirect', {
          from_role: user.previousRole,
          to_role: user.role,
          redirect_path: redirectConfig.path,
          ai_personalization: 'high',
          tutorial_offered: user.firstLogin,
          moodle_context: moodleLinked ? 'linked' : 'setup_required'
        });

        navigate(redirectConfig.path, { 
          replace: true,
          state: { 
            aiEnhanced: true, 
            tutorial: redirectConfig.tutorial,
            moodleAware: redirectConfig.moodleRequired 
          }
        });
      } catch (error) {
        console.error('AI Redirect failed:', error);
        navigate('/dashboard', { replace: true });
      } finally {
        setIsRedirecting(false);
      }
    };

    performAIRedirect();
  }, [user, navigate, showNotification, getAIRedirectPath, isRedirecting, startTutorial, moodleLinked]);

  return (
    <AISuspenseFallback 
      routeName="AI-Personalized Dashboard"
      showTips={true}
      variant="ai_enhanced"
    />
  );
};

// ========== Enhanced AI App Content ==========
function AIAppContent() {
  const appLoadTime = useRef(performance.now());
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();
  const { isIdle } = useIdleTimer(300000);
  const { showNotification } = useNotification();
  const { startTutorial } = useTutorial();
  const { enableVoiceCommands } = useVoiceCommands();
  const { syncOfflineData } = useOfflineSync();
  const { syncMoodleData, lastSync: moodleLastSync } = useMoodleSync();
  const { initializeConnections } = useConnectionManager();
  const { optimizeSearch } = useSearchOptimization();
  const { enabled: maintenanceMode } = useFeatureFlag('maintenance_mode');
  const { enabled: aiFeatures } = useFeatureFlag('ai_enhancements');

  // Keyboard shortcuts manager
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();

  // Memoized user preferences and Moodle status for route filtering
  const userPreferences = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user_preferences') || '{}');
    } catch {
      return {};
    }
  }, []);

  const moodleStatus = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('moodle_sync_status') || '{}');
    } catch {
      return {};
    }
  }, []);

  const filterRoutesByAI = useCallback((routes, prefs, moodle) => {
    return routes.filter(route => {
      if (!route.metadata?.featureFlag) return true;
      const routeComplexity = route.metadata.ai?.personalization || 'low';
      if (prefs.low_data_mode && routeComplexity === 'high') return false;
      if (route.metadata.moodle?.required && !moodle.linked) return false;
      return true;
    });
  }, []);

  const routeConfig = useMemo(() => {
    const baseConfig = createAIRouteConfig();
    return {
      public: filterRoutesByAI(baseConfig.public, userPreferences, moodleStatus),
      protected: filterRoutesByAI(baseConfig.protected, userPreferences, moodleStatus),
      error: baseConfig.error,
    };
  }, [filterRoutesByAI, userPreferences, moodleStatus]);

  // Register keyboard shortcuts
  useEffect(() => {
    registerShortcut('ctrl+shift+a', () => enableVoiceCommands());
    registerShortcut('ctrl+shift+t', () => startTutorial('quick_tour'));
    registerShortcut('ctrl+shift+m', () => syncMoodleData());
    registerShortcut('ctrl+shift+c', () => initializeConnections());
    registerShortcut('ctrl+shift+s', () => optimizeSearch());
    registerShortcut('ctrl+shift+p', () => trackEvent('ai_shortcut_used', { shortcut: 'performance' }));

    return () => {
      unregisterShortcut('ctrl+shift+a');
      unregisterShortcut('ctrl+shift+t');
      unregisterShortcut('ctrl+shift+m');
      unregisterShortcut('ctrl+shift+c');
      unregisterShortcut('ctrl+shift+s');
      unregisterShortcut('ctrl+shift+p');
    };
  }, [registerShortcut, unregisterShortcut, enableVoiceCommands, startTutorial, syncMoodleData, initializeConnections, optimizeSearch]);

  // Initialize AI features
  useEffect(() => {
    const initializeAIApp = async () => {
      try {
        const initStartTime = performance.now();
        const initializationResults = await Promise.allSettled([
          initializeErrorReporting(),
          initializeFeatureFlags(),
          initializeMoodleSync(),
          initializeRealTimeServices(),
          initializeVoiceAssistant(),
          initializeConnectionManager(),
          initializeSearchOptimization(),
          initializePerformanceOptimizer()
        ]);

        const successfulInits = initializationResults.filter(r => r.status === 'fulfilled').length;
        const failedInits = initializationResults.filter(r => r.status === 'rejected').length;

        const analyticsConsent = localStorage.getItem('ai_analytics_consent');
        if (analyticsConsent === 'true' || analyticsConsent === null) {
          await initializeAnalytics();
          if (analyticsConsent === null) {
            localStorage.setItem('ai_analytics_consent', 'true');
          }
        }

        const loadTime = performance.now() - initStartTime;
        
        trackPerformance('ai_app_initialized', {
          load_time: loadTime,
          theme: theme,
          online_status: isOnline,
          ai_features_enabled: aiFeatures,
          successful_initializations: successfulInits,
          failed_initializations: failedInits,
          moodle_sync_status: moodleLastSync ? 'synced' : 'pending',
          user_agent: navigator.userAgent,
          device_capabilities: {
            cores: navigator.hardwareConcurrency,
            memory: navigator.deviceMemory,
            connection: navigator.connection?.effectiveType
          },
          timestamp: new Date().toISOString()
        });

        console.log(`🚀 AI Enterprise App initialized in ${loadTime.toFixed(2)}ms`);
        console.log(`📊 Initialization: ${successfulInits}/8 successful`);

        const isFirstVisit = !localStorage.getItem('ai_app_visited');
        if (isFirstVisit) {
          setTimeout(() => {
            showNotification({
              type: 'info',
              title: '🤖 Tham AI Assistant Activated',
              message: moodleLastSync ? 
                'Your AI-powered professional platform with Moodle integration is ready!' :
                'Your AI-powered professional platform is ready! Connect Moodle for enhanced features.',
              duration: 10000,
              action: {
                label: moodleLastSync ? 'Meet Your AI Assistant' : 'Setup Moodle Integration',
                onClick: () => startTutorial(moodleLastSync ? 'ai_assistant' : 'moodle_setup')
              }
            });
            localStorage.setItem('ai_app_visited', 'true');
          }, 2000);
        }

      } catch (error) {
        console.error('AI Enterprise app initialization failed:', error);
        trackEvent('ai_app_initialization_failed', {
          error: error.message,
          phase: 'initialization',
          moodle_context: 'initialization_failed',
          timestamp: new Date().toISOString()
        });
      }
    };

    initializeAIApp();
  }, [theme, isOnline, aiFeatures, showNotification, startTutorial, moodleLastSync]);

  // Visibility and beforeunload handlers
  useEffect(() => {
    const handleAIVisibilityChange = () => {
      const state = document.hidden ? 'hidden' : 'visible';
      trackEvent('ai_app_visibility_change', { 
        state,
        ai_context: 'state_management',
        moodle_sync_status: moodleLastSync ? 'active' : 'inactive'
      });

      if (state === 'hidden') {
        const aiSessionData = {
          lastPath: window.location.pathname,
          aiContext: 'background',
          moodleLastSync: moodleLastSync,
          activeConnections: JSON.parse(localStorage.getItem('active_connections') || '[]').length,
          timestamp: new Date().toISOString()
        };
        sessionStorage.setItem('ai_session_snapshot', JSON.stringify(aiSessionData));
      }
    };

    const handleAIBeforeUnload = () => {
      const aiSessionData = {
        lastPath: window.location.pathname,
        aiContext: 'unload',
        moodleLastSync: moodleLastSync,
        timestamp: new Date().toISOString(),
        userState: 'preserved'
      };
      sessionStorage.setItem('ai_session_snapshot', JSON.stringify(aiSessionData));
    };

    const handleOnline = () => {
      showNotification({
        type: 'success',
        title: '🌐 AI Sync Restored',
        message: 'Your AI assistant is back online and syncing data...',
        duration: 4000
      });
      syncOfflineData();
      syncMoodleData();
    };

    const handleOffline = () => {
      showNotification({
        type: 'warning',
        title: '📴 AI Working Offline',
        message: 'Some features limited. Your work will sync when back online.',
        duration: 6000
      });
    };

    document.addEventListener('visibilitychange', handleAIVisibilityChange);
    window.addEventListener('beforeunload', handleAIBeforeUnload);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      document.removeEventListener('visibilitychange', handleAIVisibilityChange);
      window.removeEventListener('beforeunload', handleAIBeforeUnload);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showNotification, syncOfflineData, syncMoodleData, moodleLastSync]);

  // Idle state management with requestIdleCallback
  useEffect(() => {
    if (isIdle) {
      trackEvent('ai_user_idle', { 
        idle_time: 300000,
        ai_action: 'state_preservation',
        moodle_sync_triggered: true
      });
      
      const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1000));
      idleCallback(() => {
        syncOfflineData();
        const lastMoodleSync = moodleLastSync ? new Date(moodleLastSync).getTime() : 0;
        if (Date.now() - lastMoodleSync > 30 * 60 * 1000) {
          syncMoodleData();
        }
      });
    }
  }, [isIdle, syncOfflineData, syncMoodleData, moodleLastSync]);

  if (maintenanceMode) {
    return (
      <Suspense fallback={<AISuspenseFallback />}>
        <ComponentRegistry.Maintenance />
      </Suspense>
    );
  }

  return (
    <div className={`ai-enterprise-app theme-${theme} ${isOnline ? 'online' : 'offline'} ai-enhanced`}>
      <AIRouteTracker />
      <SecurityMonitor />
      <MoodleSyncStatus />
      
      {import.meta.env.NODE_ENV === 'development' && (
        <>
          <PerformanceMonitor />
          <MemoryMonitor />
        </>
      )}
      
      <AccessibilityToolbar />
      <VoiceCommandInterface />
      <AINavigationAssistant />
      <ConnectionManager />
      <ConnectionNotificationPanel />
      <MoodleProgressTracker />
      <TutorialOverlay />
      
      <Toaster 
        position="top-right"
        containerClassName="ai-enterprise-toaster"
        toastOptions={{
          duration: 6000,
          style: {
            background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
            border: `1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'}`,
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
            maxWidth: '400px'
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
            style: {
              borderLeft: '4px solid #10B981',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
            style: {
              borderLeft: '4px solid #EF4444',
            },
          },
          loading: {
            iconTheme: {
              primary: '#6366F1',
              secondary: '#fff',
            },
          },
        }}
      />
      <NotificationCenter />

      <Layout>
        <EnhancedSidebar />
        <QuickActionsPanel />
        
        <div className="ai-main-content">
          <Routes>
            {routeConfig.public.map(route => createAIEnhancedRouteElement(route, false))}
            {routeConfig.protected.map(route => createAIEnhancedRouteElement(route, true))}
            {routeConfig.error.map(route => createAIEnhancedRouteElement(route, false))}
            
            <Route 
              path="/dashboard/ai-redirect" 
              element={
                <RoleBasedRoute>
                  <AIRoleBasedRedirect />
                </RoleBasedRoute>
              } 
            />
            
            <Route 
              path="*" 
              element={
                maintenanceMode ? (
                  <Navigate to="/maintenance" replace />
                ) : (
                  <ComponentRegistry.NotFound />
                )
              } 
            />
          </Routes>
        </div>
      </Layout>
    </div>
  );
}

// ========== Helper Functions ==========
function calculatePerformanceScore(metrics) {
  const weights = {
    firstRender: 0.25,
    interactionCount: 0.2,
    predictionAccuracy: 0.25,
    anomalyDetected: 0.15,
    moodleSyncImpact: 0.15
  };

  let score = 0;
  score += (1 - Math.min(metrics.firstRender / 1000, 1)) * weights.firstRender;
  score += Math.min(metrics.interactionCount / 10, 1) * weights.interactionCount;
  score += (metrics.predictionAccuracy / 100) * weights.predictionAccuracy;
  score += (metrics.anomalyDetected ? 0 : 1) * weights.anomalyDetected;
  score += (1 - Math.min(metrics.moodleSyncImpact / 100, 1)) * weights.moodleSyncImpact;

  return Math.round(score * 100);
}

function calculateMoodleOptimization(metrics) {
  const moodleImpact = metrics.moodleSyncImpact || 0;
  if (moodleImpact < 10) return 'optimal';
  if (moodleImpact < 25) return 'good';
  if (moodleImpact < 50) return 'moderate';
  return 'needs_optimization';
}

// ========== Root App Component ==========
function App() {
  return (
    <ErrorBoundary 
      fallback={({ error, resetErrorBoundary }) => (
        <AIErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      onError={(error, errorInfo) => {
        trackEvent('ai_enterprise_app_crash', {
          error: error.toString(),
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          ai_recovery_attempted: true,
          moodle_integration_status: localStorage.getItem('moodle_linked') || 'unknown',
          active_connections: JSON.parse(localStorage.getItem('active_connections') || '[]').length,
          timestamp: new Date().toISOString()
        });
      }}
    >
      <AppProviders>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AIAppContent />
        </Router>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default React.memo(App);
