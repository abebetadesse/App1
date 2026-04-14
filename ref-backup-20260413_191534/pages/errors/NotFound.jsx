import React from 'react';
import { Link } from 'react-router-dom';
export default function NotFound() { return <div className="container text-center mt-5"><h1>404 - Page Not Found</h1><Link to="/" className="btn btn-primary">Go Home</Link></div>; }
