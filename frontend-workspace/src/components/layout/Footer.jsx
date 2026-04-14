import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-auto">
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">Tham Platform</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">AI-powered professional marketplace.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/browse" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600">Browse</Link></li>
            <li><Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600">About</Link></li>
            <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600">Privacy</Link></li>
            <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-slate-700 mt-8 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Tham Platform. All rights reserved.
      </div>
    </div>
  </footer>
);
export default Footer;
