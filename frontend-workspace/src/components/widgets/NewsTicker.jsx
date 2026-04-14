import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

const NewsTicker = forwardRef((props, ref) {
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setNews(['New AI matching algorithm released', 'Moodle integration update', 'Platform reaches 10k users']);
    const interval = setInterval(() => setIndex(i => (i + 1) % 3), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mb-3">
      <Card.Body>
        <h6>📰 Latest News</h6>
        <p className="mb-0">{news[index]}</p>
      </Card.Body>
    </Card>
  );
}
NewsTicker.displayName = 'NewsTicker';
