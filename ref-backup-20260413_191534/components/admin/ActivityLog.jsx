import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/admin/activity-logs', { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } })
      .then(res => res.json())
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  return (
    <Table striped bordered hover>
      <thead><tr><th>User</th><th>Action</th><th>Time</th></tr></thead>
      <tbody>
        {logs.map(log => (
          <tr key={log._id}>
            <td>{log.userId?.name || log.userId?.email || 'Unknown'}</td>
            <td>{log.action}</td>
            <td>{new Date(log.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
