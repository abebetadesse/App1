import React from "react";
/* eslint-disable no-unused-vars */
// src/components/layout/Sidebar.jsx
import { Nav, Offcanvas } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const profileOwnerMenu = [
    { path: '/profile-owner/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/profile-owner/enhanced-profile', label: 'My Profile', icon: 'bi-person' },
    { path: '/profile-owner/documents', label: 'Documents', icon: 'bi-files' },
    { path: '/profile-owner/courses', label: 'Courses', icon: 'bi-book' },
    { path: '/profile-owner/connections', label: 'Connections', icon: 'bi-people' },
  ];

  const clientMenu = [
    { path: '/client/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/client/enhanced-search', label: 'Find Professionals', icon: 'bi-search' },
    { path: '/client/connections', label: 'My Connections', icon: 'bi-people' },
  ];

  const adminMenu = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/admin/users', label: 'User Management', icon: 'bi-people' },
    { path: '/admin/ranking', label: 'Ranking System', icon: 'bi-trophy' },
    { path: '/admin/analytics', label: 'Analytics', icon: 'bi-graph-up' },
    { path: '/admin/field-management', label: 'Field Manager', icon: 'bi-list-check' },
  ];

  const getMenuItems = () => {
    switch(user?.role) {
      case 'profile_owner': return profileOwnerMenu;
      case 'client': return clientMenu;
      case 'admin': return adminMenu;
      default: return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <Offcanvas show={isOpen} onHide={onClose} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className="bi bi-briefcase me-2"></i>
            Navigation
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Nav className="flex-column">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                onClick={onClose}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <i className={`${item.icon} me-2`}></i>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block sidebar-desktop">
        <div className="sidebar-sticky">
          <Nav className="flex-column">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <i className={`${item.icon} me-2`}></i>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;