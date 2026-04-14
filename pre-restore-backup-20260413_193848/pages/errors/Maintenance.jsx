import React, { forwardRef } from 'react';
const Maintenance = forwardRef((props, ref) {
  return (<div className="container text-center mt-5"><h1>🔧 Under Maintenance</h1><p>We'll be back soon.</p></div>);
}
Maintenance.displayName = 'Maintenance';
