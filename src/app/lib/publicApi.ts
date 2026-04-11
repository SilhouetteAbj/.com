const FUNCTION_BASE = '/.netlify/functions';

const postToFunction = async <T>(endpoint: string, payload: unknown): Promise<T> => {
  const response = await fetch(`${FUNCTION_BASE}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data?.error === 'string' ? data.error : 'Request failed.';
    throw new Error(message);
  }

  return data as T;
};

export const submitPublicAppointment = async (payload: {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}) => postToFunction<{ appointment: { id: string } }>('submit-booking', payload);

export const submitReferralPartner = async (payload: {
  fullName: string;
  placeOfWork: string;
  phone: string;
}) => postToFunction<{ referralPartner: { id: string } }>('submit-referral', payload);

export const trackAnalyticsEvent = async (payload: {
  eventType: string;
  item: string;
  path?: string | null;
}) => postToFunction<{ ok: true }>('track-analytics', payload);
