import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
const NotFound = forwardRef((props, ref) { return <div className="container text-center mt-5"><h1>404 - Page Not Found</h1><Link to="/" className="btn btn-primary">Go Home</Link></div>; }
NotFound.displayName = 'NotFound';
