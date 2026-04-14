import React, { forwardRef } from 'react';
const MoodleAdmin = forwardRef((props, ref) {
  return (<div className="container mt-4"><h1>Moodle Admin</h1><button className="btn btn-primary">Sync All Courses</button></div>);
}
MoodleAdmin.displayName = 'MoodleAdmin';
