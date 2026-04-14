import React from "react";
/* eslint-disable no-unused-vars */
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  Alert,
  Badge,
  ToggleButton,
  ToggleButtonGroup
} from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { profileOwnerService } from '../../services/profileOwnerService';
import { Calendar, Clock, Save, CheckCircle, XCircle } from 'react-feather';

const Availability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState({
    status: 'available',
    immediateAvailability: true,
    noticePeriod: 'immediate',
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    timezone: 'UTC+3', // Ethiopia time
    weeklySchedule: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    unavailableUntil: ''
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const data = await profileOwnerService.getAvailability();
      if (data) {
        setAvailability(data);
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await profileOwnerService.updateAvailability(availability);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save availability settings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status) => {
    setAvailability(prev => ({
      ...prev,
      status
    }));
  };

  const handleDayToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: !prev.weeklySchedule[day]
      }
    }));
  };

  const handleWorkingHoursChange = (field, value) => {
    setAvailability(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value
      }
    }));
  };

  const getStatusVariant = (status) => {
    return status === 'available' ? 'success' : 'secondary';
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">Availability Settings</h1>
              <p className="text-muted">Set your working hours and availability for clients</p>
            </div>
            <Badge bg={getStatusVariant(availability.status)}>
              {availability.status === 'available' ? 'Available' : 'Not Available'}
            </Badge>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      {saved && (
        <Alert variant="success">
          <CheckCircle size={18} className="me-2" />
          Availability settings saved successfully!
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <Calendar size={20} className="me-2" />
                Availability Status
              </h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Current Status</Form.Label>
                <div>
                  <ToggleButtonGroup
                    type="radio"
                    name="status"
                    value={availability.status}
                    onChange={handleStatusChange}
                  >
                    <ToggleButton
                      id="status-available"
                      value="available"
                      variant={availability.status === 'available' ? 'primary' : 'outline-primary'}
                    >
                      <CheckCircle size={16} className="me-2" />
                      Available
                    </ToggleButton>
                    <ToggleButton
                      id="status-unavailable"
                      value="unavailable"
                      variant={availability.status === 'available' ? 'outline-primary' : 'primary'}
                    >
                      <XCircle size={16} className="me-2" />
                      Not Available
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Notice Period</Form.Label>
                <Form.Select
                  value={availability.noticePeriod}
                  onChange={(e) => setAvailability(prev => ({
                    ...prev,
                    noticePeriod: e.target.value
                  }))}
                >
                  <option value="immediate">Immediate</option>
                  <option value="1_week">1 Week</option>
                  <option value="2_weeks">2 Weeks</option>
                  <option value="1_month">1 Month</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  How soon can you start working with new clients?
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <Clock size={20} className="me-2" />
                Weekly Schedule
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {Object.entries(availability.weeklySchedule).map(([day, isAvailable]) => (
                  <Col md={6} key={day} className="mb-3">
                    <Form.Check
                      type="switch"
                      id={`day-${day}`}
                      label={day.charAt(0).toUpperCase() + day.slice(1)}
                      checked={isAvailable}
                      onChange={() => handleDayToggle(day)}
                    />
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Working Hours</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={availability.workingHours.start}
                      onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={availability.workingHours.end}
                      onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>Timezone</Form.Label>
                <Form.Select
                  value={availability.timezone}
                  onChange={(e) => setAvailability(prev => ({
                    ...prev,
                    timezone: e.target.value
                  }))}
                >
                  <option value="UTC+3">East Africa Time (UTC+3)</option>
                  <option value="UTC+1">West Africa Time (UTC+1)</option>
                  <option value="UTC+0">GMT</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '100px' }}>
            <Card.Header>
              <h5 className="mb-0">Preview</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <div className={`availability-status ${availability.status}`}>
                  {availability.status === 'available' ? (
                    <CheckCircle size={48} className="text-success mb-3" />
                  ) : (
                    <XCircle size={48} className="text-secondary mb-3" />
                  )}
                  <h5>
                    {availability.status === 'available' ? 'Available' : 'Not Available'}
                  </h5>
                </div>
              </div>

              <div className="schedule-preview">
                <h6 className="mb-3">Weekly Schedule</h6>
                {Object.entries(availability.weeklySchedule).map(([day, isAvailable]) => (
                  <div key={day} className="d-flex justify-content-between align-items-center mb-2">
                    <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                    <Badge bg={isAvailable ? 'success' : 'secondary'}>
                      {isAvailable ? 'Available' : 'Off'}
                    </Badge>
                  </div>
                ))}
              </div>

              <hr />

              <div className="working-hours-preview">
                <h6 className="mb-2">Working Hours</h6>
                <p className="mb-1">
                  {availability.workingHours.start} - {availability.workingHours.end}
                </p>
                <small className="text-muted">{availability.timezone}</small>
              </div>

              <hr />

              <div className="notice-period-preview">
                <h6 className="mb-2">Notice Period</h6>
                <p className="mb-0 text-capitalize">
                  {availability.noticePeriod.replace('_', ' ')}
                </p>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button 
                variant="primary" 
                className="w-100" 
                onClick={handleSave}
                disabled={loading}
              >
                <Save size={16} className="me-2" />
                {loading ? 'Saving...' : 'Save Availability Settings'}
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Availability;