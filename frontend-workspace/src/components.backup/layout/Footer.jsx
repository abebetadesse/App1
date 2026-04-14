import React, { forwardRef } from 'react';

const Footer = forwardRef((props, ref) => (
  <footer ref={ref} className="app-footer" {...props}>
    Footer
  </footer>
));

Footer.displayName = 'Footer';
export default Footer;
