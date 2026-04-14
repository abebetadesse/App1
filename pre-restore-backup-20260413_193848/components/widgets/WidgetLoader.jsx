import React, { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';

const widgetRegistry = {
  weather: { url: 'https://widgets.weatherapi.com/weather-widget.js', name: 'Weather Widget' },
  news: { url: 'https://cdn.jsdelivr.net/npm/news-ticker-widget@1.0.0/index.cjs', name: 'News Ticker' },
  crypto: { url: 'https://widgets.coingecko.com/coingecko-coin-price-marquee-widget.js', name: 'Crypto Prices' }
};

const WidgetLoader = forwardRef(WidgetLoader);
export default function WidgetLoader({ widgetId, height = 200 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const widget = widgetRegistry[widgetId];
    if (!widget) return;
    const script = document.createElement('script');
    script.src = widget.url;
    script.async = true;
    script.onload = () => console.log(`${widget.name} loaded`);
    containerRef.current?.appendChild(script);
    return () => { script.remove(); };
  }, [widgetId]);

  return (
    <Card>
      <Card.Header>{widgetRegistry[widgetId]?.name || 'Widget'}</Card.Header>
      <Card.Body ref={containerRef} style={{ minHeight: height }}>
        <div className="text-muted">Loading widget...</div>
      </Card.Body>
    </Card>
  );
}
WidgetLoader.displayName = 'WidgetLoader';
