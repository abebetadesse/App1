import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

export default function NewsTickerWidget() {
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setNews(['New feature: AI matching v2', 'Moodle integration updated', 'Platform reaches 10k users']);
    const interval = setInterval(() => setIndex(i => (i + 1) % 3), 5000);
    return () => clearInterval(interval);
  }, []);
  return <Card className="mb-4"><Card.Header>📰 News Ticker</Card.Header><Card.Body>{news[index]}</Card.Body></Card>;
}
