import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Button, Card, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { jobSchema } from '../../utils/validation/jobSchema';
import { TaxonomySelector } from '../taxonomy/TaxonomySelector';
import { showToast } from '../common/ToastProvider';

export const JobPostingFormEnhanced = ({ onSubmit }) => {
  const { register, control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      budget: '',
      visibility: 'public',
      screeningQuestions: [{ question: '', required: true }],
      minSuccessScore: '',
      invitedFreelancers: '',
      category: '',
      subcategory: '',
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'screeningQuestions' });
  const category = watch('category');

  const submitForm = async (data) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify({ ...data, budget: Number(data.budget), minSuccessScore: data.minSuccessScore ? Number(data.minSuccessScore) : undefined })
      });
      if (res.ok) {
        showToast.success('Job posted successfully!');
        setTimeout(() => onSubmit && onSubmit(), 1500);
      } else {
        const err = await res.json();
        showToast.error(err.error || 'Failed to post job');
      }
    } catch (err) {
      showToast.error(err.message);
    }
  };

  return (
    <Card>
      <Card.Body>
        <h4>Post a New Job</h4>
        <Form onSubmit={handleSubmit(submitForm)}>
          <Form.Group><Form.Label>Title</Form.Label><Form.Control {...register('title')} isInvalid={!!errors.title} /><Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback></Form.Group>
          <Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={4} {...register('description')} isInvalid={!!errors.description} /><Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback></Form.Group>
          <Row>
            <Col><Form.Label>Category</Form.Label><TaxonomySelector level={1} onChange={val => setValue('category', val)} /></Col>
            <Col><Form.Label>Subcategory</Form.Label><TaxonomySelector level={2} parent={category} onChange={val => setValue('subcategory', val)} /></Col>
          </Row>
          <Row>
            <Col><Form.Label>Budget ($)</Form.Label><Form.Control type="number" {...register('budget', { valueAsNumber: true })} isInvalid={!!errors.budget} /><Form.Control.Feedback type="invalid">{errors.budget?.message}</Form.Control.Feedback></Col>
            <Col><Form.Label>Visibility</Form.Label><Form.Select {...register('visibility')}><option value="public">Public</option><option value="platform">Platform Only</option><option value="invite">Invite Only</option></Form.Select></Col>
          </Row>
          <Row>
            <Col><Form.Label>Min Success Score</Form.Label><Form.Control type="number" {...register('minSuccessScore', { valueAsNumber: true })} /></Col>
            <Col><Form.Label>Invited Freelancers (IDs)</Form.Label><Form.Control {...register('invitedFreelancers')} /></Col>
          </Row>
          <div className="mt-3"><strong>Screening Questions</strong> <Button type="button" size="sm" onClick={() => append({ question: '', required: true })}>+ Add</Button></div>
          {fields.map((field, idx) => (
            <div key={field.id} className="d-flex gap-2 mt-2">
              <Form.Control placeholder="Question" {...register(`screeningQuestions.${idx}.question`)} isInvalid={!!errors.screeningQuestions?.[idx]?.question} />
              <Form.Check label="Required" {...register(`screeningQuestions.${idx}.required`)} />
              <Button type="button" variant="danger" size="sm" onClick={() => remove(idx)}>Remove</Button>
            </div>
          ))}
          <Button type="submit" className="mt-3 w-100" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="sm" /> : 'Post Job'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};
