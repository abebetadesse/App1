import React from "react";
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ConnectionManager from '../pages/client/ConnectionManager';
import MoodleAdmin from '../pages/admin/MoodleAdmin';
import { healthCheck } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('connections');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const checkBackend = async () => {
      const result = await healthCheck();
      setBackendStatus(result.success ? 'connected' : 'disconnected');
    };
    
    checkBackend();
    // Check backend every minute
    const interval = setInterval(checkBackend, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>Tham AI Platform</h1>
            <span className="tagline">AI-Powered Professional Matching</span>
          </div>
          <div className="user-section">
            <span className="user-name">Welcome, {user?.name || 'User'}</span>
            <span className={`backend-status ${backendStatus}`}>
              Backend: {backendStatus}
            </span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'connections' ? 'active' : ''}`}
          onClick={() => setActiveTab('connections')}
        >
          🤝 Connections
        </button>
        <button 
          className={`nav-btn ${activeTab === 'moodle' ? 'active' : ''}`}
          onClick={() => setActiveTab('moodle')}
        >
          📚 Moodle Admin
        </button>
        <button 
          className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 Find Professionals
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === 'connections' && <ConnectionManager />}
        {activeTab === 'moodle' && <MoodleAdmin />}
        {activeTab === 'search' && <SearchProfessionals />}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <span>Tham AI Platform v1.0</span>
          <span>Backend: {import.meta.env.VITE_API_BASE_URL}</span>
          <span className={`status ${backendStatus}`}>
            Status: {backendStatus}
          </span>
        </div>
      </footer>
    </div>
  );
};

// Placeholder component
const SearchProfessionals = () => (
  <div className="tab-content">
    <h2>Find Professionals</h2>
    <p>AI-powered search functionality coming soon...</p>
    <div className="demo-note">
      <strong>Backend Connection:</strong> {import.meta.env.VITE_API_BASE_URL}
    </div>
  </div>
);

export default Dashboard;