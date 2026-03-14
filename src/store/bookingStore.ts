import { create } from 'zustand';
import type { BookingData } from '@/types/booking.types';

interface BookingState {
  bookings: BookingData[];
  isLoading: boolean;
  error: string | null;
  addBooking: (booking: BookingData) => Promise<void>;
  fetchBookings: () => Promise<void>;
  updateBooking: (id: string, data: Partial<BookingData>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set: any) => ({
  bookings: [],
  isLoading: false,
  error: null,

  addBooking: async (booking: BookingData) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Integrate with Supabase
      set((state: BookingState) => ({
        bookings: [...state.bookings, booking],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add booking', isLoading: false });
    }
  },

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Integrate with Supabase
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch bookings', isLoading: false });
    }
  },

  updateBooking: async (id: string, data: Partial<BookingData>) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Integrate with Supabase
      set((state: BookingState) => ({
        bookings: state.bookings.map((b: BookingData) => (b.id === id ? { ...b, ...data } : b)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update booking', isLoading: false });
    }
  },

  deleteBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Integrate with Supabase
      set((state: BookingState) => ({
        bookings: state.bookings.filter((b: BookingData) => b.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete booking', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
