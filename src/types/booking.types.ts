import type { ServiceId } from './index';

export interface BookingData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceId: ServiceId;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  createdAt?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface BookingFormInputs extends BookingData {
  agreeToTerms: boolean;
}

export interface DnaTestBooking extends BookingData {
  testType: 'paternity' | 'immigration' | 'family' | 'wellness';
  relationshipToOtherParty?: string;
  numberOfParticipants?: number;
}
