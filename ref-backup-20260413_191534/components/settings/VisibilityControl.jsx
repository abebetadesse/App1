import React from 'react';
import { Card, Form, Row, Col, Badge } from 'react-bootstrap';
import { useVisibility } from '../../contexts/VisibilityContext';
import { useAuth } from '../../contexts/AuthContext';

export default function VisibilityControl() {
  const { settings, updateSetting } = useVisibility();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const sections = [
    { title: '📄 Pages', keys: ['showHomePage', 'showFeaturesPage', 'showPricingPage', 'showFAQPage', 'showContactPage', 'showAboutPage', 'showMarketplace', 'showDashboard', 'showNotifications', 'showSettings', 'showAdminPanel'] },
    { title: '🔧 Widgets', keys: ['widgetAnnouncements', 'widgetRecentActivity', 'widgetRecommendedProfiles', 'widgetStatsSummary', 'widgetQuickStats', 'widgetNewsTicker', 'widgetWeather', 'widgetBadges'] }
  ];

  const roleLabels = { guest: '👤 Guests', user: '👥 Logged-in Users', admin: '👑 Admins' };

  return (
    <Card>
      <Card.Header>🎛️ Widget & Page Visibility</Card.Header>
      <Card.Body>
        <p className="text-muted">Control which pages and widgets are visible to different user roles.</p>
        {sections.map(section => (
          <div key={section.title} className="mb-4">
            <h5>{section.title}</h5>
            <Row>
              {section.keys.map(key => (
                <Col md={6} key={key} className="mb-3">
                  <div className="border rounded p-2">
                    <strong>{key.replace(/^show|^widget/, '').replace(/([A-Z])/g, ' $1')}</strong>
                    <div className="d-flex gap-3 mt-2">
                      {Object.entries(roleLabels).map(([role, label]) => {
                        if (role === 'admin' && !isAdmin) return null;
                        return (
                          <Form.Check
                            key={role}
                            type="checkbox"
                            label={label}
                            checked={settings[key]?.[role] ?? (role === 'guest' ? true : false)}
                            onChange={(e) => updateSetting(key, role, e.target.checked)}
                          />
                        );
                      })}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}
