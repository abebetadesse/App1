# 1. Ensure directories exist
mkdir -p src/pages/auth, src/pages/profile-owner, src/pages/client, src/pages/admin, src/pages/errors

# 2. Create the Login Page (The gateway to the dashboards)
Set-Content -Path src/pages/auth/Login.jsx -Value @"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [role, setRole] = useState('profile_owner');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login with selected role
    login({ id: 'user_1', firstName: 'Abebe', role: role }, 'mock-token');
    // Navigate to the AI redirector which chooses the right dashboard
    navigate('/dashboard/ai-redirect');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '12px', textAlign: 'center' }}>
      <h2>Sign In</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '10px' }}>
          <option value="profile_owner">I am a Professional (Owner)</option>
          <option value="client">I am a Client (Hiring)</option>
          <option value="admin">System Admin</option>
        </select>
        <input type="email" placeholder="Email" style={{ padding: '10px' }} />
        <input type="password" placeholder="Password" style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Login to Platform
        </button>
      </form>
    </div>
  );
}
"@

# 3. Create the Profile Owner Dashboard
Set-Content -Path src/pages/profile-owner/Dashboard.jsx -Value @"
import React from 'react';
export default function ProfileOwnerDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Professional Dashboard</h1>
      <p>Welcome to your AI-Enhanced Profile. Here you can track your Moodle progress and incoming hire requests.</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ padding: '1rem', border: '1px solid #ccc', flex: 1 }}><h3>AI Rank</h3><p>Top 5% in React</p></div>
        <div style={{ padding: '1rem', border: '1px solid #ccc', flex: 1 }}><h3>Moodle Sync</h3><p>4 Certificates Active</p></div>
      </div>
    </div>
  );
}
"@

# 4. Create the Client Dashboard
Set-Content -Path src/pages/client/Dashboard.jsx -Value @"
import React from 'react';
export default function ClientDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Client Hiring Dashboard</h1>
      <p>Manage your projects and view AI-matched professionals for your requirements.</p>
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f7ff', borderRadius: '8px' }}>
        <h3>Top AI Matches</h3>
        <ul>
          <li>Full Stack Dev - 98% Match</li>
          <li>UI/UX Expert - 92% Match</li>
        </ul>
      </div>
    </div>
  );
}
"@

# 5. Create the Admin Dashboard
Set-Content -Path src/pages/admin/Dashboard.jsx -Value @"
import React from 'react';
export default function AdminDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>System Control Center</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}>
        <thead><tr style={{ background: '#eee' }}><th>User</th><th>Role</th><th>Status</th></tr></thead>
        <tbody><tr><td>Abebe</td><td>Owner</td><td>Active</td></tr></tbody>
      </table>
    </div>
  );
}
"@

# 6. Create the catch-all Error Page
Set-Content -Path src/pages/errors/NotFound.jsx -Value @"
import React from 'react';
import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
      <h1>404</h1>
      <p>Oops! The page you are looking for has been moved by the AI.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
"@