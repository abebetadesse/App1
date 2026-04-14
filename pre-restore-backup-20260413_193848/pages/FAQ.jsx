import React, { useState } from 'react';
import { Container, Form, Accordion } from 'react-bootstrap';
const FAQ = forwardRef((props, ref) {
  const [search, setSearch] = useState('');
  const faqs = [
    { q: 'What is Tham Platform?', a: 'An AI-driven professional matching platform.' },
    { q: 'How does Moodle integration work?', a: 'Your course completions are synced to improve your ranking.' },
    { q: 'Is there a free plan?', a: 'Yes, basic membership is free forever.' }
  ];
  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Frequently Asked Questions</h1>
      <Form.Control type="text" placeholder="Search FAQs..." value={search} onChange={e=>setSearch(e.target.value)} className="mb-5 w-50 mx-auto" />
      <Accordion>{filtered.map((f,i)=><Accordion.Item key={i} eventKey={i}><Accordion.Header>{f.q}</Accordion.Header><Accordion.Body>{f.a}</Accordion.Body></Accordion.Item>)}</Accordion>
    </Container>
  );
}
FAQ.displayName = 'FAQ';
