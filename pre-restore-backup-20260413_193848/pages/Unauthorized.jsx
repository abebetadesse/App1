import React from "react";
/* eslint-disable no-unused-vars */
// src/pages/Unauthorized.jsx
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Unauthorized = () => {
  return (
    <Container>
      <Row className="justify-content-center py-5">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body className="py-5">
              <div className="mb-4">
                <i className="bi bi-shield-exclamation display-1 text-warning"></i>
              </div>
              <h2 className="mb-3">Access Denied</h2>
              <p className="text-muted mb-4">
                You don't have permission to access this page.
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

export default Unauthorized;