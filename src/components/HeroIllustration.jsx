export default function HeroIllustration() {
  return (
    <div className="hero-visual" aria-label="음식점 테이블오더 상담 안내 이미지 영역">
      <div className="visual-card visual-card--main">
        <div className="table-top">
          <span className="visual-symbol visual-symbol--bowl" />
          <span>주문 확인</span>
        </div>
        <div className="order-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="visual-card visual-card--tablet">
        <span className="visual-symbol visual-symbol--tablet" />
        <span>테이블 8</span>
      </div>
      <div className="visual-card visual-card--receipt">
        <span className="visual-symbol visual-symbol--check" />
        <span>상담 가능</span>
      </div>
      <div className="visual-card visual-card--pay">
        <span className="visual-symbol visual-symbol--card" />
      </div>
    </div>
  );
}
