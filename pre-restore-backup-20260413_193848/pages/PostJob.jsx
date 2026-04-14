import React, { forwardRef } from 'react';
import { Container } from 'react-bootstrap';
import { JobPostingForm } from '../components/jobs/JobPostingForm';
import { useNavigate } from 'react-router-dom';

const PostJob = forwardRef((props, ref) {
  const navigate = useNavigate();
  return (
    <Container className="py-4">
      <JobPostingForm onSubmit={() => navigate('/jobs')} />
    </Container>
  );
}
PostJob.displayName = 'PostJob';
