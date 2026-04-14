import React from "react";
/* eslint-disable no-unused-vars */
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge,
  Button,
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { clientAPI } from './clientAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ClientConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getConnections();
      if (response.success) {
        setConnections(response.data);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConnections = connections.filter(connection => {
    const matchesSearch = 
      connection.profileOwner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.profileOwner?.serviceCategory?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || connection.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'successful': return 'success';
      case 'contacted': return 'info';
      case 'initiated': return 'warning';
      case 'failed': return 'danger';
      case 'no_response': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleProvideFeedback = (connection) => {
    setSelectedConnection(connection);
    setFeedback({ rating: 5, comment: '' });
    setShowFeedbackModal(true);
  };

  const submitFeedback = async () => {
    try {
      const response = await clientAPI.submitFeedback(
        selectedConnection.id, 
        feedback.rating, 
        feedback.comment
      );
      if (response.success) {
        setConnections(prev => prev.map(conn =>
          conn.id === selectedConnection.id
            ? { ...conn, clientRating: feedback.rating, clientFeedback: 'positive' }
            : conn
        ));
        setShowFeedbackModal(false);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const formatPhoneNumber = (phone) => {
    // Basic phone formatting
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>My Connections</h2>
          <p className="text-muted">
            Track your connections with service professionals
          </p>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <i className="fas fa-search"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="initiated">Initiated</option>
            <option value="contacted">Contacted</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed</option>
            <option value="no_response">No Response</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <small className="text-muted">
            {filteredConnections.length} connection(s) found
          </small>
        </Col>
      </Row>

      {/* Connections Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Connection History</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredConnections.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h5>No connections found</h5>
              <p className="text-muted">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Your connections will appear here after you contact professionals'
                }
              </p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Professional</th>
                  <th>Category</th>
                  <th>Connection Date</th>
                  <th>Status</th>
                  <th>Contact Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConnections.map((connection) => (
                  <tr key={connection.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={connection.profileOwner?.avatar || '/default-avatar.png'}
                          alt="Profile"
                          className="rounded-circle me-3"
                          width="40"
                          height="40"
                        />
                        <div>
                          <div className="fw-semibold">
                            {connection.profileOwner?.name || 'N/A'}
                          </div>
                          <small className="text-muted">
                            Rank: {connection.profileOwner?.professionalRank}/5
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{connection.profileOwner?.serviceCategory}</td>
                    <td>
                      {new Date(connection.connectionDate).toLocaleDateString()}
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(connection.status)}>
                        {connection.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      {connection.profileOwner?.phoneNumber ? (
                        <span className="text-nowrap">
                          <i className="fas fa-phone text-success me-1"></i>
                          {formatPhoneNumber(connection.profileOwner.phoneNumber)}
                        </span>
                      ) : (
                        <span className="text-muted">Not available</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {connection.status === 'successful' && !connection.clientRating && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleProvideFeedback(connection)}
                          >
                            Provide Feedback
                          </Button>
                        )}
                        {connection.clientRating && (
                          <div className="text-warning">
                            {'★'.repeat(connection.clientRating)}
                            {'☆'.repeat(5 - connection.clientRating)}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Statistics */}
      <Row className="mt-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">
                {connections.filter(c => c.status === 'successful').length}
              </h3>
              <p className="text-muted mb-0">Successful</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">
                {connections.filter(c => c.status === 'contacted').length}
              </h3>
              <p className="text-muted mb-0">Contacted</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">
                {connections.filter(c => c.status === 'initiated').length}
              </h3>
              <p className="text-muted mb-0">Initiated</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-danger">
                {connections.filter(c => c.status === 'failed' || c.status === 'no_response').length}
              </h3>
              <p className="text-muted mb-0">Unsuccessful</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Provide Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedConnection && (
            <>
              <p>
                How was your experience with{' '}
                <strong>{selectedConnection.profileOwner?.name}</strong>?
              </p>
              
              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant={feedback.rating >= star ? 'warning' : 'outline-warning'}
                      className="me-1"
                      onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                    >
                      ★
                    </Button>
                  ))}
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Label>Comments (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={feedback.comment}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience working with this professional..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitFeedback}>
            Submit Feedback
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClientConnections;