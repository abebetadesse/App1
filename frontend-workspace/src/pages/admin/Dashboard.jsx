import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, BarChart } from 'lucide-react';

const AdminDashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
    <div className="grid md:grid-cols-3 gap-6">
      <Link to="/admin/users" className="widget p-6 text-center">
        <Users size={48} className="mx-auto mb-4 text-indigo-600" />
        <h3 className="font-bold">User Management</h3>
      </Link>
      <Link to="/admin/ranking" className="widget p-6 text-center">
        <Award size={48} className="mx-auto mb-4 text-purple-600" />
        <h3 className="font-bold">Ranking Criteria</h3>
      </Link>
      <Link to="/admin/analytics" className="widget p-6 text-center">
        <BarChart size={48} className="mx-auto mb-4 text-green-600" />
        <h3 className="font-bold">Analytics</h3>
      </Link>
    </div>
  </div>
);
export default AdminDashboard;
