import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit, TrendingUp } from 'lucide-react';
import StatsWidget from '../../components/widgets/StatsWidget';

const ProfileOwnerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/profile-owner/edit" className="btn-secondary">
            <Edit size={18} className="mr-2" /> Edit Profile
          </Link>
          <Link to="/profile-owner/find-work" className="btn-premium">
            <Search size={18} className="mr-2" /> Find Work
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatsWidget title="Profile Views" value="1,432" icon={Eye} trend={12} />
        <StatsWidget title="Proposals Sent" value="23" icon={FileText} trend={5} />
        <StatsWidget title="Success Score" value="94%" icon={TrendingUp} trend={2} />
      </div>

      <div className="widget">
        <div className="widget-header">Recent Proposals</div>
        {['Web Development', 'Logo Design'].map((job, i) => (
          <div key={i} className="flex justify-between py-3">
            <span>{job}</span>
            <span className="text-yellow-600">Pending</span>
          </div>
        ))}
        <Link to="/profile-owner/proposals" className="block text-center text-indigo-600 mt-4">View All →</Link>
      </div>
    </div>
  );
};
export default ProfileOwnerDashboard;
