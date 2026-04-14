import React, { forwardRef } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
const HowItWorks = forwardRef((props, ref) {
  const steps = [{ icon: '📝', title: 'Create Profile' }, { icon: '🔍', title: 'Find Work' }, { icon: '🤝', title: 'Connect' }, { icon: '⭐', title: 'Rate' }];
  return <Container className="py-5"><h1 className="text-center">How It Works</h1><Row>{steps.map((s,i)=><Col md={3} key={i}><Card className="text-center"><Card.Body><div className="display-4">{s.icon}</div><h4>{s.title}</h4></Card.Body></Card></Col>)}</Row></Container>;
}
HowItWorks.displayName = 'HowItWorks';
