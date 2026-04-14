import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export default function Features() {
  const features = [
    { icon: '🔍', title: 'Advanced Search', desc: 'Find perfect matches with AI filters.' },
    { icon: '🎓', title: 'Moodle Integration', desc: 'Sync courses from K4B Moodle LMS.' },
    { icon: '🤝', title: 'Instant Connections', desc: 'Real-time notifications and messaging.' },
    { icon: '📊', title: 'Smart Ranking', desc: 'Rankings based on course performance.' },
    { icon: '💼', title: 'Profile Management', desc: 'Showcase skills with certifications.' },
    { icon: '🛡️', title: 'Secure Platform', desc: 'Enterprise-grade security.' }
  ];
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Platform Features</h1>
      <Row>{features.map((f,i)=> <Col md={4} key={i} className="mb-4"><Card className="h-100 text-center"><Card.Body><div className="display-4">{f.icon}</div><Card.Title>{f.title}</Card.Title><Card.Text>{f.desc}</Card.Text></Card.Body></Card></Col>)}</Row>
      <div className="text-center mt-4"><Link to="/register" className="btn btn-primary btn-lg">Get Started</Link></div>
    </Container>
  );
}
