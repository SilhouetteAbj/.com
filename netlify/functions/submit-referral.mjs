import { insertRow, jsonResponse, readJsonBody } from './_supabase.mjs';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const body = readJsonBody(event);
  if (!body) {
    return jsonResponse(400, { error: 'Invalid JSON payload.' });
  }

  const { fullName, placeOfWork, phone } = body;

  if (!fullName || !placeOfWork || !phone) {
    return jsonResponse(400, { error: 'Missing required referral fields.' });
  }

  try {
    const row = await insertRow('referral_partners', {
      full_name: fullName,
      place_of_work: placeOfWork,
      phone,
      status: 'pending',
      referrals_count: 0,
      created_at: new Date().toISOString(),
    });

    return jsonResponse(200, { referralPartner: row });
  } catch (error) {
    return jsonResponse(500, {
      error: error instanceof Error ? error.message : 'Unable to submit referral.',
    });
  }
};
