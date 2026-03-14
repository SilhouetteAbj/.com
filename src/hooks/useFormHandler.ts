import { useState, useCallback } from 'react';
import { useForm, type SubmitHandler, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema } from 'zod';
import { toast } from 'sonner';

interface UseFormHandlerOptions<T extends FieldValues> {
  schema: ZodSchema;
  onSubmit: (data: T) => Promise<any>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useFormHandler = <T extends FieldValues>({ schema, onSubmit, onSuccess, onError }: UseFormHandlerOptions<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const handleSubmit = useCallback(
    async (data: T) => {
      try {
        setIsSubmitting(true);
        const result = await onSubmit(data);
        toast.success('Form submitted successfully!');
        onSuccess?.(result);
        form.reset();
      } catch (error) {
        console.error('Form submission error:', error);
        toast.error('Failed to submit form. Please try again.');
        onError?.(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, onSuccess, onError, form]
  );

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit as SubmitHandler<T>),
  };
};
