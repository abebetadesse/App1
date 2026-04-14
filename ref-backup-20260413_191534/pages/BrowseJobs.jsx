import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import EnhancedSearch from '../components/search/EnhancedSearch';
import { ProposalForm } from '../components/jobs/ProposalForm';

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showProposal, setShowProposal] = useState(false);

  const fetchJobs = async (filters = {}) => {
    setLoading(true);
    const params = new URLSearchParams(filters).toString();
    try {
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      setJobs(data.jobs || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchJobs(); }, []);

  const handleProposal = (job) => {
    setSelectedJob(job);
    setShowProposal(true);
  };

  return (
    <Container className="py-4">
      <h1>Browse Jobs</h1>
      <EnhancedSearch onSearch={fetchJobs} />
      {loading ? <div className="text-center"><Spinner /></div> : (
        <Row>
          {jobs.map(job => (
            <Col md={6} key={job.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Text>{job.description?.substring(0, 150)}...</Card.Text>
                  <Badge bg="info">${job.budget}</Badge>
                  <Badge bg="secondary" className="ms-2">{job.visibility}</Badge>
                  <Button variant="primary" size="sm" className="mt-2 d-block" onClick={() => handleProposal(job)}>Submit Proposal</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <ProposalForm job={selectedJob} show={showProposal} onHide={() => setShowProposal(false)} onSubmit={fetchJobs} />
    </Container>
  );
}
