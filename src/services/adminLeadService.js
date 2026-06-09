import { supabase } from '../lib/supabaseClient.js';

export const LEAD_STATUSES = [
  { value: 'new', label: '신규' },
  { value: 'assigned', label: '배정완료' },
  { value: 'called', label: '전화완료' },
  { value: 'visit_scheduled', label: '방문예정' },
  { value: 'visited', label: '방문완료' },
  { value: 'proposal_sent', label: '견적전달' },
  { value: 'contracted', label: '계약완료' },
  { value: 'failed', label: '실패' },
  { value: 'on_hold', label: '보류' },
  { value: 'settled', label: '정산완료' },
];

export const LEAD_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'new', label: '신규' },
  { value: 'assigned', label: '배정완료' },
  { value: 'called', label: '전화완료' },
  { value: 'visit_scheduled', label: '방문예정' },
  { value: 'visited', label: '방문완료' },
  { value: 'proposal_sent', label: '견적전달' },
  { value: 'contracted', label: '계약완료' },
  { value: 'failed', label: '실패' },
  { value: 'on_hold', label: '보류' },
];

export const statusLabelMap = LEAD_STATUSES.reduce((labels, status) => {
  labels[status.value] = status.label;
  return labels;
}, {});

export function getStatusLabel(status) {
  return statusLabelMap[status] || '상태 없음';
}

export async function fetchLeads() {
  assertSupabase();

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function fetchLeadById(id) {
  assertSupabase();

  const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateLeadAdminFields(id, fields) {
  assertSupabase();

  const payload = {
    status: fields.status,
    expected_commission: fields.expectedCommission === '' ? null : Number(fields.expectedCommission),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('leads')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

function assertSupabase() {
  if (!supabase) {
    throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
  }
}
