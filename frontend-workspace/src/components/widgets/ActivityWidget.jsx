import React from 'react';

const ActivityWidget = ({ activities }) => (
  <div className="widget">
    <div className="widget-header">Recent Activity</div>
    <div className="space-y-3">
      {activities.map((act, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500"></div>
          <div className="flex-1">
            <p className="text-sm">{act.description}</p>
            <p className="text-xs text-gray-500">{act.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default ActivityWidget;
