const steps = ['매장 정보 입력', '담당자 상담', '방문/견적 안내', '도입 여부 결정'];

export default function ProcessSteps() {
  return (
    <section className="section process-section">
      <h2>상담은 이렇게 진행돼요</h2>
      <ol className="process-list">
        {steps.map((step, index) => (
          <li key={step}>
            <span>{index + 1}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
