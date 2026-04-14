import React from "react";
/* eslint-disable no-unused-vars */
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={6} className="mx-auto">
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center p-5">
              <div className="mb-4">
                <i className="fas fa-lock fa-5x text-danger"></i>
              </div>
              
              <h1 className="display-4 fw-bold text-muted">401</h1>
              <h3 className="mb-3">Access Denied</h3>
              
              <p className="text-muted mb-4">
                {user ? (
                  <>
                    Your account (<strong>{user.email}</strong>) doesn't have 
                    permission to access this page. Please contact an administrator 
                    if you believe this is an error.
                  </>
                ) : (
                  <>
                    You need to be logged in to access this page. 
                    Please sign in to continue.
                  </>
                )}
              </p>

              <div className="d-flex gap-3 justify-content-center">
                {user ? (
                  <>
                    <Button 
                      as={Link} 
                      to="/dashboard" 
                      variant="primary"
                      className="px-4"
                    >
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Go to Dashboard
                    </Button>
                    
                    <Button 
                      onClick={handleLogout}
                      variant="outline-danger"
                      className="px-4"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      as={Link} 
                      to="/login" 
                      variant="primary"
                      className="px-4"
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </Button>
                    
                    <Button 
                      as={Link} 
                      to="/register" 
                      variant="outline-primary"
                      className="px-4"
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      Create Account
                    </Button>
                  </>
                )}
              </div>

              {user && (
                <div className="mt-4">
                  <small className="text-muted">
                    Current role: <strong>{user.role}</strong>
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Role Information */}
          <Card className="mt-4 shadow-sm border-0">
            <Card.Body>
              <h6 className="mb-3">Available Roles & Permissions</h6>
              <Row>
                <Col md={4} className="mb-3">
                  <div className="p-3 border rounded">
                    <h6 className="text-primary">Client</h6>
                    <small className="text-muted">
                      • Search professionals<br/>
                      • Create projects<br/>
                      • Manage connections
                    </small>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="p-3 border rounded">
                    <h6 className="text-success">Profile Owner</h6>
                    <small className="text-muted">
                      • Manage profile<br/>
                      • Complete courses<br/>
                      • Receive connections
                    </small>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="p-3 border rounded">
                    <h6 className="text-danger">Admin</h6>
                    <small className="text-muted">
                      • Manage users<br/>
                      • System settings<br/>
                      • View analytics
                    </small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized;