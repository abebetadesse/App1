import React from "react";
/* eslint-disable no-unused-vars */
// src/pages/NotFound.jsx
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NotFound = () => {
  return (
    <Container>
      <Row className="justify-content-center py-5">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body className="py-5">
              <div className="mb-4">
                <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
              </div>
              <h2 className="mb-3">Page Not Found</h2>
              <p className="text-muted mb-4">
                The page you're looking for doesn't exist.
              </p>
              <Button as={Link} to="/" variant="primary">
                Go Home
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;