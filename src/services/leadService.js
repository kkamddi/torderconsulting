import { supabase } from '../lib/supabaseClient.js';

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

  if (!supabase) {
    throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
  }

  const { error } = await supabase.from('leads').insert(formData);

  if (error) {
    throw error;
  }

  return { ok: true, lead: formData };
}
