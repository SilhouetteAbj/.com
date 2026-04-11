import { insertRow, jsonResponse, readJsonBody } from './_supabase.mjs';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const body = readJsonBody(event);
  if (!body) {
    return jsonResponse(400, { error: 'Invalid JSON payload.' });
  }

  const {
    id,
    name,
    phone,
    email = '',
    service,
    date,
    time,
    notes = '',
    status = 'pending',
  } = body;

  if (!id || !name || !phone || !service || !date || !time) {
    return jsonResponse(400, { error: 'Missing required booking fields.' });
  }

  try {
    const row = await insertRow('appointments', {
      id,
      name,
      phone,
      email,
      service,
      date,
      time,
      notes,
      status,
      created_at: new Date().toISOString(),
    });

    return jsonResponse(200, { appointment: row });
  } catch (error) {
    return jsonResponse(500, {
      error: error instanceof Error ? error.message : 'Unable to create booking.',
    });
  }
};
