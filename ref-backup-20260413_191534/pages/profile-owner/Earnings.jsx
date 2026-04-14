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
} from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { earningsService } from '../../services/earningsService';
import { 
  DollarSign, 
  TrendingUp, 
  Download, 
  Calendar,
  Eye
} from 'react-feather';

const Earnings = () => {
  const { user } = useAuth();
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchEarningsData();
  }, [filter, dateRange]);

  const fetchEarningsData = async () => {
    try {
      const data = await earningsService.getEarnings({ filter, dateRange });
      setEarningsData(data);
    } catch (err) {
      console.error('Earnings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      await earningsService.exportEarnings(format, { filter, dateRange });
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      pending: 'warning',
      cancelled: 'danger',
      in_progress: 'primary'
    };
    return (
      <Badge bg={variants[status] || 'secondary'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">Earnings & Payments</h1>
              <p className="text-muted">Track your earnings and payment history</p>
            </div>
            <div>
              <Button variant="outline-primary" className="me-2">
                <Download size={16} className="me-2" />
                Export
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Earnings Summary */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <DollarSign size={24} className="text-success" />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="mb-0">${earningsData?.totalEarnings || 0}</h4>
                  <small className="text-muted">Total Earnings</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <TrendingUp size={24} className="text-primary" />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="mb-0">${earningsData?.pendingBalance || 0}</h4>
                  <small className="text-muted">Pending Balance</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <Calendar size={24} className="text-warning" />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="mb-0">${earningsData?.thisMonthEarnings || 0}</h4>
                  <small className="text-muted">This Month</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <DollarSign size={24} className="text-info" />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="mb-0">{earningsData?.totalProjects || 0}</h4>
                  <small className="text-muted">Total Projects</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Time Period</Form.Label>
                <Form.Select
                  value={filter}
                >
                  <option value="all">All Time</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="last_3_months">Last 3 Months</option>
                  <option value="custom">Custom Range</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {filter === 'custom' && (
              <>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({
                        ...prev,
                        start: e.target.value
                      }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({
                        ...prev,
                        end: e.target.value
                      }))}
                    />
                  </Form.Group>
                </Col>
              </>
            )}
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col lg={8}>
          {/* Earnings History */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Earnings History</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover>
                <thead className="bg-light">
                  <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData?.transactions?.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td>
                        <div>
                          <strong>{transaction.clientName}</strong>
                          <br />
                          <small className="text-muted">{transaction.clientEmail}</small>
                        </div>
                      </td>
                      <td>{transaction.projectName}</td>
                      <td>
                        <strong>${transaction.amount}</strong>
                        <br />
                        <small className="text-muted">{transaction.hours} hours</small>
                      </td>
                      <td>{getStatusBadge(transaction.status)}</td>
                      <td>
                        <Button variant="outline-primary" size="sm">
                          <Eye size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {(!earningsData?.transactions || earningsData.transactions.length === 0) && (
                <div className="text-center py-5">
                  <DollarSign size={48} className="text-muted mb-3" />
                  <h5>No earnings yet</h5>
                  <p className="text-muted">
                    Start working with clients to see your earnings here
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Payment Methods */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Payment Methods</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Primary Payment Method</strong>
                <div className="text-muted small">
                  Bank Transfer • • • • 1234
                </div>
              </div>
              <Button variant="outline-primary" size="sm">
                Update Payment Methods
              </Button>
            </Card.Body>
          </Card>

          {/* Payout Schedule */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Payout Schedule</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-2">
                <strong>Next Payout</strong>
                <div className="text-success">
                  ${earningsData?.nextPayout?.amount || 0}
                </div>
                <small className="text-muted">
                  Scheduled for {earningsData?.nextPayout?.date ? 
                  new Date(earningsData.nextPayout.date).toLocaleDateString() : 'N/A'}
                </small>
              </div>
              <hr />
              <small className="text-muted">
                Payouts are processed every Friday for completed projects.
              </small>
            </Card.Body>
          </Card>

          {/* Earnings Summary */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Completed Projects:</span>
                <strong>{earningsData?.summary?.completedProjects || 0}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Active Projects:</span>
                <strong>{earningsData?.summary?.activeProjects || 0}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Avg. Hourly Rate:</span>
                <strong>${earningsData?.summary?.averageHourlyRate || 0}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Hours:</span>
                <strong>{earningsData?.summary?.totalHours || 0}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total Earnings:</strong>
                <strong className="text-success">
                  ${earningsData?.totalEarnings || 0}
                </strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Earnings;