import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Search, Star, ChevronLeft, ChevronRight, Users, Settings, FileText, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const EnhancedSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const clientMenu = [
    { to: '/client/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/client/post-job', icon: Briefcase, label: 'Post a Job' },
    { to: '/client/search', icon: Search, label: 'Find Talent' },
    { to: '/client/projects', icon: FileText, label: 'My Projects' },
    { to: '/client/saved', icon: Star, label: 'Saved' },
  ];

  const freelancerMenu = [
    { to: '/profile-owner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile-owner/find-work', icon: Search, label: 'Find Work' },
    { to: '/profile-owner/proposals', icon: FileText, label: 'My Proposals' },
    { to: '/profile-owner/contracts', icon: Briefcase, label: 'Contracts' },
    { to: '/profile-owner/courses', icon: BookOpen, label: 'Courses' },
  ];

  const menuItems = user?.role === 'client' ? clientMenu : freelancerMenu;

  return (
    <motion.aside 
      animate={{ width: collapsed ? '5rem' : '16rem' }}
      className="sidebar h-screen sticky top-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-r border-gray-200/50 dark:border-slate-700/50"
    >
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-white dark:bg-slate-700 rounded-full p-1 shadow-md border"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <nav className="py-6 space-y-1">
        {menuItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon size={20} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};
export default EnhancedSidebar;
