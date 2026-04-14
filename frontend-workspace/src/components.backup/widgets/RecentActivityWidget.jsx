import React, { useState, useEffect } from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const RecentActivityWidget = forwardRef((props, ref) {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    setActivities([
      { id: 1, action: 'New user registered', time: '5 min ago' },
      { id: 2, action: 'Connection request accepted', time: '1 hour ago' }
    ]);
  }, []);
  return (
    <Card className="mb-4">
      <Card.Header>🔄 Recent Activity</Card.Header>
      <ListGroup variant="flush">
        {activities.map(a => <ListGroup.Item key={a.id}>{a.action} <small className="text-muted float-end">{a.time}</small></ListGroup.Item>)}
      </ListGroup>
    </Card>
  );
}
RecentActivityWidget.displayName = 'RecentActivityWidget';
