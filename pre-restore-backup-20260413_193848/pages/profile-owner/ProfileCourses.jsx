import React from "react";
/* eslint-disable no-unused-vars */
// src/pages/profile-owner/ProfileCourses.jsx
import { Link } from 'react-router-dom';

const ProfileCourses = () => {
  const courses = [
    { id: 1, name: 'Advanced JavaScript', status: 'completed', grade: 95 },
    { id: 2, name: 'React Development', status: 'in_progress', grade: null },
    { id: 3, name: 'Node.js Backend', status: 'enrolled', grade: null }
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
                <h3 className="mb-0">My Courses</h3>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h5>Moodle LMS Integration</h5>
                  <p className="text-muted">
                    Take professional courses on our Moodle platform to improve your ranking and skills.
                  </p>
                  <a 
                    href="https://k4b.et" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-warning"
                  >
                    <i className="bi bi-mortarboard me-2"></i>
                    Go to Moodle LMS
                  </a>
                </div>

                <div>
                  <h5>Course Progress</h5>
                  <div className="list-group">
                    {courses.map(course => (
                      <div key={course.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{course.name}</h6>
                            <small className={`badge ${
                              course.status === 'completed' ? 'bg-success' :
                              course.status === 'in_progress' ? 'bg-warning' : 'bg-secondary'
                            }`}>
                              {course.status.replace('_', ' ')}
                            </small>
                            {course.grade && (
                              <small className="text-muted ms-2">Grade: {course.grade}%</small>
                            )}
                          </div>
                          <div>
                            {course.status === 'enrolled' && (
                              <button className="btn btn-sm btn-primary">Start Course</button>
                            )}
                            {course.status === 'in_progress' && (
                              <button className="btn btn-sm btn-warning">Continue</button>
                            )}
                            {course.status === 'completed' && (
                              <button className="btn btn-sm btn-success">View Certificate</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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

export default ProfileCourses;