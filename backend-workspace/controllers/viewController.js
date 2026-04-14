/**
 * View Controller - Handles view rendering and page logic
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Render dashboard view
export const dashboard = (req, res) => {
  try {
    // Check if user is authenticated
    const isAuthenticated = req.session.userId ? true : false;
    
    // Dashboard data
    const dashboardData = {
      title: 'Tham Platform Dashboard',
      user: req.session.user || null,
      isAuthenticated,
      timestamp: new Date().toISOString(),
      menu: [
        { name: 'Dashboard', path: '/dashboard', icon: 'home' },
        { name: 'Profile', path: '/profile', icon: 'user' },
        { name: 'Settings', path: '/settings', icon: 'settings' },
      ],
      stats: {
        totalUsers: 0,
        activeSessions: 0,
        uptime: process.uptime(),
      },
    };

    // Send JSON response (or render HTML if using templates)
    res.json({
      success: true,
      message: 'Dashboard data retrieved',
      data: dashboardData,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Render login view
export const login = (req, res) => {
  try {
    // If already logged in, redirect to dashboard
    if (req.session.userId) {
      return res.redirect('/dashboard');
    }

    const loginData = {
      title: 'Login - Tham Platform',
      isAuthenticated: false,
      csrfToken: req.csrfToken ? req.csrfToken() : null,
      timestamp: new Date().toISOString(),
      loginMethods: ['email', 'username'],
      rememberMe: true,
    };

    // Send JSON response
    res.json({
      success: true,
      message: 'Login page data',
      data: loginData,
    });
  } catch (error) {
    console.error('Login view error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Render profile view
export const profile = (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const profileData = {
      title: 'User Profile',
      user: req.session.user || {},
      isAuthenticated: true,
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Profile data retrieved',
      data: profileData,
    });
  } catch (error) {
    console.error('Profile view error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Logout user
export const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({
          success: false,
          message: 'Logout failed',
        });
      }

      res.clearCookie('connect.sid');
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export default {
  dashboard,
  login,
  profile,
  logout,
};