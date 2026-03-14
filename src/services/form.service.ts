import { supabase } from './supabase';
import type { ContactFormData, InvestorInquiryFormData } from '@/types/form.types';
import type { ApiResponse } from '@/types/index';

export const formService = {
  // Contact Form
  async submitContactForm(formData: ContactFormData): Promise<ApiResponse<ContactFormData>> {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([{ ...formData, createdAt: new Date().toISOString(), status: 'new' }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      return { success: false, error: 'Failed to submit contact form' };
    }
  },

  // Investor Inquiry Form
  async submitInvestorInquiry(formData: InvestorInquiryFormData): Promise<ApiResponse<InvestorInquiryFormData>> {
    try {
      const { data, error } = await supabase
        .from('investor_inquiries')
        .insert([{ ...formData, createdAt: new Date().toISOString(), status: 'new' }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Failed to submit investor inquiry:', error);
      return { success: false, error: 'Failed to submit investor inquiry' };
    }
  },

  // Get all contact submissions (for admin)
  async getContactSubmissions(): Promise<ApiResponse<ContactFormData[]>> {
    try {
      const { data, error } = await supabase.from('contact_submissions').select('*').order('createdAt', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Failed to fetch contact submissions:', error);
      return { success: false, error: 'Failed to fetch contact submissions' };
    }
  },

  // Get all investor inquiries (for admin)
  async getInvestorInquiries(): Promise<ApiResponse<InvestorInquiryFormData[]>> {
    try {
      const { data, error } = await supabase.from('investor_inquiries').select('*').order('createdAt', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Failed to fetch investor inquiries:', error);
      return { success: false, error: 'Failed to fetch investor inquiries' };
    }
  },

  // Update form submission status
  async updateSubmissionStatus(table: string, id: string, status: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from(table).update({ status }).eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Failed to update submission status:', error);
      return { success: false, error: 'Failed to update submission status' };
    }
  },
};
