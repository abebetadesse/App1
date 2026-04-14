import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Button } from 'react-bootstrap';
import UserManagement from '../../components/admin/UserManagement';
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard';
import SystemSettings from '../../components/admin/SystemSettings';
import RankingEngine from '../../components/admin/RankingEngine';
import SystemTelemetry from '../../components/admin/SystemTelemetry';
import ActivityLog from "../../components/admin/ActivityLog";

const AdminDashboard = forwardRef((props, ref) {
  const [key, setKey] = useState('analytics');
  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      <Tab.Container activeKey={key} onSelect={setKey}>
        <Row>
          <Col sm={3} lg={2} className="mb-4">
            <Nav variant="pills" className="flex-column">
              <Nav.Item><Nav.Link eventKey="analytics">📊 Analytics</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="users">👥 Users</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="ranking">⚙️ Ranking Engine</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="telemetry">📡 Telemetry</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="logs">📜 Activity Logs</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="settings">⚙️ Settings</Nav.Link></Nav.Item>
            </Nav>
          </Col>
          <Col sm={9} lg={10}>
            <Tab.Content>
              <Tab.Pane eventKey="analytics"><AnalyticsDashboard /></Tab.Pane>
              <Tab.Pane eventKey="users"><UserManagement /></Tab.Pane>
              <Tab.Pane eventKey="ranking"><RankingEngine /></Tab.Pane>
              <Tab.Pane eventKey="telemetry"><SystemTelemetry /></Tab.Pane>
              <Tab.Pane eventKey="logs"><ActivityLog /></Tab.Pane>
              <Tab.Pane eventKey="settings"><SystemSettings /></Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}
AdminDashboard.displayName = 'AdminDashboard';
