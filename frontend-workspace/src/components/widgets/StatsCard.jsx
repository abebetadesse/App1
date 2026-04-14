import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    error: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };

  return (
    <div className="stats-card">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="stats-value">{value}</p>
      <p className="stats-label">{title}</p>
    </div>
  );
};

export default StatsCard;
