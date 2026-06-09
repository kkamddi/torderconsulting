const items = ['무료 상담', '설치 강요 없음', '매장별 맞춤 안내'];

export default function TrustBadges() {
  return (
    <ul className="trust-list" aria-label="상담 신뢰 요소">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
