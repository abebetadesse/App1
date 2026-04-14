import React from 'react';
import { Link } from 'react-router-dom';

export default function PrefetchLink({ to, children, ...props }) {
  const prefetch = () => {
    // Dynamically import the target route's module (if using lazy loading)
    const routeMap = {
      '/features': () => import('../../pages/Features'),
      '/pricing': () => import('../../pages/Pricing'),
      '/dashboard': () => import('../../pages/Dashboard'),
    };
    if (routeMap[to]) routeMap[to]().catch(() => {});
  };
  return <Link to={to} onMouseEnter={prefetch} onTouchStart={prefetch} {...props}>{children}</Link>;
}
