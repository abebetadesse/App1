import React from "react";
/* eslint-disable no-unused-vars */

const AdminUsers = () => {
  const users = [
    {
      id: 1,
      email: 'john.doe@example.com',
      role: 'profile_owner',
      status: 'active',
      registrationDate: '2024-01-15',
      lastLogin: '2024-03-20'
    },
    {
      id: 2,
      email: 'sarah.smith@example.com',
      role: 'client',
      status: 'active',
      registrationDate: '2024-02-01',
      lastLogin: '2024-03-19'
    },
    {
      id: 3,
      email: 'mike.johnson@example.com',
      role: 'profile_owner',
      status: 'inactive',
      registrationDate: '2024-01-20',
      lastLogin: '2024-02-15'
    }
  ];

  const getRoleBadge = (role) => {
    const roleConfig = {
      profile_owner: { class: 'bg-primary', text: 'Professional' },
      client: { class: 'bg-success', text: 'Client' },
      admin: { class: 'bg-dark', text: 'Admin' }
    };
    const config = roleConfig[role] || roleConfig.client;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <span className="badge bg-success">Active</span>
      : <span className="badge bg-secondary">Inactive</span>;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <div>
                <h4 className="card-title mb-0">
                  <i className="bi bi-people me-2"></i>
                  User Management
                </h4>
                <p className="text-muted mb-0">
                  Manage platform users and their permissions
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="bi bi-download me-2"></i>
                  Export
                </button>
                <button className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add User
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Registration Date</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>
                          <strong>{user.email}</strong>
                        </td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td>{getStatusBadge(user.status)}</td>
                        <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                        <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-outline-warning">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-outline-danger">
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
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
  );
};

export default AdminUsers;