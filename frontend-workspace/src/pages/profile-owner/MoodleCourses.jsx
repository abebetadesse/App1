import React, { useState, useEffect } from 'react';
import { Container, Card, Button, ListGroup, Badge } from 'react-bootstrap';

const MoodleCourses = forwardRef((props, ref) {
  const [courses, setCourses] = useState([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('moodle_courses');
    if (saved) setCourses(JSON.parse(saved));
    else setCourses([
      { id: 1, name: 'Advanced React Development', progress: 75, completed: false, grade: null },
      { id: 2, name: 'AI Fundamentals', progress: 45, completed: false, grade: null }
    ]);
  }, []);

  const syncMoodle = () => {
    setSyncing(true);
    setTimeout(() => {
      const updated = courses.map(c => ({ ...c, progress: Math.min(c.progress + 10, 100), completed: c.progress + 10 >= 100 }));
      setCourses(updated);
      localStorage.setItem('moodle_courses', JSON.stringify(updated));
      setSyncing(false);
    }, 1500);
  };

  return (
    <Container className="py-4">
      <h1>Moodle LMS Integration</h1>
      <p>Track your professional development courses</p>
      <Button onClick={syncMoodle} disabled={syncing} className="mb-3">{syncing ? 'Syncing...' : 'Sync from Moodle'}</Button>
      <ListGroup>{courses.map(course => (<ListGroup.Item key={course.id} className="d-flex justify-content-between"><div><strong>{course.name}</strong><div className="progress mt-1" style={{ width: '200px' }}><div className="progress-bar" style={{ width: `${course.progress}%` }}>{course.progress}%</div></div></div>{course.completed ? <Badge bg="success">Completed</Badge> : <Badge bg="info">In Progress</Badge>}</ListGroup.Item>))}</ListGroup>
    </Container>
  );
}
MoodleCourses.displayName = 'MoodleCourses';
