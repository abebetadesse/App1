import React from "react";
/* eslint-disable no-unused-vars */
// src/components/LoadingScreen.jsx
import { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [moodleConnected, setMoodleConnected] = useState(false);

  useEffect(() => {
    // Simulate loading process
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        return prev + 1;
      });

      // Simulate Moodle connection at 20%
      if (progress >= 20 && !moodleConnected) {
        setMoodleConnected(true);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [progress, moodleConnected, onLoadingComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-header">
          <h1>Initializing Tham AI Platform</h1>
          <p>Preparing your AI-enhanced professional matching experience with Moodle integration...</p>
        </div>

        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <span>AI-Powered Matching</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📚</span>
            <span>Moodle LMS Integration</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⭐</span>
            <span>Smart Rankings</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span>Real-time Connections</span>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span>Loading AI Components</span>
            <span className="progress-percent">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="status-indicators">
          <div className={`status-item ${moodleConnected ? 'connected' : 'connecting'}`}>
            <span className="status-dot"></span>
            <span>Moodle: {moodleConnected ? 'LMS Connected' : 'Connecting...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;