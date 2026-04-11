const jsonHeaders = {
  'content-type': 'application/json',
};

const getSupabaseConfig = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  return { supabaseUrl, serviceRoleKey };
};

export const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: jsonHeaders,
  body: JSON.stringify(payload),
});

export const readJsonBody = (event) => {
  if (!event.body) return {};

  try {
    return JSON.parse(event.body);
  } catch {
    return null;
  }
};

export const insertRow = async (table, payload) => {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!response.ok) {
    const message = data?.message || 'Supabase insert failed.';
    throw new Error(message);
  }

  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  return data;
};
