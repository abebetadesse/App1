import React from 'react';
import Header from './Header';
import Footer from './Footer';
import EnhancedSidebar from './EnhancedSidebar';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-1">
        {user && <EnhancedSidebar />}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
