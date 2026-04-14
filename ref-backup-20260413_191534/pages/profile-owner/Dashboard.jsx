import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

const ProfileOwnerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'User'}!</h1>
        <Button to="/profile-owner/edit" variant="outline">Edit Profile</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Profile Views', value: '1,234', change: '+12%' },
          { label: 'Proposals Sent', value: '45', change: '+5' },
          { label: 'Active Contracts', value: '3', change: '' },
          { label: 'Success Score', value: '94%', change: '+2%' },
        ].map((stat, i) => (
          <div key={i} className="card p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
            {stat.change && <p className="text-sm text-green-600 mt-2">{stat.change}</p>}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">Recent Activity</div>
        <div className="card-body">
          <div className="space-y-3">
            {['New proposal viewed', 'Contract started with ABC Corp', 'Course completed: Advanced React'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <span className="flex-1">{item}</span>
                <span className="text-sm text-gray-500">2h ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Moodle Courses */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <span>Recommended Courses (Moodle)</span>
          <Button variant="ghost" size="sm" to="/profile-owner/courses">View All</Button>
        </div>
        <div className="card-body grid md:grid-cols-3 gap-4">
          {[
            { title: 'Advanced UI/UX', progress: 60 },
            { title: 'Python for Data Science', progress: 30 },
            { title: 'Project Management', progress: 85 },
          ].map((course, i) => (
            <div key={i} className="border rounded-lg p-4">
              <h4 className="font-semibold">{course.title}</h4>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-indigo-600 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{course.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileOwnerDashboard;
