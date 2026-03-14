import { z } from 'zod';

// Common validators
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().regex(/^\d{10}$/, 'Phone must be 10 digits');
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters');

// Booking form validation
export const bookingFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  serviceId: z.string().min(1, 'Please select a service'),
  preferredDate: z.string().min(1, 'Please select a date'),
  preferredTime: z.string().min(1, 'Please select a time'),
  notes: z.string().optional(),
  agreeToTerms: z.boolean().refine((val: boolean) => val === true, 'You must agree to the terms'),
});

// Contact form validation
export const contactFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(100, 'Subject must not exceed 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must not exceed 1000 characters'),
});

// Investor inquiry form validation
export const investorInquiryFormSchema = z.object({
  companyName: z.string().min(2, 'Company name required'),
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  investmentType: z.enum(['equity', 'partnership', 'loan', 'other']),
  investmentAmount: z.string().optional(),
  message: z.string().min(10, 'Please provide details'),
});

// DNA test booking validation
export const dnaTestBookingSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  testType: z.enum(['paternity', 'immigration', 'family', 'wellness']),
  preferredDate: z.string().min(1, 'Please select a date'),
  preferredTime: z.string().min(1, 'Please select a time'),
  numberOfParticipants: z.number().optional(),
  agreeToTerms: z.boolean().refine((val: boolean) => val === true, 'You must agree to the terms'),
});

// Export type definitions from schemas
export type BookingFormData = z.infer<typeof bookingFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type InvestorInquiryFormData = z.infer<typeof investorInquiryFormSchema>;
export type DnaTestBookingData = z.infer<typeof dnaTestBookingSchema>;
