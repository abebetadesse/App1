import React, { forwardRef } from "react";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

let timeout;
const GlobalProgress = forwardRef((props, ref) {
  const location = useLocation();
  useEffect(() => {
    const bar = document.getElementById('global-progress-bar');
    if (bar) bar.style.width = '70%';
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (bar) bar.style.width = '100%';
      setTimeout(() => { if (bar) bar.style.width = '0%'; }, 200);
    }, 300);
    return () => clearTimeout(timeout);
  }, [location]);
  return (
    <div id="global-progress-bar" style={{
      position: 'fixed', top: 0, left: 0, width: '0%', height: '3px',
      background: 'linear-gradient(90deg, #646cff, #61dafb)',
      transition: 'width 0.3s ease', zIndex: 9999, boxShadow: '0 0 10px #646cff'
    }} />
  );
}
GlobalProgress.displayName = 'GlobalProgress';
