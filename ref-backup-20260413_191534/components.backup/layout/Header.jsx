import React, { forwardRef } from 'react';

const Header = forwardRef((props, ref) => (
  <header ref={ref} className="app-header" {...props}>
    Header
  </header>
));

Header.displayName = 'Header';
export default Header;
