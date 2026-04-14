import React from 'react';
import { Container } from 'react-bootstrap';
import { JobPostingForm } from '../components/jobs/JobPostingForm';
import { useNavigate } from 'react-router-dom';

export default function PostJob() {
  const navigate = useNavigate();
  return (
    <Container className="py-4">
      <JobPostingForm onSubmit={() => navigate('/jobs')} />
    </Container>
  );
}
