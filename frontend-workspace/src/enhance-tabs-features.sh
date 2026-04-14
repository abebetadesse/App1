#!/bin/bash
# enhance-tabs-features.sh - Add comprehensive tabs and features

set -e
FRONTEND_SRC="./frontend-workspace/src"
cd "$(dirname "$0")"

echo "🚀 Enhancing Tham Platform with additional tabs and features..."

# -----------------------------------------------------------------------------
# 1. Enhanced Navigation Tabs Component
# -----------------------------------------------------------------------------
mkdir -p "$FRONTEND_SRC/components/navigation"
cat > "$FRONTEND_SRC/components/navigation/TabNavigation.jsx" << 'EOF'
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Briefcase, Search, MessageSquare, Bell, User, 
  LayoutDashboard, FileText, BarChart3, Settings,
  BookOpen, Star, Clock, Shield
} from 'lucide-react';

const TabNavigation = ({ role }) => {
  const clientTabs = [
    { to: '/client/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/client/post-job', icon: Briefcase, label: 'Post a Job' },
    { to: '/client/search', icon: Search, label: 'Find Talent' },
    { to: '/client/projects', icon: FileText, label: 'My Projects' },
    { to: '/client/saved', icon: Star, label: 'Saved Talent' },
    { to: '/client/reports', icon: BarChart3, label: 'Reports' },
    { to: '/messages', icon: MessageSquare, label: 'Messages', badge: 3 },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const freelancerTabs = [
    { to: '/profile-owner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile-owner/find-work', icon: Search, label: 'Find Work' },
    { to: '/profile-owner/proposals', icon: FileText, label: 'My Proposals' },
    { to: '/profile-owner/contracts', icon: Briefcase, label: 'Contracts' },
    { to: '/profile-owner/courses', icon: BookOpen, label: 'Courses' },
    { to: '/profile-owner/earnings', icon: BarChart3, label: 'Earnings' },
    { to: '/profile-owner/reviews', icon: Star, label: 'Reviews' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
  ];

  const tabs = role === 'client' ? clientTabs : freelancerTabs;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
                  }`
                }
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs px-1.5 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
EOF

# -----------------------------------------------------------------------------
# 2. Enhanced Layout with Tabs
# -----------------------------------------------------------------------------
cat > "$FRONTEND_SRC/components/layout/Layout.jsx" << 'EOF'
import React from 'react';
import Header from './Header';
import EnhancedSidebar from './EnhancedSidebar';
import TabNavigation from '../navigation/TabNavigation';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const showTabs = user && !location.pathname.includes('/messages/') && !location.pathname.includes('/settings');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-1">
        {user && <EnhancedSidebar />}
        <main className="flex-1">
          {showTabs && <TabNavigation role={user?.role} />}
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
EOF

# -----------------------------------------------------------------------------
# 3. New Pages for Added Features
# -----------------------------------------------------------------------------

# Saved Talent Page (Client)
mkdir -p "$FRONTEND_SRC/pages/client"
cat > "$FRONTEND_SRC/pages/client/SavedTalent.jsx" << 'EOF'
import React, { useState } from 'react';
import { Star, MapPin, DollarSign, MessageCircle } from 'lucide-react';

const SavedTalent = () => {
  const [savedFreelancers] = useState([
    { id: 1, name: 'Sarah Chen', title: 'Senior UI/UX Designer', rate: 65, location: 'United States', rating: 4.9, avatar: 'SC' },
    { id: 2, name: 'Marcus Rivera', title: 'Full Stack Developer', rate: 75, location: 'Canada', rating: 5.0, avatar: 'MR' },
    { id: 3, name: 'Elena Popov', title: 'Content Strategist', rate: 45, location: 'UK', rating: 4.8, avatar: 'EP' },
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Talent</h1>
        <p className="text-gray-600 dark:text-gray-400">Freelancers you've bookmarked for later</p>
      </div>
      <div className="grid gap-4">
        {savedFreelancers.map(freelancer => (
          <div key={freelancer.id} className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold">
                {freelancer.avatar}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">{freelancer.name}</h3>
                  <button className="text-yellow-500">
                    <Star size={20} fill="currentColor" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{freelancer.title}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {freelancer.location}</span>
                  <span className="flex items-center gap-1"><DollarSign size={14} /> ${freelancer.rate}/hr</span>
                  <span>⭐ {freelancer.rating}</span>
                </div>
              </div>
              <button className="btn-primary">
                <MessageCircle size={16} className="mr-2" />
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SavedTalent;
EOF

# Client Reports Page
cat > "$FRONTEND_SRC/pages/client/Reports.jsx" << 'EOF'
import React from 'react';
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import StatsCard from '../../components/widgets/StatsCard';

const Reports = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Reports & Analytics</h1>
      
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Spent" value="$24,500" icon={DollarSign} color="primary" trend={12} />
        <StatsCard title="Active Projects" value="8" icon={Clock} color="success" />
        <StatsCard title="Freelancers Hired" value="15" icon={Users} color="primary" />
        <StatsCard title="Avg. Project Value" value="$3,062" icon={TrendingUp} color="warning" trend={5} />
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Spending by Category</h2>
          <div className="space-y-3">
            {['Development', 'Design', 'Marketing', 'Writing'].map(cat => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{cat}</span>
                  <span>{Math.floor(Math.random()*40+20)}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-2 bg-primary-600 rounded-full" style={{width: `${Math.random()*40+20}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Monthly Spending</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {['Jan','Feb','Mar','Apr','May','Jun'].map((m,i) => (
              <div key={m} className="flex-1 text-center">
                <div className="bg-primary-100 dark:bg-primary-900 rounded-t" style={{height: `${30 + i*15}px`}}></div>
                <span className="text-xs mt-2 block">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reports;
EOF

# Find Work Page (Freelancer)
mkdir -p "$FRONTEND_SRC/pages/profile-owner"
cat > "$FRONTEND_SRC/pages/profile-owner/FindWork.jsx" << 'EOF'
import React, { useState } from 'react';
import { Search, Filter, Clock, DollarSign } from 'lucide-react';
import AdvancedFilters from '../../components/search/AdvancedFilters';

const FindWork = () => {
  const [jobs] = useState([
    { id: 1, title: 'React Developer for SaaS Dashboard', client: 'TechCorp', budget: '$3,000-$5,000', posted: '2 hours ago', proposals: 5 },
    { id: 2, title: 'UI/UX Designer for Mobile App', client: 'DesignStudio', budget: '$40-$60/hr', posted: '5 hours ago', proposals: 12 },
    { id: 3, title: 'Content Writer for Tech Blog', client: 'ContentHub', budget: '$500-$800', posted: '1 day ago', proposals: 8 },
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-80">
          <AdvancedFilters />
        </div>
        <div className="flex-1">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search jobs..." className="form-input pl-10" />
          </div>
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="card p-6 hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{job.client}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><DollarSign size={14} /> {job.budget}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {job.posted}</span>
                  <span>{job.proposals} proposals</span>
                </div>
                <button className="btn-primary">Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FindWork;
EOF

# Contracts Page (Freelancer)
cat > "$FRONTEND_SRC/pages/profile-owner/Contracts.jsx" << 'EOF'
import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Contracts = () => {
  const contracts = [
    { id: 1, client: 'TechCorp', project: 'React Dashboard Development', status: 'active', dueDate: '2026-05-15', budget: '$4,500' },
    { id: 2, client: 'DesignStudio', project: 'Mobile App UI Design', status: 'completed', dueDate: '2026-04-01', budget: '$2,800' },
  ];

  const statusIcon = { active: Clock, completed: CheckCircle, disputed: AlertCircle };
  const statusColor = { active: 'text-blue-600', completed: 'text-green-600', disputed: 'text-red-600' };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-4 mb-6">
        <button className="tab tab-active">Active</button>
        <button className="tab">Completed</button>
        <button className="tab">All</button>
      </div>
      <div className="space-y-4">
        {contracts.map(c => {
          const Icon = statusIcon[c.status];
          return (
            <div key={c.id} className="card p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{c.project}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{c.client}</p>
                </div>
                <div className={`flex items-center gap-1 ${statusColor[c.status]}`}>
                  <Icon size={16} />
                  <span className="capitalize">{c.status}</span>
                </div>
              </div>
              <div className="flex gap-6 mt-4 text-sm">
                <span>Due: {c.dueDate}</span>
                <span>Budget: {c.budget}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Contracts;
EOF

# Reviews Page
cat > "$FRONTEND_SRC/pages/profile-owner/Reviews.jsx" << 'EOF'
import React from 'react';
import { Star } from 'lucide-react';

const Reviews = () => {
  const reviews = [
    { id: 1, client: 'John D.', project: 'Website Redesign', rating: 5, comment: 'Excellent work, delivered ahead of schedule!', date: '2026-03-15' },
    { id: 2, client: 'Sarah M.', project: 'Mobile App', rating: 4.8, comment: 'Great communication and quality code.', date: '2026-02-20' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
          <Star size={16} className="fill-yellow-500 text-yellow-500" />
          <span className="font-semibold">4.9</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">(24 reviews)</span>
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="card p-6">
            <div className="flex justify-between">
              <h3 className="font-semibold">{r.client}</h3>
              <div className="flex">{Array(r.rating).fill(0).map((_,i)=><Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />)}</div>
            </div>
            <p className="text-sm text-gray-500 mb-2">{r.project} • {r.date}</p>
            <p className="text-gray-700 dark:text-gray-300">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Reviews;
EOF

# -----------------------------------------------------------------------------
# 4. Update App.jsx with New Routes
# -----------------------------------------------------------------------------
cat > "$FRONTEND_SRC/App.jsx" << 'EOF'
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
          <Route path="/client/projects" element={<ProtectedRoute requiredRole="client"><Layout><div>My Projects</div></Layout></ProtectedRoute>} />
          
          <Route path="/profile-owner/dashboard" element={<ProtectedRoute requiredRole="profile_owner"><Layout><ProfileOwnerDashboard /></Layout></ProtectedRoute>} />
          <Route path="/profile-owner/find-work" element={<ProtectedRoute requiredRole="profile_owner"><Layout><FindWork /></Layout></ProtectedRoute>} />
          <Route path="/profile-owner/proposals" element={<ProtectedRoute requiredRole="profile_owner"><Layout><div>My Proposals</div></Layout></ProtectedRoute>} />
          <Route path="/profile-owner/contracts" element={<ProtectedRoute requiredRole="profile_owner"><Layout><Contracts /></Layout></ProtectedRoute>} />
          <Route path="/profile-owner/reviews" element={<ProtectedRoute requiredRole="profile_owner"><Layout><Reviews /></Layout></ProtectedRoute>} />
          
          <Route path="/messages" element={<Layout><div className="p-6">Messages</div></Layout>} />
          <Route path="/notifications" element={<Layout><div className="p-6">Notifications</div></Layout>} />
          
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}
export default App;
EOF

# -----------------------------------------------------------------------------
# 5. Enhanced Header with More Options
# -----------------------------------------------------------------------------
cat > "$FRONTEND_SRC/components/layout/Header.jsx" << 'EOF'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, Bell, MessageSquare, Search, ChevronDown } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-2xl font-bold gradient-text">Tham</Link>
        </div>

        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-full focus:ring-2" />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">{theme==='dark'?'☀️':'🌙'}</button>
          {user && (
            <>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <MessageSquare size={20} />
              </button>
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700">{user.email?.[0].toUpperCase()}</div>
                  <ChevronDown size={16} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border py-1">
                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            </>
          )}
          {!user && (
            <div className="flex gap-2">
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
EOF

# -----------------------------------------------------------------------------
# 6. Install Required Icons
# -----------------------------------------------------------------------------
cd frontend-workspace
npm install lucide-react

# -----------------------------------------------------------------------------
# 7. Clear Cache
# -----------------------------------------------------------------------------
rm -rf node_modules/.vite

echo ""
echo "✅ Enhanced with tabs and features!"
echo "New pages: Saved Talent, Reports, Find Work, Contracts, Reviews"
echo "Enhanced navigation with tabs for both roles"
echo "Run 'npm run dev' to see the improvements."