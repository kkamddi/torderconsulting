import Header from '../components/Header.jsx';
import { navigate } from '../App.jsx';

export default function CompletePage() {
  return (
    <main className="page-shell">
      <div className="mobile-frame complete-frame">
        <Header compact />
        <section className="complete-card">
          <div className="complete-icon">✓</div>
          <h1>상담 신청이 완료되었습니다.</h1>
          <p>담당자가 확인 후 연락드릴 예정입니다.</p>
          <p>상담은 무료이며, 도입 여부는 상담 후 결정하셔도 됩니다.</p>
          <button className="primary-button" type="button" onClick={() => navigate('/')}>
            처음으로 돌아가기
          </button>
        </section>
      </div>
    </main>
  );
}
