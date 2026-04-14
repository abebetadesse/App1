import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import TaxonomySelector from '../taxonomy/TaxonomySelector';
import { useAuth } from '../../contexts/AuthContext';

const jobSchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(50).max(5000),
  categoryPath: z.string(),
  budgetType: z.enum(['fixed', 'hourly']),
  budgetMin: z.number().positive(),
  budgetMax: z.number().positive(),
  duration: z.enum(['short', 'medium', 'long']),
  requiredSuccessScore: z.number().min(0).max(100).optional(),
  preScreeningQuestions: z.array(z.object({ question: z.string() })).max(5),
});

const JobPostingForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: { preScreeningQuestions: [{ question: '' }] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'preScreeningQuestions' });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        categoryPath: selectedSkills.map(s => s.id).join('.'),
        clientUserId: user.id
      };
      const response = await api.post('/jobs', payload);
      onSuccess?.(response.data);
    } catch (error) {
      console.error('Job posting failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="job-posting-form">
      <div className="form-group">
        <label>Job Title</label>
        <input {...register('title')} placeholder="e.g., Senior UI/UX Designer" />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea {...register('description')} rows={6} />
        {errors.description && <span className="error">{errors.description.message}</span>}
      </div>

      <div className="form-group">
        <label>Category / Skills Required</label>
        <TaxonomySelector onSelect={setSelectedSkills} selectedIds={selectedSkills.map(s => s.id)} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Budget Type</label>
          <select {...register('budgetType')}>
            <option value="fixed">Fixed Price</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>
        <div className="form-group">
          <label>Min Budget ($)</label>
          <input type="number" {...register('budgetMin', { valueAsNumber: true })} />
        </div>
        <div className="form-group">
          <label>Max Budget ($)</label>
          <input type="number" {...register('budgetMax', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="form-group">
        <label>Project Duration</label>
        <select {...register('duration')}>
          <option value="short">Less than 1 month</option>
          <option value="medium">1-3 months</option>
          <option value="long">3+ months</option>
        </select>
      </div>

      <div className="form-group">
        <label>Pre-screening Questions (optional)</label>
        {fields.map((field, index) => (
          <div key={field.id} className="question-row">
            <input {...register(`preScreeningQuestions.${index}.question`)} placeholder="Question" />
            <button type="button" onClick={() => remove(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ question: '' })} disabled={fields.length >= 5}>
          Add Question
        </button>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post Job'}
      </button>
    </form>
  );
};

export default JobPostingForm;
