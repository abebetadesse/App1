import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';

const MyProposals = forwardRef((props, ref) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/proposals/my', { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } })
      .then(res => res.json())
      .then(setProposals)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center"><Spinner /></div>;
  return (
    <Container className="py-4">
      <h1>My Proposals</h1>
      <Row>
        {proposals.map(p => (
          <Col md={6} key={p.id}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{p.jobId?.title || 'Job'}</Card.Title>
                <Card.Text>{p.coverLetter}</Card.Text>
                <Badge bg={p.status === 'pending' ? 'warning' : p.status === 'accepted' ? 'success' : 'danger'}>{p.status}</Badge>
                {p.boosted && <Badge bg="info" className="ms-2">Boosted</Badge>}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
MyProposals.displayName = 'MyProposals';
