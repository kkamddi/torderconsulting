import { useEffect, useMemo, useState } from 'react';
import { navigate } from '../App.jsx';
import { fetchLeads, getStatusLabel, LEAD_FILTERS } from '../services/adminLeadService.js';

const activeStatuses = ['assigned', 'called', 'visit_scheduled', 'visited', 'proposal_sent', 'on_hold'];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadLeads() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const nextLeads = await fetchLeads();
        if (isMounted) {
          setLeads(nextLeads);
        }
      } catch (error) {
        console.error('리드 목록 조회 실패', error);
        if (isMounted) {
          setErrorMessage('상담 신청 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLeads();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((lead) => lead.status === 'new').length,
      active: leads.filter((lead) => activeStatuses.includes(lead.status)).length,
      contracted: leads.filter((lead) => lead.status === 'contracted').length,
      failed: leads.filter((lead) => lead.status === 'failed').length,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    if (selectedStatus === 'all') return leads;
    return leads.filter((lead) => lead.status === selectedStatus);
  }, [leads, selectedStatus]);

  return (
    <main className="admin-page">
      <div className="admin-container">
        <AdminHeader title="상담 신청 관리" description="사장님 상담 신청 건을 확인하고 진행 상태를 관리합니다." />

        <section className="admin-stats" aria-label="상담 신청 통계">
          <StatCard label="전체" value={stats.total} />
          <StatCard label="신규" value={stats.new} />
          <StatCard label="진행중" value={stats.active} />
          <StatCard label="계약완료" value={stats.contracted} />
          <StatCard label="실패" value={stats.failed} />
        </section>

        <section className="admin-panel">
          <div className="admin-filter-list" aria-label="상태 필터">
            {LEAD_FILTERS.map((filter) => (
              <button
                className={selectedStatus === filter.value ? 'admin-filter is-active' : 'admin-filter'}
                key={filter.value}
                type="button"
                onClick={() => setSelectedStatus(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {isLoading ? <AdminState message="상담 신청 목록을 불러오는 중입니다." /> : null}
          {errorMessage ? <AdminState message={errorMessage} tone="error" /> : null}
          {!isLoading && !errorMessage && filteredLeads.length === 0 ? (
            <AdminState message="표시할 상담 신청 건이 없습니다." />
          ) : null}

          {!isLoading && !errorMessage && filteredLeads.length > 0 ? (
            <div className="lead-list">
              {filteredLeads.map((lead) => (
                <button
                  className="lead-card"
                  key={lead.id}
                  type="button"
                  onClick={() => navigate(`/admin/leads/${lead.id}`)}
                >
                  <div className="lead-card__top">
                    <div>
                      <h2>{lead.store_name || '매장명 없음'}</h2>
                      <p>
                        {lead.owner_name || '이름 없음'} · {lead.phone || '연락처 없음'}
                      </p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="lead-card__grid">
                    <LeadMeta label="지역" value={lead.region} />
                    <LeadMeta label="업종" value={lead.business_type} />
                    <LeadMeta label="테이블 수" value={formatTableCount(lead.table_count)} />
                    <LeadMeta label="고민" value={lead.pain_point} />
                    <LeadMeta label="희망 시간" value={lead.preferred_time} />
                    <LeadMeta label="예상 수수료" value={formatMoney(lead.expected_commission)} />
                    <LeadMeta label="신청일" value={formatDate(lead.created_at)} />
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export function AdminHeader({ title, description }) {
  return (
    <header className="admin-header">
      <div>
        <a
          className="admin-brand"
          href="/admin"
          onClick={(event) => {
            event.preventDefault();
            navigate('/admin');
          }}
        >
          사장님파트너 관리자
        </a>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <button className="admin-home-button" type="button" onClick={() => navigate('/')}>
        메인으로
      </button>
    </header>
  );
}

export function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${status || 'none'}`}>{getStatusLabel(status)}</span>;
}

export function LeadMeta({ label, value }) {
  return (
    <div className="lead-meta">
      <span>{label}</span>
      <strong>{value || '-'}</strong>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="admin-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function AdminState({ message, tone = 'default' }) {
  return <div className={`admin-state admin-state--${tone}`}>{message}</div>;
}

export function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '-';
  return `${Number(value).toLocaleString('ko-KR')}원`;
}

function formatTableCount(value) {
  if (value === null || value === undefined || value === '') return '-';
  return `${value}개`;
}
