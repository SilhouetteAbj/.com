import { insertRow, jsonResponse, readJsonBody } from './_supabase.mjs';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const body = readJsonBody(event);
  if (!body) {
    return jsonResponse(400, { error: 'Invalid JSON payload.' });
  }

  const { eventType, item, path = null } = body;

  if (!eventType || !item) {
    return jsonResponse(400, { error: 'Missing required analytics fields.' });
  }

  try {
    await insertRow('analytics_events', {
      event_type: eventType,
      item,
      path,
      created_at: new Date().toISOString(),
    });

    return jsonResponse(200, { ok: true });
  } catch (error) {
    return jsonResponse(500, {
      error: error instanceof Error ? error.message : 'Unable to track analytics event.',
    });
  }
};
