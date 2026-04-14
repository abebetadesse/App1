import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
const ActivityFeed = forwardRef((props, ref) {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    const mock = [
      { id: 1, action: 'New user registered', time: '5 minutes ago' },
      { id: 2, action: 'Connection request accepted', time: '1 hour ago' },
      { id: 3, action: 'Moodle sync completed', time: '3 hours ago' }
    ];
    setActivities(mock);
  }, []);
  return <ListGroup>{activities.map(a => <ListGroup.Item key={a.id}>{a.action} <small className="text-muted float-end">{a.time}</small></ListGroup.Item>)}</ListGroup>;
}
ActivityFeed.displayName = 'ActivityFeed';
