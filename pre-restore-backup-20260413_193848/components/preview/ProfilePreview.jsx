import React, { useState } from 'react';
import { Modal, Card, Button, Badge } from 'react-bootstrap';

const ProfilePreview = forwardRef(ProfilePreview);
export default function ProfilePreview({ show, onHide, profile }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton><Modal.Title>Profile Preview</Modal.Title></Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
            <h3>{profile?.name}</h3>
            <p><strong>Category:</strong> {profile?.category}</p>
            <p><strong>Experience:</strong> {profile?.experience} years</p>
            <p><strong>Hourly Rate:</strong> ${profile?.hourlyRate}</p>
            <p><strong>Rating:</strong> ⭐ {profile?.rating}</p>
            <p><strong>Bio:</strong> {profile?.bio}</p>
            <Badge bg="info">Trust Score: {profile?.trustScore}</Badge>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
}
ProfilePreview.displayName = 'ProfilePreview';
