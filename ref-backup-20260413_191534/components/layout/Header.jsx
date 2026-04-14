import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationBell from '../notifications/NotificationBell';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <nav className="container-custom flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Tham
          </Link>
          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/browse" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600">Browse</Link>
              {user.role === 'client' && <Link to="/client/post-job" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600">Post Job</Link>}
              {user.role === 'profile_owner' && <Link to="/profile-owner/courses" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600">Courses</Link>}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="btn-ghost p-2">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          {user ? (
            <>
              <NotificationBell />
              <div className="relative">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold">
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </div>
                </button>
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
