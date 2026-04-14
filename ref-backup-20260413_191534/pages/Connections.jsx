import React from "react";
/* eslint-disable no-unused-vars */
import { Container, Row, Col, Card, Button, Badge, Tab, Nav, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
const Connections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        // TODO: Replace with actual API call
        setTimeout(() => {
          const mockConnections = [
            {
              id: 1,
              type: user?.role === 'client' ? 'profile_owner' : 'client',
              name: user?.role === 'client' ? 'John Developer' : 'ABC Company',
              serviceCategory: 'Web Development',
              connectionDate: '2023-12-15',
              status: 'successful',
              lastContact: '2 days ago',
              clientRating: 5,
              notes: 'Great communication and delivered on time'
            },
            {
              id: 2,
              type: user?.role === 'client' ? 'profile_owner' : 'client',
              name: user?.role === 'client' ? 'Sarah Designer' : 'XYZ Corp',
              serviceCategory: 'UI/UX Design',
              connectionDate: '2023-12-10',
              status: 'contacted',
              lastContact: '1 week ago',
              clientRating: null,
              notes: 'Initial discussion completed'
            },
            {
              id: 3,
              type: user?.role === 'client' ? 'profile_owner' : 'client',
              name: user?.role === 'client' ? 'Mike Consultant' : 'Startup Inc',
              serviceCategory: 'Business Consulting',
              connectionDate: '2023-12-05',
              status: 'initiated',
              lastContact: null,
              clientRating: null,
              notes: 'Waiting for response'
            }
          ];
          setConnections(mockConnections);
          setFilteredConnections(mockConnections);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching connections:', error);
        setLoading(false);
      }
    };

    fetchConnections();
  }, [user?.role]);

  useEffect(() => {
    let filtered = connections;
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(conn => conn.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(conn => 
        conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredConnections(filtered);
  }, [connections, activeTab, searchTerm]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'successful': return 'success';
      case 'contacted': return 'warning';
      case 'initiated': return 'secondary';
      case 'failed': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'successful': return 'Successful';
      case 'contacted': return 'Contacted';
      case 'initiated': return 'Initiated';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">Connections</h1>
              <p className="text-muted mb-0">
                Manage your professional connections and communication history
              </p>
            </div>
            <Button as={Link} to="/search" variant="primary">
              {user?.role === 'client' ? 'Find More Professionals' : 'Find More Clients'}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Stats Overview */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <h3 className="text-primary">{connections.length}</h3>
              <p className="text-muted mb-0">Total Connections</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <h3 className="text-success">
                {connections.filter(c => c.status === 'successful').length}
              </h3>
              <p className="text-muted mb-0">Successful</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <h3 className="text-warning">
                {connections.filter(c => c.status === 'contacted').length}
              </h3>
              <p className="text-muted mb-0">In Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <h3 className="text-info">
                {Math.round(
                  (connections.filter(c => c.status === 'successful').length / 
                   Math.max(connections.length, 1)) * 100
                )}%
              </h3>
              <p className="text-muted mb-0">Success Rate</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <Row className="align-items-center">
                <Col>
                  <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                    <Nav variant="pills" className="mb-0">
                      <Nav.Item>
                        <Nav.Link eventKey="all">All Connections</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="successful">Successful</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="contacted">In Progress</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="initiated">New</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Tab.Container>
                </Col>
                <Col md="auto">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search connections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-secondary">
                      <i className="bi bi-search"></i>
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {filteredConnections.length > 0 ? (
                <div className="list-group list-group-flush">
                  {filteredConnections.map((connection) => (
                    <div key={connection.id} className="list-group-item px-0">
                      <Row className="align-items-center">
                        <Col md={4}>
                          <div className="d-flex align-items-center">
                            <div className="connection-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                              <span className="text-white fw-bold">
                                {connection.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h6 className="mb-1">{connection.name}</h6>
                              <small className="text-muted">{connection.serviceCategory}</small>
                            </div>
                          </div>
                        </Col>
                        <Col md={2}>
                          <Badge bg={getStatusVariant(connection.status)}>
                            {getStatusText(connection.status)}
                          </Badge>
                        </Col>
                        <Col md={2}>
                          <small className="text-muted">
                            Connected: {new Date(connection.connectionDate).toLocaleDateString()}
                          </small>
                        </Col>
                        <Col md={2}>
                          {connection.lastContact && (
                            <small className="text-muted">
                              Last contact: {connection.lastContact}
                            </small>
                          )}
                        </Col>
                        <Col md={2} className="text-end">
                          <div className="btn-group">
                            <Button variant="outline-primary" size="sm">
                              View
                            </Button>
                            <Button variant="outline-success" size="sm">
                              Message
                            </Button>
                          </div>
                        </Col>
                      </Row>
                      
                      {/* Connection Details */}
                      <Row className="mt-2">
                        <Col>
                          {connection.notes && (
                            <small className="text-muted">
                              <strong>Notes:</strong> {connection.notes}
                            </small>
                          )}
                          {connection.clientRating && (
                            <div className="mt-1">
                              <small className="text-warning">
                                {'★'.repeat(connection.clientRating)}
                                {'☆'.repeat(5 - connection.clientRating)}
                              </small>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="text-muted mb-3">
                    <i className="bi bi-people fs-1"></i>
                  </div>
                  <h5>No connections found</h5>
                  <p className="text-muted">
                    {searchTerm || activeTab !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : `You haven't made any ${user?.role === 'client' ? 'professional' : 'client'} connections yet`
                    }
                  </p>
                  <Button as={Link} to="/search" variant="primary">
                    Start Searching
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default Connections;