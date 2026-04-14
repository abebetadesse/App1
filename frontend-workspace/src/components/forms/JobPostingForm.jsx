import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Button from '../common/Button';

const JobPostingForm = ({ onSuccess, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: { preScreeningQuestions: [{ question: '' }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'preScreeningQuestions' });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // API call here
      console.log(data);
      onSuccess?.(data);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card max-w-4xl mx-auto">
      <div className="card-header">Post a New Job</div>
      <div className="card-body space-y-6">
        <div className="form-group">
          <label className="form-label">Job Title *</label>
          <input {...register('title', { required: true, minLength: 10 })} className="form-input" placeholder="e.g., Senior UI/UX Designer" />
          {errors.title && <span className="form-error">Title must be at least 10 characters</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea {...register('description', { required: true, minLength: 50 })} rows={6} className="form-textarea" placeholder="Describe the project in detail..." />
          {errors.description && <span className="form-error">Description must be at least 50 characters</span>}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="form-label">Budget Type</label>
            <select {...register('budgetType')} className="form-select">
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Min Budget ($)</label>
            <input type="number" {...register('budgetMin')} className="form-input" placeholder="0" />
          </div>
          <div className="form-group">
            <label className="form-label">Max Budget ($)</label>
            <input type="number" {...register('budgetMax')} className="form-input" placeholder="0" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Pre-screening Questions</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input {...register(`preScreeningQuestions.${index}.question`)} className="form-input flex-1" placeholder="Question" />
              <Button type="button" variant="outline" onClick={() => remove(index)}>✕</Button>
            </div>
          ))}
          <Button type="button" variant="ghost" onClick={() => append({ question: '' })}>+ Add Question</Button>
        </div>
      </div>
      <div className="card-footer flex justify-end gap-3">
        <Button type="button" variant="secondary">Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>Post Job</Button>
      </div>
    </form>
  );
};

export default JobPostingForm;
