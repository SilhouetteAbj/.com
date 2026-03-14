// Service options
export const SERVICES = {
  '4d-ultrasound': {
    label: '4D Ultrasound',
    icon: 'Activity',
    color: 'from-blue-500 to-cyan-500',
  },
  'mri-scan': {
    label: 'MRI Scan',
    icon: 'Brain',
    color: 'from-indigo-500 to-blue-500',
  },
  'mammogram': {
    label: 'Mammogram',
    icon: 'Heart',
    color: 'from-pink-500 to-rose-500',
  },
  'endoscopy': {
    label: 'Endoscopy',
    icon: 'Eye',
    color: 'from-emerald-500 to-teal-500',
    imageUrl: 'https://drganesh.sg/wp-content/uploads/2022/02/shutterstock_719554555-min-1.jpg',
  },
  'colonoscopy': {
    label: 'Colonoscopy',
    icon: 'Scan',
    color: 'from-amber-500 to-orange-500',
    imageUrl: 'https://cdn.medicalpark.com.tr/colonoscopy.jpg',
  },
  'eeg': {
    label: 'EEG',
    icon: 'Scan',
    color: 'from-violet-500 to-purple-500',
  },
};

// DNA Test Types
export const DNA_TEST_TYPES = ['paternity', 'immigration', 'family', 'wellness'] as const;

// Booking statuses
export const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const;

// Chat statuses
export const CHAT_STATUSES = ['open', 'closed', 'assigned'] as const;

// Form submission statuses
export const FORM_STATUSES = {
  contact: ['new', 'read', 'responded'] as const,
  referral: ['pending', 'processed', 'completed'] as const,
  investor: ['new', 'reviewing', 'contacted'] as const,
};

// Time slots for booking
export const BOOKING_TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

// Error messages
export const ERROR_MESSAGES = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must not exceed ${max} characters`,
};

// Success messages
export const SUCCESS_MESSAGES = {
  bookingCreated: 'Your appointment has been successfully booked!',
  formSubmitted: 'Thank you! We will get back to you soon.',
  messagesSent: 'Your message has been sent.',
};
