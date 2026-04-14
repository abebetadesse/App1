import React from 'react';
import Header from './Header';
import EnhancedSidebar from './EnhancedSidebar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        {user && <EnhancedSidebar />}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-slate-900">{children}</main>
      </div>
      <Footer />
    </div>
  );
};
export default Layout;
