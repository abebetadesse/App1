import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Bell, Sun, Moon, LogOut, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-slate-700/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold gradient-text">Tham</Link>
        
        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100/80 dark:bg-slate-700/80 border-0 rounded-full focus:ring-2 focus:ring-indigo-500"
              onKeyPress={(e) => e.key === 'Enter' && navigate(`/search?q=${e.target.value}`)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-slate-700/50">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user && (
            <>
              <button onClick={() => navigate('/notifications')} className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-slate-700/50 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button onClick={() => navigate('/settings')} className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-slate-700/50">
                <Settings size={20} />
              </button>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-slate-700/50 text-red-500">
                <LogOut size={20} />
              </button>
            </>
          )}
          
          {user ? (
            <button onClick={() => navigate(user.role === 'client' ? '/client/dashboard' : '/profile-owner/dashboard')} 
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {user.email?.[0].toUpperCase()}
              </div>
            </button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};
export default Header;
