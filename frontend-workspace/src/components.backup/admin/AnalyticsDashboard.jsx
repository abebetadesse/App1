import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const AnalyticsDashboard = forwardRef((props, ref) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } })
      .then(res => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center"><Spinner /></div>;

  const userChart = { labels: ['Clients', 'Profile Owners', 'Admins'], datasets: [{ data: [stats.clients, stats.profileOwners, stats.admins], backgroundColor: ['#3b82f6', '#10b981', '#ef4444'] }] };
  const growthData = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'User Growth', data: [10, 15, 25, 40, 55, 80], borderColor: '#6366f1' }] };

  return (
    <div>
      <Row className="mb-4">
        <Col md={3}><Card className="text-center"><Card.Body><h2>{stats.totalUsers}</h2><p>Total Users</p></Card.Body></Card></Col>
        <Col md={3}><Card className="text-center"><Card.Body><h2>{stats.totalJobs}</h2><p>Active Jobs</p></Card.Body></Card></Col>
        <Col md={3}><Card className="text-center"><Card.Body><h2>{stats.totalProposals}</h2><p>Proposals</p></Card.Body></Card></Col>
        <Col md={3}><Card className="text-center"><Card.Body><h2>${stats.revenue}</h2><p>Revenue</p></Card.Body></Card></Col>
      </Row>
      <Row>
        <Col md={6}><Card><Card.Header>User Distribution</Card.Header><Card.Body><Doughnut data={userChart} /></Card.Body></Card></Col>
        <Col md={6}><Card><Card.Header>User Growth</Card.Header><Card.Body><Line data={growthData} /></Card.Body></Card></Col>
      </Row>
    </div>
  );
}
AnalyticsDashboard.displayName = 'AnalyticsDashboard';
