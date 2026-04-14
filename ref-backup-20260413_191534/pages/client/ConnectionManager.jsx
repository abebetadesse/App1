import React, { useState } from 'react';
export default function ConnectionManager() {
  const [connections] = useState([{ name: 'David Lee', status: 'accepted' }, { name: 'Emma Watson', status: 'pending' }]);
  return (<div className="container mt-4"><h1>Connections</h1><div className="list-group">{connections.map(c => (<div key={c.name} className="list-group-item d-flex justify-content-between"><h5>{c.name}</h5><span className={`badge ${c.status === 'accepted' ? 'bg-success' : 'bg-warning'}`}>{c.status}</span></div>))}</div></div>);
}
