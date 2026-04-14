import React, { forwardRef } from 'react';

const EnhancedSidebar = forwardRef((props, ref) => (
  <div ref={ref} className="enhanced-sidebar" {...props}>
    Sidebar Content
  </div>
));

EnhancedSidebar.displayName = 'EnhancedSidebar';
export default EnhancedSidebar;
