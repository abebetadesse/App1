import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, MessageSquare } from 'lucide-react';
import StatsWidget from '../../components/widgets/StatsWidget';
import ActivityWidget from '../../components/widgets/ActivityWidget';

const ClientDashboard = () => {
  const stats = [
    { title: 'Active Jobs', value: '5', icon: Briefcase, trend: 12 },
    { title: 'Total Spent', value: '$12,450', icon: DollarSign, trend: 8 },
    { title: 'Hired', value: '8', icon: Users, trend: -3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/client/post-job" className="btn-premium">
          <Plus size={18} className="mr-2" /> Post a Job
        </Link>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((s, i) => <StatsWidget key={i} {...s} />)}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="widget">
          <div className="widget-header">Recent Job Postings</div>
          {['React Developer', 'UI Designer'].map((job, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
              <span>{job}</span>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"><Eye size={16} /></button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"><MessageSquare size={16} /></button>
              </div>
            </div>
          ))}
          <Link to="/client/projects" className="block text-center text-indigo-600 mt-4">View All →</Link>
        </div>
        <ActivityWidget activities={[{description: 'New proposal received', time: '2h ago'}]} />
      </div>
    </div>
  );
};
export default ClientDashboard;
