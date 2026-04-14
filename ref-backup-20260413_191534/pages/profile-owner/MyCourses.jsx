import React, { useState } from 'react';
export default function MyCourses() {
  const [courses] = useState([{ name: 'Advanced React', progress: 75 }, { name: 'AI Fundamentals', progress: 45 }, { name: 'Communication Skills', progress: 90 }]);
  return (<div className="container mt-4"><h1>My Courses</h1><div className="list-group">{courses.map(c => (<div key={c.name} className="list-group-item"><h5>{c.name}</h5><div className="progress"><div className="progress-bar" style={{ width: `${c.progress}%` }}>{c.progress}%</div></div></div>))}</div><button className="btn btn-primary mt-3">Sync with Moodle</button></div>);
}
