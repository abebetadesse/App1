import React from "react";
/* eslint-disable no-unused-vars */
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert,
  Tab,
  Nav
} from 'react-bootstrap';
import { adminAPI } from '../../services/adminAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SystemSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSystemSettings();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching system settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setSaveMessage('');
      const response = await adminAPI.updateSystemSettings(settings);
      if (response.success) {
        setSaveMessage('Settings saved successfully!');
      } else {
        setSaveMessage('Error saving settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>System Settings</h2>
          <p className="text-muted">
            Configure platform-wide settings and preferences
          </p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={saveSettings}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Col>
      </Row>

      {saveMessage && (
        <Alert variant={saveMessage.includes('Error') ? 'danger' : 'success'}>
          {saveMessage}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="general">General</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="moodle">Moodle Integration</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="notifications">Notifications</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="security">Security</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="appearance">Appearance</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            {/* General Settings */}
            <Tab.Pane active={activeTab === 'general'}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Platform Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.general?.platformName || ''}
                      onChange={(e) => handleSettingChange('general', 'platformName', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Support Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={settings.general?.supportEmail || ''}
                      onChange={(e) => handleSettingChange('general', 'supportEmail', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Default User Role</Form.Label>
                    <Form.Select
                      value={settings.general?.defaultUserRole || 'client'}
                      onChange={(e) => handleSettingChange('general', 'defaultUserRole', e.target.value)}
                    >
                      <option value="client">Client</option>
                      <option value="profile_owner">Profile Owner</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Auto-approve Profiles</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={settings.general?.autoApproveProfiles || false}
                      onChange={(e) => handleSettingChange('general', 'autoApproveProfiles', e.target.checked)}
                    />
                    <Form.Text className="text-muted">
                      Automatically approve new profile owner registrations
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Welcome Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={settings.general?.welcomeMessage || ''}
                  onChange={(e) => handleSettingChange('general', 'welcomeMessage', e.target.value)}
                  placeholder="Welcome message for new users"
                />
              </Form.Group>
            </Tab.Pane>

            {/* Moodle Integration Settings */}
            <Tab.Pane active={activeTab === 'moodle'}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Moodle Base URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={settings.moodle?.baseUrl || ''}
                      onChange={(e) => handleSettingChange('moodle', 'baseUrl', e.target.value)}
                      placeholder="https://k4b.et"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>API Token</Form.Label>
                    <Form.Control
                      type="password"
                      value={settings.moodle?.apiToken || ''}
                      onChange={(e) => handleSettingChange('moodle', 'apiToken', e.target.value)}
                      placeholder="Web service token"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sync Interval</Form.Label>
                    <Form.Select
                      value={settings.moodle?.syncInterval || 'daily'}
                      onChange={(e) => handleSettingChange('moodle', 'syncInterval', e.target.value)}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      How often to sync course data from Moodle
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Auto-link Accounts</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={settings.moodle?.autoLinkAccounts || false}
                      onChange={(e) => handleSettingChange('moodle', 'autoLinkAccounts', e.target.checked)}
                    />
                    <Form.Text className="text-muted">
                      Automatically link Moodle accounts during registration
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Required Courses</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={settings.moodle?.requiredCourses?.join(', ') || ''}
                  onChange={(e) => handleSettingChange('moodle', 'requiredCourses', e.target.value.split(',').map(c => c.trim()))}
                  placeholder="Comma-separated list of required course IDs"
                />
                <Form.Text className="text-muted">
                  Courses that must be completed for minimum ranking
                </Form.Text>
              </Form.Group>
            </Tab.Pane>

            {/* Notification Settings */}
            <Tab.Pane active={activeTab === 'notifications'}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Notifications</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={settings.notifications?.emailEnabled || false}
                      onChange={(e) => handleSettingChange('notifications', 'emailEnabled', e.target.checked)}
                    />
                    <Form.Text className="text-muted">
                      Enable email notifications for users
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>SMS Notifications</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={settings.notifications?.smsEnabled || false}
                      onChange={(e) => handleSettingChange('notifications', 'smsEnabled', e.target.checked)}
                    />
                    <Form.Text className="text-muted">
                      Enable SMS notifications (requires phone verification)
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Push Notifications</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={settings.notifications?.pushEnabled || false}
                      onChange={(e) => handleSettingChange('notifications', 'pushEnabled', e.target.checked)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Admin Alerts</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={settings.notifications?.adminAlerts || false}
                      onChange={(e) => handleSettingChange('notifications', 'adminAlerts', e.target.checked)}
                    />
                    <Form.Text className="text-muted">
                      Send alerts to admins for critical events
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Notification Templates</Form.Label>
                <Form.Select
                  value={settings.notifications?.defaultTemplate || 'standard'}
                  onChange={(e) => handleSettingChange('notifications', 'defaultTemplate', e.target.value)}
                >
                  <option value="standard">Standard</option>
                  <option value="professional">Professional</option>
                  <option value="minimal">Minimal</option>
                </Form.Select>
              </Form.Group>
            </Tab.Pane>

            {/* Security Settings */}
            <Tab.Pane active={activeTab === 'security'}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password Minimum Length</Form.Label>
                    <Form.Control
                      type="number"
                      min="6"
                      max="20"
                      value={settings.security?.passwordMinLength || 8}
                      onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Session Timeout (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      min="15"
                      max="1440"
                      value={settings.security?.sessionTimeout || 60}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Max Login Attempts</Form.Label>
                    <Form.Control
                      type="number"
                      min="3"
                      max="10"
                      value={settings.security?.maxLoginAttempts || 5}
                      onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Account Lockout Duration (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.security?.lockoutDuration || 30}
                      onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Two-Factor Authentication</Form.Label>
                <Form.Check
                  type="switch"
                  checked={settings.security?.twoFactorEnabled || false}
                  onChange={(e) => handleSettingChange('security', 'twoFactorEnabled', e.target.checked)}
                />
                <Form.Text className="text-muted">
                  Require 2FA for admin accounts
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>API Rate Limiting</Form.Label>
                <Form.Check
                  type="switch"
                  checked={settings.security?.rateLimitingEnabled || false}
                  onChange={(e) => handleSettingChange('security', 'rateLimitingEnabled', e.target.checked)}
                />
                <Form.Text className="text-muted">
                  Enable rate limiting for API endpoints
                </Form.Text>
              </Form.Group>
            </Tab.Pane>

            {/* Appearance Settings */}
            <Tab.Pane active={activeTab === 'appearance'}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Theme</Form.Label>
                    <Form.Select
                      value={settings.appearance?.theme || 'light'}
                      onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Primary Color</Form.Label>
                    <Form.Control
                      type="color"
                      value={settings.appearance?.primaryColor || '#0d6efd'}
                      onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Logo URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={settings.appearance?.logoUrl || ''}
                      onChange={(e) => handleSettingChange('appearance', 'logoUrl', e.target.value)}
                      placeholder="/logo.png"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Favicon URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={settings.appearance?.faviconUrl || ''}
                      onChange={(e) => handleSettingChange('appearance', 'faviconUrl', e.target.value)}
                      placeholder="/favicon.ico"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Custom CSS</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={settings.appearance?.customCSS || ''}
                  onChange={(e) => handleSettingChange('appearance', 'customCSS', e.target.value)}
                  placeholder="Custom CSS styles"
                />
                <Form.Text className="text-muted">
                  Additional CSS to customize the platform appearance
                </Form.Text>
              </Form.Group>
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
        <Card.Footer className="text-end">
          <Button 
            variant="primary" 
            onClick={saveSettings}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SystemSettings;