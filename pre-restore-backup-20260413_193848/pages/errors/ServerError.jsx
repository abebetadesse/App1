import React from "react";
/* eslint-disable no-unused-vars */
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const ServerError = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRetryNow = () => {
    window.location.reload();
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={8} className="mx-auto">
          <Card className="shadow-sm border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <i className="fas fa-server fa-5x text-danger"></i>
              </div>
              
              <div className="text-center">
                <h1 className="display-4 fw-bold text-muted">500</h1>
                <h3 className="mb-3">Internal Server Error</h3>
                
                <p className="text-muted mb-4">
                  Something went wrong on our end. Our team has been notified and is working to fix the issue.
                  The page will automatically refresh in {countdown} seconds.
                </p>

                <Alert variant="warning" className="mb-4">
                  <Alert.Heading>We're working on it!</Alert.Heading>
                  <p className="mb-0">
                    Our technical team has been alerted and is investigating the issue. 
                    Please try again in a few moments.
                  </p>
                </Alert>

                <div className="d-flex gap-3 justify-content-center mb-4">
                  <Button 
                    variant="primary" 
                    onClick={handleRetryNow}
                    className="px-4"
                  >
                    <i className="fas fa-redo me-2"></i>
                    Retry Now
                  </Button>
                  
                  <Button 
                    as={Link} 
                    to="/" 
                    variant="outline-primary"
                    className="px-4"
                  >
                    <i className="fas fa-home me-2"></i>
                    Go Home
                  </Button>

                  <Button 
                    variant="outline-secondary"
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-4"
                  >
                    <i className="fas fa-info-circle me-2"></i>
                    {showDetails ? 'Hide Details' : 'Show Details'}
                  </Button>
                </div>

                {showDetails && (
                  <Card className="mt-4">
                    <Card.Header>
                      <h6 className="mb-0">Technical Details</h6>
                    </Card.Header>
                    <Card.Body>
                      <small>
                        <strong>Error Code:</strong> 500 Internal Server Error<br/>
                        <strong>Timestamp:</strong> {new Date().toLocaleString()}<br/>
                        <strong>Request ID:</strong> {Math.random().toString(36).substr(2, 9).toUpperCase()}<br/>
                        <strong>Support Reference:</strong> SR-{Date.now()}
                      </small>
                      <div className="mt-3">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          as={Link}
                          to="/contact"
                        >
                          <i className="fas fa-life-ring me-1"></i>
                          Contact Support
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </div>

              {/* Status Updates */}
              <Card className="mt-4">
                <Card.Body>
                  <h6 className="mb-3">System Status</h6>
                  <Row>
                    <Col md={4} className="text-center mb-3">
                      <div className={`p-3 rounded ${Math.random() > 0.3 ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                        <i className="fas fa-database fa-2x mb-2"></i>
                        <div>Database</div>
                        <small>{Math.random() > 0.3 ? 'Operational' : 'Degraded'}</small>
                      </div>
                    </Col>
                    <Col md={4} className="text-center mb-3">
                      <div className={`p-3 rounded ${Math.random() > 0.5 ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                        <i className="fas fa-cloud fa-2x mb-2"></i>
                        <div>API Services</div>
                        <small>{Math.random() > 0.5 ? 'Operational' : 'Partial Outage'}</small>
                      </div>
                    </Col>
                    <Col md={4} className="text-center mb-3">
                      <div className="p-3 rounded bg-success text-white">
                        <i className="fas fa-shield-alt fa-2x mb-2"></i>
                        <div>Authentication</div>
                        <small>Operational</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ServerError;