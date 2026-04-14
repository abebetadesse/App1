import React, { useState } from 'react';
import { Container, Row, Col, Tab, Nav, Card } from 'react-bootstrap';
import VisibilityControl from "../components/settings/VisibilityControl";
import ThemeMarketplace from '../components/theme/ThemeMarketplace';
import PluginMarketplace from '../components/plugins/PluginMarketplace';
import BootstrapThemeSwitcher from "../components/theme/BootstrapThemeSwitcher";
import ProfileSettings from '../components/settings/ProfileSettings';
import DynamicFormDemo from '../components/forms/DynamicFormDemo';

export default function Settings() {
  const [key, setKey] = useState('profile');

  return (
    <Container className="py-4">
      <h1 className="mb-4">Settings & Marketplace</h1>
      <Tab.Container activeKey={key} onSelect={setKey}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item><Nav.Link eventKey="profile">👤 Profile</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="themes">🎨 Themes</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="plugins">🔌 Plugins</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="forms">📝 Dynamic Forms</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="visibility">🎛️ Visibility</Nav.Link></Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="profile"><ProfileSettings /></Tab.Pane>
              <Tab.Pane eventKey="themes"><ThemeMarketplace /></Tab.Pane>
                <Card className="mb-4"><Card.Header>🎨 Bootstrap Theme</Card.Header><Card.Body><BootstrapThemeSwitcher /></Card.Body></Card>
              <Tab.Pane eventKey="plugins"><PluginMarketplace /></Tab.Pane>
              <Tab.Pane eventKey="forms"><DynamicFormDemo /></Tab.Pane>
              <Tab.Pane eventKey="visibility"><VisibilityControl /></Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}
