import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsWidget = ({ title, value, icon: Icon, trend, color = 'indigo' }) => (
  <div className="widget">
    <div className="widget-header">
      <span>{title}</span>
      <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
        <Icon size={20} className={`text-${color}-600 dark:text-${color}-400`} />
      </div>
    </div>
    <div className="text-3xl font-bold">{value}</div>
    {trend && (
      <div className={`flex items-center gap-1 text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{Math.abs(trend)}% from last month</span>
      </div>
    )}
  </div>
);
export default StatsWidget;
