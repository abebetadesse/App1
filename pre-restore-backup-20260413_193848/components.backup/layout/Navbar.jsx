import React from "react";
/* eslint-disable no-unused-vars */
// src/components/layout/Navbar.jsx
import { Navbar as BSNavbar, Nav, Container, Button, Dropdown, Badge } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleDisplayName = (role) => {
    switch(role) {
      case 'profile_owner': return 'Professional';
      case 'client': return 'Client';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  return (
    <BSNavbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        {/* Brand & Sidebar Toggle */}
        <div className="d-flex align-items-center">
          {user && (
            <Button
              variant="outline-light"
              className="me-2 d-lg-none"
              onClick={onToggleSidebar}
            >
              <i className="bi bi-list"></i>
            </Button>
          )}
          <BSNavbar.Brand as={Link} to="/" className="fw-bold">
            <i className="bi bi-briefcase me-2"></i>
            Tham Platform
          </BSNavbar.Brand>
        </div>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/login" active={location.pathname === '/login'}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" active={location.pathname === '/register'}>
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/dashboard" active={location.pathname === '/dashboard'}>
                  Dashboard
                </Nav.Link>
                {user.role === 'profile_owner' && (
                  <>
                    <Nav.Link as={Link} to="/profile-owner/enhanced-profile" active={location.pathname.includes('/profile-owner')}>
                      My Profile
                    </Nav.Link>
                    <Nav.Link as={Link} to="/profile-owner/courses" active={location.pathname === '/profile-owner/courses'}>
                      Courses
                    </Nav.Link>
                  </>
                )}
                {user.role === 'client' && (
                  <Nav.Link as={Link} to="/client/enhanced-search" active={location.pathname.includes('/client')}>
                    Find Professionals
                  </Nav.Link>
                )}
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin/dashboard" active={location.pathname.includes('/admin')}>
                    Admin Panel
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>

          {/* User Menu */}
          <Nav className="ms-auto">
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="user-dropdown">
                  <i className="bi bi-person-circle me-2"></i>
                  {user.name || user.email}
                  <Badge bg="light" text="dark" className="ms-2">
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>
                    Signed in as {user.email}
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person me-2"></i>
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings">
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="outline-light" size="sm">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="light" size="sm">
                  Sign Up
                </Button>
              </div>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;