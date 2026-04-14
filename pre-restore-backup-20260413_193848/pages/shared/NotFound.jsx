import React from "react";
/* eslint-disable no-unused-vars */
// src/pages/shared/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = ({ type = 'not_found' }) => {
  const messages = {
    not_found: {
      title: 'Page Not Found',
      message: 'The page you are looking for does not exist.',
      buttonText: 'Go Home'
    },
    unauthorized: {
      title: 'Access Denied',
      message: 'You do not have permission to access this page.',
      buttonText: 'Go to Dashboard'
    }
  };

  const { title, message, buttonText } = messages[type];

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body py-5">
                <i className="bi bi-exclamation-triangle text-warning display-1 mb-4"></i>
                <h1 className="display-4 fw-bold text-dark mb-3">{title}</h1>
                <p className="lead text-muted mb-4">{message}</p>
                <Link to="/" className="btn btn-primary btn-lg">
                  {buttonText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;