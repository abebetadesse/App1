import React from 'react';
import { useOfflineDetect } from '../../hooks/useOfflineDetect';
export default function OfflineIndicator() {
  const isOffline = useOfflineDetect();
  if (!isOffline) return null;
  return <div style={{position:'fixed',bottom:'1rem',left:'1rem',background:'#dc3545',color:'white',padding:'0.5rem 1rem',borderRadius:'8px',zIndex:9999}}>📡 Offline – some features limited</div>;
}
