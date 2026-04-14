import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
const ProfileEdit = forwardRef((props, ref) {
  const { user } = useAuth();
  const [bio, setBio] = useState('');
  return (<div className="container mt-4" style={{ maxWidth: '600px' }}><h1>Edit Profile</h1><form><div className="mb-3"><label className="form-label">Name</label><input type="text" className="form-control" defaultValue={user?.name || ''} /></div><div className="mb-3"><label className="form-label">Bio</label><textarea className="form-control" rows="4" value={bio} onChange={e => setBio(e.target.value)} /></div><button className="btn btn-primary">Save Changes</button></form></div>);
}
ProfileEdit.displayName = 'ProfileEdit';
