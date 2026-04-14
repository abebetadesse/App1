import React from "react";
/* eslint-disable no-unused-vars */
import { Card, Row, Col, ProgressBar, Badge } from 'react-bootstrap';

const PerformanceStats = ({ stats }) => {
  const {
    rankingScore = 0,
    professionalRank = 0,
    totalConnections = 0,
    successfulConnections = 0,
    responseRate = 0,
    avgResponseTime = 0,
    profileCompletion = 0,
    coursesCompleted = 0
  } = stats || {};

  const successRate = totalConnections > 0 
    ? (successfulConnections / totalConnections) * 100 
    : 0;

  const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
    <Card className="h-100">
      <Card.Body className="text-center">
        <div className={`text-${color} mb-3`}>
          {icon || <i className="fas fa-chart-line fa-2x"></i>}
        </div>
        <h3 className={`text-${color}`}>{value}</h3>
        <h6 className="card-title">{title}</h6>
        {subtitle && <small className="text-muted">{subtitle}</small>}
      </Card.Body>
    </Card>
  );

  return (
    <div className="performance-stats">
      <h5 className="mb-4">Performance Overview</h5>
      
      {/* Key Metrics */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <StatCard
            title="Professional Rank"
            value={`${professionalRank}/5`}
            subtitle="Current Ranking"
            icon={<i className="fas fa-trophy fa-2x"></i>}
            color="warning"
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="Ranking Score"
            value={`${rankingScore}%`}
            subtitle="Overall Performance"
            icon={<i className="fas fa-star fa-2x"></i>}
            color="primary"
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="Success Rate"
            value={`${successRate.toFixed(1)}%`}
            subtitle="Connection Success"
            icon={<i className="fas fa-check-circle fa-2x"></i>}
            color="success"
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="Response Time"
            value={`${avgResponseTime}h`}
            subtitle="Average Response"
            icon={<i className="fas fa-clock fa-2x"></i>}
            color="info"
          />
        </Col>
      </Row>

      {/* Progress Metrics */}
      <Row>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Profile Completion</span>
                <Badge bg={profileCompletion === 100 ? 'success' : 'primary'}>
                  {profileCompletion}%
                </Badge>
              </div>
              <ProgressBar 
                now={profileCompletion} 
                variant={profileCompletion === 100 ? 'success' : 'primary'}
              />
              <small className="text-muted mt-2 d-block">
                Complete your profile to improve visibility
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Courses Completed</span>
                <Badge bg="info">{coursesCompleted}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Continue learning to improve your ranking
                </small>
                <i className="fas fa-graduation-cap text-info"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Connection Stats */}
      <Row>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Total Connections</h6>
                  <h4 className="text-primary mb-0">{totalConnections}</h4>
                </div>
                <i className="fas fa-users fa-2x text-primary"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Successful</h6>
                  <h4 className="text-success mb-0">{successfulConnections}</h4>
                </div>
                <i className="fas fa-handshake fa-2x text-success"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Response Rate */}
      <Card className="mt-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>Client Response Rate</span>
            <Badge bg={responseRate >= 80 ? 'success' : 'warning'}>
              {responseRate}%
            </Badge>
          </div>
          <ProgressBar 
            now={responseRate} 
            variant={responseRate >= 80 ? 'success' : 'warning'}
          />
          <small className="text-muted mt-2 d-block">
            Percentage of client inquiries you've responded to
          </small>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PerformanceStats;