import React from "react";
/* eslint-disable no-unused-vars */
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Form,
  ProgressBar,
  Badge
} from 'react-bootstrap';
import { adminAPI } from '../../services/adminAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPlatformAnalytics(timeRange);
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching platform analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  const getGrowthVariant = (growth) => {
    if (growth > 0) return 'success';
    if (growth < 0) return 'danger';
    return 'secondary';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!analytics) {
    return (
      <Container>
        <div className="text-center py-5">
          <h5>Error loading platform analytics</h5>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Platform Analytics</h2>
          <p className="text-muted">
            Comprehensive overview of platform performance and user engagement
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

      {/* Platform Overview */}
      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-4">
          <Card className="border-primary">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="text-primary">{formatNumber(analytics.totalUsers)}</h4>
                  <p className="text-muted mb-0">Total Users</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x text-primary"></i>
                </div>
              </div>
              <small className={`text-${getGrowthVariant(analytics.userGrowth)}`}>
                {analytics.userGrowth > 0 ? '+' : ''}{analytics.userGrowth}% growth
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-success">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="text-success">{formatNumber(analytics.activeUsers)}</h4>
                  <p className="text-muted mb-0">Active Users</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-user-check fa-2x text-success"></i>
                </div>
              </div>
              <small className="text-muted">
                {calculatePercentage(analytics.activeUsers, analytics.totalUsers)}% of total
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-info">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="text-info">{formatNumber(analytics.totalConnections)}</h4>
                  <p className="text-muted mb-0">Total Connections</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-handshake fa-2x text-info"></i>
                </div>
              </div>
              <small className={`text-${getGrowthVariant(analytics.connectionGrowth)}`}>
                {analytics.connectionGrowth > 0 ? '+' : ''}{analytics.connectionGrowth}% growth
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-warning">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="text-warning">{analytics.successRate}%</h4>
                  <p className="text-muted mb-0">Success Rate</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-chart-line fa-2x text-warning"></i>
                </div>
              </div>
              <small className="text-muted">
                Connection success rate
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* User Distribution */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">User Distribution</h5>
            </Card.Header>
            <Card.Body>
              {analytics.userDistribution.map((dist) => (
                <div key={dist.role} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>
                      <Badge 
                        bg={
                          dist.role === 'profile_owner' ? 'primary' : 
                          dist.role === 'client' ? 'success' : 'danger'
                        } 
                        className="me-2"
                      >
                        {dist.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {dist.count} users
                    </span>
                    <span>{calculatePercentage(dist.count, analytics.totalUsers)}%</span>
                  </div>
                  <ProgressBar
                    now={calculatePercentage(dist.count, analytics.totalUsers)}
                    variant={
                      dist.role === 'profile_owner' ? 'primary' : 
                      dist.role === 'client' ? 'success' : 'danger'
                    }
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Platform Health */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Platform Health Metrics</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>User Engagement</span>
                  <span>{analytics.engagementRate}%</span>
                </div>
                <ProgressBar 
                  now={analytics.engagementRate} 
                  variant={analytics.engagementRate >= 70 ? 'success' : 'warning'} 
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Profile Completion</span>
                  <span>{analytics.profileCompletionRate}%</span>
                </div>
                <ProgressBar 
                  now={analytics.profileCompletionRate} 
                  variant={analytics.profileCompletionRate >= 80 ? 'success' : 'warning'} 
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Moodle Integration</span>
                  <span>{analytics.moodleIntegrationRate}%</span>
                </div>
                <ProgressBar 
                  now={analytics.moodleIntegrationRate} 
                  variant={analytics.moodleIntegrationRate >= 60 ? 'success' : 'warning'} 
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Customer Satisfaction</span>
                  <span>{analytics.satisfactionRate}%</span>
                </div>
                <ProgressBar 
                  now={analytics.satisfactionRate} 
                  variant={analytics.satisfactionRate >= 80 ? 'success' : 'warning'} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent User Registrations */}
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent User Registrations</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Profile Complete</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentRegistrations.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={user.avatar || '/default-avatar.png'}
                            alt="User"
                            className="rounded-circle me-2"
                            width="32"
                            height="32"
                          />
                          <div>
                            <div className="fw-semibold">
                              {user.firstName} {user.lastName}
                            </div>
                            <small className="text-muted">{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge 
                          bg={
                            user.role === 'profile_owner' ? 'primary' : 
                            user.role === 'client' ? 'success' : 'danger'
                          }
                        >
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td>
                        {new Date(user.registrationDate).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge bg={user.isActive ? 'success' : 'secondary'}>
                          {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <ProgressBar 
                            now={user.profileCompletion} 
                            style={{ width: '60px', height: '6px' }}
                            variant={user.profileCompletion === 100 ? 'success' : 'primary'}
                          />
                          <small className="ms-2">{user.profileCompletion}%</small>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Performance Metrics */}
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Performance Metrics</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <h3 className="text-primary">{analytics.avgResponseTime}ms</h3>
                <p className="text-muted mb-0">Average Response Time</p>
              </div>

              <div className="mb-3">
                <strong>API Performance</strong>
                <div className="d-flex justify-content-between mt-2">
                  <small>Success Rate</small>
                  <small>{analytics.apiSuccessRate}%</small>
                </div>
                <ProgressBar 
                  now={analytics.apiSuccessRate} 
                  variant={analytics.apiSuccessRate >= 95 ? 'success' : 'warning'} 
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <small>Uptime</small>
                  <small>{analytics.uptime}%</small>
                </div>
                <ProgressBar 
                  now={analytics.uptime} 
                  variant={analytics.uptime >= 99.9 ? 'success' : 'warning'} 
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <small>Error Rate</small>
                  <small>{analytics.errorRate}%</small>
                </div>
                <ProgressBar 
                  now={analytics.errorRate} 
                  variant={analytics.errorRate <= 1 ? 'success' : 'danger'} 
                />
              </div>
            </Card.Body>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <Card.Header>
              <h5 className="mb-0">Quick Stats</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless size="sm">
                <tbody>
                  <tr>
                    <td>New Users Today</td>
                    <td className="text-end">
                      <strong>{analytics.newUsersToday}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Active Sessions</td>
                    <td className="text-end">
                      <strong>{analytics.activeSessions}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Page Views</td>
                    <td className="text-end">
                      <strong>{formatNumber(analytics.pageViews)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Avg Session Duration</td>
                    <td className="text-end">
                      <strong>{analytics.avgSessionDuration}m</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Bounce Rate</td>
                    <td className="text-end">
                      <strong>{analytics.bounceRate}%</strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Geographic Distribution */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">User Geographic Distribution</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {analytics.geographicDistribution.map((region) => (
                  <Col key={region.region} md={3} className="mb-3">
                    <div className="text-center">
                      <h6>{region.region}</h6>
                      <div className="text-primary fw-bold">{region.users}</div>
                      <small className="text-muted">users</small>
                      <ProgressBar 
                        now={calculatePercentage(region.users, analytics.totalUsers)} 
                        className="mt-1"
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlatformAnalytics;