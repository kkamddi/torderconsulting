import { supabaseAnonKey, supabaseUrl } from '../lib/supabaseClient.js';

export async function handleLeadSubmit(form) {
  const formData = {
    store_name: form.storeName.trim(),
    owner_name: form.ownerName.trim(),
    phone: form.phone.trim(),
    region: form.region.trim(),
    business_type: form.businessType,
    table_count: Number(form.tableCount),
    current_order_method: form.orderMethod,
    pain_point: form.concern,
    preferred_time: form.preferredTime,
    status: 'new',
  };

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error(await getSubmitErrorMessage(response));
  }

  return { ok: true, lead: formData };
}

async function getSubmitErrorMessage(response) {
  try {
    const errorBody = await response.json();
    return errorBody.message || `저장 요청 실패 (${response.status})`;
  } catch {
    return `저장 요청 실패 (${response.status})`;
  }
}
