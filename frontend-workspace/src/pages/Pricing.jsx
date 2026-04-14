import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const Pricing = forwardRef((props, ref) {
  const [billing, setBilling] = useState('monthly');
  const plans = [
    { name: 'Starter', price: 0, features: ['Profile', 'Basic search', '5 connections/month'] },
    { name: 'Professional', price: 29, features: ['Unlimited connections', 'Advanced ranking', 'Priority support'] },
    { name: 'Premium', price: 79, features: ['Featured profile', 'Dedicated manager', 'API access'] }
  ];
  const getPrice = (p) => billing === 'yearly' ? p * 10 : p;
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Pricing Plans</h1>
      <div className="text-center mb-4"><Button variant={billing==='monthly'?'primary':'outline-secondary'} onClick={()=>setBilling('monthly')}>Monthly</Button><Button variant={billing==='yearly'?'primary':'outline-secondary'} onClick={()=>setBilling('yearly')} className="ms-2">Yearly (Save 20%)</Button></div>
      <Row>{plans.map((p,i)=> <Col lg={4} key={i}><Card className="h-100"><Card.Body><Card.Title>{p.name}</Card.Title><h3>${getPrice(p.price)}<small>/{billing==='yearly'?'year':'month'}</small></h3><ul>{p.features.map(f=><li key={f}>{f}</li>)}</ul><Link to="/register" className="btn btn-primary w-100">Get Started</Link></Card.Body></Card></Col>)}</Row>
    </Container>
  );
}
Pricing.displayName = 'Pricing';
