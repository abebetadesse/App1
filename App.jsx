import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useAuth } from './contexts/AuthContext';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ClientDashboard = lazy(() => import('./pages/client/Dashboard'));
const PostJob = lazy(() => import('./pages/client/PostJob'));
const Search = lazy(() => import('./pages/client/Search'));
const SavedTalent = lazy(() => import('./pages/client/SavedTalent'));
const Reports = lazy(() => import('./pages/client/Reports'));
const ProfileOwnerDashboard = lazy(() => import('./pages/profile-owner/Dashboard'));
const FindWork = lazy(() => import('./pages/profile-owner/FindWork'));
const Contracts = lazy(() => import('./pages/profile-owner/Contracts'));
const Reviews = lazy(() => import('./pages/profile-owner/Reviews'));
const NotFound = lazy(() => import('./pages/errors/NotFound'));

const Loading = () => <div className="flex items-center justify-center min-h-screen">Loading...</div>;

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          
          <Route path="/client/dashboard" element={<ProtectedRoute requiredRole="client"><Layout><ClientDashboard /></Layout></ProtectedRoute>} />
          <Route path="/client/post-job" element={<ProtectedRoute requiredRole="client"><Layout><PostJob /></Layout></ProtectedRoute>} />
          <Route path="/client/search" element={<ProtectedRoute requiredRole="client"><Layout><Search /></Layout></ProtectedRoute>} />
          <Route path="/client/saved" element={<ProtectedRoute requiredRole="client"><Layout><SavedTalent /></Layout></ProtectedRoute>} />
          <Route path="/client/reports" element={<ProtectedRoute requiredRole="client"><Layout><Reports /></Layout></ProtectedRoute>} />
          
          <Route path="/profile-owner/dashboard" element={<ProtectedRoute requiredRole="profile_owner"><Layout><ProfileOwnerDashboard /></Layout></ProtectedRoute>} />
          <Route path="/profile-owner/find-work" element={<ProtectedRoute requiredRole="profile_owner"><Layout><FindWork /></Layout></ProtectedRoute>} />
          <Route path="/profile-owner/contracts" element={<ProtectedRoute requiredRole="profile_owner"><Layout><Contracts /></Layout></ProtectedRoute>} />
          <Route path="/profile-owner/reviews" element={<ProtectedRoute requiredRole="profile_owner"><Layout><Reviews /></Layout></ProtectedRoute>} />
          
          <Route path="/messages" element={<Layout><div>Messages</div></Layout>} />
          <Route path="/notifications" element={<Layout><div>Notifications</div></Layout>} />
          
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}
export default App;
