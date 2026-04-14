import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  budget: z.number().positive('Budget must be positive'),
  category: z.string().min(1, 'Please select a category'),
  subcategory: z.string().optional(),
  visibility: z.enum(['public', 'platform', 'invite']),
  screeningQuestions: z.array(z.object({
    question: z.string().min(1, 'Question cannot be empty'),
    required: z.boolean()
  })).optional(),
  minSuccessScore: z.number().optional(),
  invitedFreelancers: z.string().optional(),
});

export const proposalSchema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  bidAmount: z.number().positive('Bid amount must be positive'),
});
