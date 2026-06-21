import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z.string().min(2, 'Enter your first name'),
  lastName: z.string().min(2, 'Enter your last name'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  interest: z.string().min(1, 'Please select an option'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to continue',
  }),
});

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
