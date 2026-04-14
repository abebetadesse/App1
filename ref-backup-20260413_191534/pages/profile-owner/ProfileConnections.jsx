import React from "react";
/* eslint-disable no-unused-vars */
// src/pages/profile-owner/ProfileConnections.jsx
import { Link } from 'react-router-dom';

const ProfileConnections = () => {
  const connections = [
    { id: 1, clientName: 'ABC Company', date: '2024-01-15', status: 'successful' },
    { id: 2, clientName: 'XYZ Corp', date: '2024-01-10', status: 'contacted' },
    { id: 3, clientName: 'Tech Solutions', date: '2024-01-08', status: 'initiated' }
  ];

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            Tham Platform
          </Link>
          <div className="navbar-nav ms-auto">
            <Link to="/profile-owner/dashboard" className="btn btn-outline-light btn-sm">Back to Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="mb-0">My Connections</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {connections.map(connection => (
                        <tr key={connection.id}>
                          <td>{connection.clientName}</td>
                          <td>{connection.date}</td>
                          <td>
                            <span className={`badge ${
                              connection.status === 'successful' ? 'bg-success' :
                              connection.status === 'contacted' ? 'bg-warning' : 'bg-info'
                            }`}>
                              {connection.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileConnections;