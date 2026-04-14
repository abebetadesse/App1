import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';

const Marketplace = forwardRef((props, ref) {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '' });
  useEffect(() => {
    const savedCats = localStorage.getItem('marketplace_categories');
    if (savedCats) setCategories(JSON.parse(savedCats));
    // Mock services
    setServices([
      { id: 1, name: 'React Development', category: 'Web Development', price: 75, provider: 'Alice J.', rating: 4.9 },
      { id: 2, name: 'AI Consulting', category: 'AI/ML', price: 120, provider: 'Bob S.', rating: 4.8 }
    ]);
  }, []);
  const filtered = services.filter(s => (!filters.category || s.category === filters.category) && (!filters.minPrice || s.price >= filters.minPrice) && (!filters.maxPrice || s.price <= filters.maxPrice));
  return (
    <Container className="py-4">
      <h1>Service Marketplace</h1>
      <Row><Col md={3}><Card><Card.Body><h5>Filters</h5><Form><Form.Group><Form.Label>Category</Form.Label><Form.Select onChange={e => setFilters({...filters, category: e.target.value})}><option value="">All</option>{categories.map(c => <option key={c.id}>{c.name}</option>)}</Form.Select></Form.Group><Form.Group><Form.Label>Min Price ($)</Form.Label><Form.Control type="number" onChange={e => setFilters({...filters, minPrice: e.target.value})} /></Form.Group><Form.Group><Form.Label>Max Price ($)</Form.Label><Form.Control type="number" onChange={e => setFilters({...filters, maxPrice: e.target.value})} /></Form.Group></Form></Card.Body></Card></Col><Col md={9}><Row>{filtered.map(s => (<Col md={6} key={s.id} className="mb-3"><Card><Card.Body><Card.Title>{s.name}</Card.Title><Badge bg="info">{s.category}</Badge><p>${s.price}/hr</p><p>Provider: {s.provider}</p><Button size="sm">View Details</Button></Card.Body></Card></Col>))}</Row></Col></Row>
    </Container>
  );
}
Marketplace.displayName = 'Marketplace';
