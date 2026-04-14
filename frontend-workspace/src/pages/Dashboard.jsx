import React, { forwardRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useVisibility } from '../contexts/VisibilityContext';
import AnnouncementsWidget from '../components/widgets/AnnouncementsWidget';
import RecentActivityWidget from '../components/widgets/RecentActivityWidget';
import RecommendedProfilesWidget from '../components/widgets/RecommendedProfilesWidget';
import StatsSummaryWidget from '../components/widgets/StatsSummaryWidget';
import QuickStatsWidget from '../components/widgets/QuickStatsWidget';
import NewsTickerWidget from '../components/widgets/NewsTickerWidget';
import WeatherWidget from '../components/widgets/WeatherWidget';
import BadgesWidget from '../components/widgets/BadgesWidget';

const Dashboard = forwardRef((props, ref) {
  const { user } = useAuth();
  const { isVisible } = useVisibility();

  return (
    <Container className="py-4">
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>
      <Row>
        <Col md={6}>{isVisible('widgetAnnouncements') && <AnnouncementsWidget />}</Col>
        <Col md={6}>{isVisible('widgetRecentActivity') && <RecentActivityWidget />}</Col>
        <Col md={6}>{isVisible('widgetRecommendedProfiles') && <RecommendedProfilesWidget />}</Col>
        <Col md={6}>{isVisible('widgetStatsSummary') && <StatsSummaryWidget />}</Col>
        <Col md={6}>{isVisible('widgetQuickStats') && <QuickStatsWidget />}</Col>
        <Col md={6}>{isVisible('widgetNewsTicker') && <NewsTickerWidget />}</Col>
        <Col md={6}>{isVisible('widgetWeather') && <WeatherWidget />}</Col>
        <Col md={6}>{isVisible('widgetBadges') && <BadgesWidget />}</Col>
      </Row>
    </Container>
  );
}
Dashboard.displayName = 'Dashboard';
