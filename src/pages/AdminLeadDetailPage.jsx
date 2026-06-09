import { useEffect, useState } from 'react';
import { navigate } from '../App.jsx';
import {
  fetchLeadById,
  LEAD_STATUSES,
  updateLeadAdminFields,
} from '../services/adminLeadService.js';
import { AdminHeader, formatDate, formatMoney, LeadMeta, StatusBadge } from './AdminLeadsPage.jsx';

export default function AdminLeadDetailPage({ leadId }) {
  const [lead, setLead] = useState(null);
  const [status, setStatus] = useState('new');
  const [expectedCommission, setExpectedCommission] = useState('');
  const [adminMemo, setAdminMemo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadLead() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const nextLead = await fetchLeadById(leadId);
        if (isMounted) {
          setLead(nextLead);
          setStatus(nextLead.status || 'new');
          setExpectedCommission(
            nextLead.expected_commission === null || nextLead.expected_commission === undefined
              ? ''
              : String(nextLead.expected_commission),
          );
        }
      } catch (error) {
        console.error('리드 상세 조회 실패', error);
        if (isMounted) {
          setErrorMessage('상담 신청 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLead();

    return () => {
      isMounted = false;
    };
  }, [leadId]);

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    setErrorMessage('');

    try {
      const updatedLead = await updateLeadAdminFields(leadId, {
        status,
        expectedCommission,
      });
      setLead(updatedLead);
      setMessage('저장되었습니다.');
    } catch (error) {
      console.error('리드 저장 실패', error);
      setErrorMessage('저장 중 문제가 생겼습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-container admin-container--detail">
        <AdminHeader title="상담 신청 상세" description="상담 상태와 예상 수수료를 수정합니다." />

        <button className="admin-back-button" type="button" onClick={() => navigate('/admin')}>
          목록으로 돌아가기
        </button>

        {isLoading ? <div className="admin-state">상담 신청 정보를 불러오는 중입니다.</div> : null}
        {!isLoading && errorMessage ? <div className="admin-state admin-state--error">{errorMessage}</div> : null}

        {!isLoading && lead ? (
          <div className="admin-detail-layout">
            <section className="admin-panel">
              <div className="detail-title-row">
                <div>
                  <h2>{lead.store_name || '매장명 없음'}</h2>
                  <p>
                    {lead.owner_name || '이름 없음'} · {lead.phone || '연락처 없음'}
                  </p>
                </div>
                <StatusBadge status={lead.status} />
              </div>

              <div className="detail-info-grid">
                <LeadMeta label="지역" value={lead.region} />
                <LeadMeta label="업종" value={lead.business_type} />
                <LeadMeta label="테이블 수" value={formatCount(lead.table_count)} />
                <LeadMeta label="현재 주문 방식" value={lead.current_order_method} />
                <LeadMeta label="가장 큰 고민" value={lead.pain_point} />
                <LeadMeta label="상담 희망 시간" value={lead.preferred_time} />
                <LeadMeta label="예상 수수료" value={formatMoney(lead.expected_commission)} />
                <LeadMeta label="신청일" value={formatDate(lead.created_at)} />
                <LeadMeta label="최근 수정일" value={formatDate(lead.updated_at)} />
              </div>
            </section>

            <form className="admin-edit-card" onSubmit={handleSave}>
              <h2>관리 정보</h2>
              <label className="field">
                <span>상태</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  {LEAD_STATUSES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>예상 수수료</span>
                <input
                  type="number"
                  min="0"
                  value={expectedCommission}
                  placeholder="예: 300000"
                  onChange={(event) => setExpectedCommission(event.target.value)}
                />
              </label>

              <label className="admin-memo-field">
                <span>관리자 메모</span>
                <textarea
                  value={adminMemo}
                  placeholder="상담 내용이나 다음 확인 사항을 적어두세요."
                  onChange={(event) => setAdminMemo(event.target.value)}
                />
              </label>

              {message ? <p className="admin-save-message">{message}</p> : null}
              {errorMessage ? <p className="admin-save-error">{errorMessage}</p> : null}

              <button className="primary-button" type="submit" disabled={isSaving}>
                {isSaving ? '저장 중...' : '저장하기'}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function formatCount(value) {
  if (value === null || value === undefined || value === '') return '-';
  return `${value}개`;
}
