import React from "react";
/* eslint-disable no-unused-vars */
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge,
  Form,
  ProgressBar
} from 'react-bootstrap';
import { adminAPI } from '../../services/adminAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ConnectionAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getConnectionAnalytics(timeRange);
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching connection analytics:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const calculatePercentage = (count, total) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!analytics) {
    return (
      <Container>
        <div className="text-center py-5">
          <h5>Error loading analytics data</h5>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Connection Analytics</h2>
          <p className="text-muted">
            Insights into connection patterns and success rates
          </p>
        </Col>
        <Col xs="auto">
          <Form.Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-4">
          <Card className="border-primary">
            <Card.Body className="text-center">
              <h3 className="text-primary">{analytics.totalConnections}</h3>
              <p className="text-muted mb-0">Total Connections</p>
              <small className="text-success">
                +{analytics.connectionsGrowth}% from previous period
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-success">
            <Card.Body className="text-center">
              <h3 className="text-success">{analytics.successRate}%</h3>
              <p className="text-muted mb-0">Success Rate</p>
              <small className="text-success">
                {analytics.successRate >= analytics.previousSuccessRate ? '+' : ''}
                {analytics.successRate - analytics.previousSuccessRate}% change
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-info">
            <Card.Body className="text-center">
              <h3 className="text-info">{analytics.averageResponseTime}h</h3>
              <p className="text-muted mb-0">Avg Response Time</p>
              <small className="text-success">
                Improved by {analytics.responseTimeImprovement}h
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-warning">
            <Card.Body className="text-center">
              <h3 className="text-warning">{analytics.topPerformingCategory}</h3>
              <p className="text-muted mb-0">Top Category</p>
              <small className="text-success">
                {analytics.topCategorySuccessRate}% success rate
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Status Distribution */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Connection Status Distribution</h5>
            </Card.Header>
            <Card.Body>
              {analytics.statusDistribution.map((status) => (
                <div key={status.status} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>
                      <Badge bg={getStatusVariant(status.status)} className="me-2">
                        {status.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {status.count} connections
                    </span>
                    <span>{calculatePercentage(status.count, analytics.totalConnections)}%</span>
                  </div>
                  <ProgressBar
                    now={calculatePercentage(status.count, analytics.totalConnections)}
                    variant={getStatusVariant(status.status)}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Category Performance */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Performance by Category</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Category</th>
                    <th>Connections</th>
                    <th>Success Rate</th>
                    <th>Avg Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.categoryPerformance.map((category) => (
                    <tr key={category.category}>
                      <td>{category.category}</td>
                      <td>{category.connections}</td>
                      <td>
                        <Badge bg={category.successRate >= 70 ? 'success' : 'warning'}>
                          {category.successRate}%
                        </Badge>
                      </td>
                      <td>
                        <span className="text-warning">
                          {'★'.repeat(Math.round(category.averageRating))}
                          {'☆'.repeat(5 - Math.round(category.averageRating))}
                        </span>
                        <small className="text-muted ms-1">
                          ({category.averageRating.toFixed(1)})
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Connections */}
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Connections</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Client</th>
                    <th>Professional</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentConnections.map((connection) => (
                    <tr key={connection.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={connection.clientAvatar || '/default-avatar.png'}
                            alt="Client"
                            className="rounded-circle me-2"
                            width="32"
                            height="32"
                          />
                          <span>{connection.clientName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={connection.profileOwnerAvatar || '/default-avatar.png'}
                            alt="Professional"
                            className="rounded-circle me-2"
                            width="32"
                            height="32"
                          />
                          <span>{connection.profileOwnerName}</span>
                        </div>
                      </td>
                      <td>{connection.category}</td>
                      <td>
                        {new Date(connection.connectionDate).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge bg={getStatusVariant(connection.status)}>
                          {connection.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td>
                        {connection.rating ? (
                          <span className="text-warning">
                            {'★'.repeat(connection.rating)}
                            {'☆'.repeat(5 - connection.rating)}
                          </span>
                        ) : (
                          <span className="text-muted">No rating</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Insights */}
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Key Insights</h5>
            </Card.Header>
            <Card.Body>
              {analytics.insights.map((insight, index) => (
                <div key={index} className="mb-3 p-3 bg-light rounded">
                  <h6>{insight.title}</h6>
                  <p className="mb-0 text-muted">{insight.description}</p>
                  {insight.metric && (
                    <small className="text-primary">
                      <strong>{insight.metric}</strong>
                    </small>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* Top Performers */}
          <Card className="mt-4">
            <Card.Header>
              <h5 className="mb-0">Top Performing Professionals</h5>
            </Card.Header>
            <Card.Body>
              {analytics.topPerformers.map((performer, index) => (
                <div key={performer.id} className="d-flex align-items-center mb-3">
                  <div className="position-relative">
                    <img
                      src={performer.avatar || '/default-avatar.png'}
                      alt="Professional"
                      className="rounded-circle"
                      width="40"
                      height="40"
                    />
                    <Badge 
                      bg="primary" 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.6rem' }}
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="ms-3 flex-grow-1">
                    <div className="fw-semibold">{performer.name}</div>
                    <small className="text-muted">{performer.category}</small>
                  </div>
                  <div className="text-end">
                    <div className="text-warning small">
                      {'★'.repeat(Math.round(performer.rating))}
                    </div>
                    <small className="text-muted">
                      {performer.successfulConnections} successful
                    </small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ConnectionAnalytics;