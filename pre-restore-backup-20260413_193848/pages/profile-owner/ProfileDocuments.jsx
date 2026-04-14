import React from "react";
/* eslint-disable no-unused-vars */
// src/pages/profile-owner/ProfileDocuments.jsx
import { Link } from 'react-router-dom';

const ProfileDocuments = () => {
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
                <h3 className="mb-0">My Documents</h3>
              </div>
              <div className="card-body">
                <p className="text-muted">Upload and manage your professional documents.</p>
                
                <div className="mb-4">
                  <h5>Upload New Document</h5>
                  <div className="border rounded p-4 text-center">
                    <i className="bi bi-cloud-upload display-4 text-muted mb-3"></i>
                    <p className="text-muted">Drag and drop files here or click to browse</p>
                    <button className="btn btn-primary">Select Files</button>
                  </div>
                </div>

                <div>
                  <h5>Uploaded Documents</h5>
                  <div className="list-group">
                    <div className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                        Resume.pdf
                      </div>
                      <div>
                        <button className="btn btn-sm btn-outline-primary me-1">View</button>
                        <button className="btn btn-sm btn-outline-danger">Delete</button>
                      </div>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-file-earmark-text text-primary me-2"></i>
                        Certifications.docx
                      </div>
                      <div>
                        <button className="btn btn-sm btn-outline-primary me-1">View</button>
                        <button className="btn btn-sm btn-outline-danger">Delete</button>
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

export default ProfileDocuments;