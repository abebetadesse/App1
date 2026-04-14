import React from "react";
/* eslint-disable no-unused-vars */
// src/pages/admin/Analytics.jsx
import { Link } from 'react-router-dom';

const AdminAnalytics = () => {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            Tham Platform
          </Link>
          <div className="navbar-nav ms-auto">
            <Link to="/admin/dashboard" className="btn btn-outline-light btn-sm">Back to Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="mb-0">Platform Analytics</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h5>Connection Statistics</h5>
                    <div className="card">
                      <div className="card-body">
                        <p>Total Connections: <strong>245</strong></p>
                        <p>Successful Connections: <strong>189</strong></p>
                        <p>Success Rate: <strong>77%</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <h5>User Statistics</h5>
                    <div className="card">
                      <div className="card-body">
                        <p>Total Users: <strong>150</strong></p>
                        <p>Profile Owners: <strong>89</strong></p>
                        <p>Clients: <strong>61</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <h5>Recent Activity</h5>
                    <div className="card">
                      <div className="card-body">
                        <p className="text-muted">Platform activity and usage statistics will be displayed here.</p>
                        <ul className="list-group">
                          <li className="list-group-item">New user registration: John Smith (Client)</li>
                          <li className="list-group-item">Profile owner completed course: Advanced JavaScript</li>
                          <li className="list-group-item">New connection established: ABC Company → Jane Doe</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;