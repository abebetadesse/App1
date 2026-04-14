import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Briefcase, Search, MessageSquare, Bell, LayoutDashboard, 
  FileText, BarChart3, BookOpen, Star
} from 'lucide-react';

const TabNavigation = ({ role }) => {
  const clientTabs = [
    { to: '/client/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/client/post-job', icon: Briefcase, label: 'Post a Job' },
    { to: '/client/search', icon: Search, label: 'Find Talent' },
    { to: '/client/projects', icon: FileText, label: 'My Projects' },
    { to: '/client/saved', icon: Star, label: 'Saved Talent' },
    { to: '/client/reports', icon: BarChart3, label: 'Reports' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const freelancerTabs = [
    { to: '/profile-owner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile-owner/find-work', icon: Search, label: 'Find Work' },
    { to: '/profile-owner/proposals', icon: FileText, label: 'My Proposals' },
    { to: '/profile-owner/contracts', icon: Briefcase, label: 'Contracts' },
    { to: '/profile-owner/courses', icon: BookOpen, label: 'Courses' },
    { to: '/profile-owner/earnings', icon: BarChart3, label: 'Earnings' },
    { to: '/profile-owner/reviews', icon: Star, label: 'Reviews' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
  ];

  const tabs = role === 'client' ? clientTabs : freelancerTabs;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
                  }`
                }
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
