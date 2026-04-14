import React, { forwardRef } from 'react';

const Layout = forwardRef(({ children, ...props }, ref) => (
  <div ref={ref} className="layout" {...props}>
    {children}
  </div>
));

Layout.displayName = 'Layout';
export default Layout;
