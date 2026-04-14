import React from "react";
/* eslint-disable no-unused-vars */
// src/components/common/NotificationContainer.jsx
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  const getVariant = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  return (
    <ToastContainer 
      position="top-end" 
      className="p-3"
      style={{ zIndex: 1055 }}
    >
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          bg={getVariant(notification.type)}
          onClose={() => removeNotification(notification.id)}
          delay={notification.duration}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">{notification.title}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {notification.message}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default NotificationContainer;