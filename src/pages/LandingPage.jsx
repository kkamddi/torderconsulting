import Header from '../components/Header.jsx';
import HeroIllustration from '../components/HeroIllustration.jsx';
import TrustBadges from '../components/TrustBadges.jsx';
import ConcernCards from '../components/ConcernCards.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import { navigate } from '../App.jsx';

export default function LandingPage() {
  return (
    <main className="page-shell">
      <div className="mobile-frame">
        <Header />
        <section className="hero">
          <HeroIllustration />
          <h1>
            우리 매장에
            <br />
            테이블오더가 필요할까?
          </h1>
          <p className="hero-copy">
            업종과 테이블 수만 입력하면
            <br />
            무료 상담 가능 여부를 확인해드립니다.
          </p>
          <button className="primary-button" type="button" onClick={() => navigate('/apply')}>
            무료 상담 신청하기
          </button>
          <TrustBadges />
        </section>
        <ConcernCards />
        <ProcessSteps />
        <section className="bottom-cta">
          <h2>우리 매장도 맞는지 확인해보세요</h2>
          <p>상담은 무료이고, 도입 여부는 천천히 결정하셔도 됩니다.</p>
          <button className="primary-button" type="button" onClick={() => navigate('/apply')}>
            우리 매장도 상담 받아보기
          </button>
        </section>
      </div>
    </main>
  );
}
