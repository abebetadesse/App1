import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

const WeatherWidget = forwardRef((props, ref) {
  const [weather, setWeather] = useState({ temp: 22, condition: 'Sunny' });
  useEffect(() => {
    setTimeout(() => setWeather({ temp: 22, condition: 'Sunny' }), 500);
  }, []);
  return <Card className="mb-4"><Card.Header>🌤️ Weather</Card.Header><Card.Body>{weather.temp}°C, {weather.condition}</Card.Body></Card>;
}
WeatherWidget.displayName = 'WeatherWidget';
