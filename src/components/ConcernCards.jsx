const concerns = [
  '직원 호출이 너무 많아요',
  '주문 누락이 자주 생겨요',
  '피크타임마다 주문이 밀려요',
  '메뉴판 수정이 번거로워요',
  '인건비 부담이 커요',
  '객단가를 올리고 싶어요',
];

export default function ConcernCards() {
  return (
    <section className="section">
      <h2>이런 고민이 있다면 확인해보세요</h2>
      <div className="concern-grid">
        {concerns.map((text, index) => (
          <article className="concern-card" key={text}>
            <span className="concern-mark">{index + 1}</span>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
