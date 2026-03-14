import { supabase } from './supabase';
import type { BookingData } from '@/types/booking.types';
import type { ApiResponse } from '@/types/index';

const TABLE_NAME = 'bookings';

export const bookingService = {
  async createBooking(booking: BookingData): Promise<ApiResponse<BookingData>> {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).insert([booking]).select().single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Failed to create booking:', error);
      return { success: false, error: 'Failed to create booking' };
    }
  },

  async getBookings(): Promise<ApiResponse<BookingData[]>> {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select('*');

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      return { success: false, error: 'Failed to fetch bookings' };
    }
  },

  async getBooking(id: string): Promise<ApiResponse<BookingData>> {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select('*').eq('id', id).single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      return { success: false, error: 'Failed to fetch booking' };
    }
  },

  async updateBooking(id: string, updates: Partial<BookingData>): Promise<ApiResponse<BookingData>> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Failed to update booking:', error);
      return { success: false, error: 'Failed to update booking' };
    }
  },

  async deleteBooking(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Failed to delete booking:', error);
      return { success: false, error: 'Failed to delete booking' };
    }
  },

  // Get bookings by status
  async getBookingsByStatus(status: string): Promise<ApiResponse<BookingData[]>> {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select('*').eq('status', status);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Failed to fetch bookings by status:', error);
      return { success: false, error: 'Failed to fetch bookings' };
    }
  },
};
