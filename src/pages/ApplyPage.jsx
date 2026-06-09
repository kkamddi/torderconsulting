import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import { navigate } from '../App.jsx';
import { handleLeadSubmit } from '../services/leadService.js';

const initialForm = {
  storeName: '',
  ownerName: '',
  phone: '',
  region: '',
  businessType: '',
  tableCount: '',
  orderMethod: '',
  concern: '',
  preferredTime: '',
  privacy: false,
};

const businessTypes = ['고깃집', '술집/이자카야', '횟집', '카페', '분식/한식', '기타'];
const orderMethods = ['직원 직접 주문', '종이 메뉴판', '키오스크', '기존 테이블오더 사용 중'];
const concerns = ['직원 호출', '주문 누락', '피크타임 혼잡', '인건비 부담', '메뉴판 수정', '객단가 상승'];
const preferredTimes = ['오전', '오후', '저녁', '아무 때나 가능'];

export default function ApplyPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredFields = useMemo(
    () => [
      ['storeName', '매장명을 입력해주세요.'],
      ['ownerName', '사장님 이름을 입력해주세요.'],
      ['phone', '연락처를 입력해주세요.'],
      ['region', '지역을 입력해주세요.'],
      ['businessType', '업종을 선택해주세요.'],
      ['tableCount', '테이블 수를 입력해주세요.'],
      ['orderMethod', '현재 주문 방식을 선택해주세요.'],
      ['concern', '가장 큰 고민을 선택해주세요.'],
      ['preferredTime', '상담 희망 시간을 선택해주세요.'],
    ],
    [],
  );

  const isFormReady =
    requiredFields.every(([name]) => String(form[name]).trim()) && form.privacy;

  const updateField = (name, value) => {
    const nextValue = name === 'phone' ? String(value).replace(/[^\d-]/g, '') : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const nextErrors = {};
    requiredFields.forEach(([name, message]) => {
      if (!String(form[name]).trim()) {
        nextErrors[name] = message;
      }
    });

    if (!form.privacy) {
      nextErrors.privacy = '개인정보 수집에 동의해주세요.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await handleLeadSubmit(form);
    } catch (error) {
      console.error('상담 신청 저장 실패', error);
      const detail = error?.message ? ` (${error.message})` : '';
      setSubmitError(`신청 저장 중 문제가 생겼습니다.${detail}`);
      setIsSubmitting(false);
      return;
    }

    try {
      navigate('/complete');
    } catch (error) {
      console.error('신청 완료 페이지 이동 실패', error);
      window.location.href = '/complete';
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="mobile-frame">
        <Header compact />
        <form className="apply-form" onSubmit={handleSubmit} noValidate>
          <div className="form-heading">
            <span>무료 상담 신청</span>
            <h1>매장 정보를 알려주세요</h1>
            <p>짧게 남겨주시면 담당자가 확인 후 연락드립니다.</p>
          </div>

          <section className="form-card">
            <h2>기본 정보</h2>
            <TextField
              label="매장명"
              name="storeName"
              value={form.storeName}
              error={errors.storeName}
              onChange={updateField}
              placeholder="예: 사장님식당"
            />
            <TextField
              label="사장님 이름"
              name="ownerName"
              value={form.ownerName}
              error={errors.ownerName}
              onChange={updateField}
              placeholder="예: 김사장"
            />
            <TextField
              label="연락처"
              name="phone"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              error={errors.phone}
              onChange={updateField}
              placeholder="예: 010-1234-5678"
            />
            <TextField
              label="지역"
              name="region"
              value={form.region}
              error={errors.region}
              onChange={updateField}
              placeholder="예: 서울 강남구"
            />
          </section>

          <section className="form-card">
            <h2>매장 상황</h2>
            <ChipGroup
              label="업종"
              name="businessType"
              options={businessTypes}
              value={form.businessType}
              error={errors.businessType}
              onChange={updateField}
            />
            <TextField
              label="테이블 수"
              name="tableCount"
              type="number"
              value={form.tableCount}
              error={errors.tableCount}
              onChange={updateField}
              placeholder="예: 12"
            />
            <ChipGroup
              label="현재 주문 방식"
              name="orderMethod"
              options={orderMethods}
              value={form.orderMethod}
              error={errors.orderMethod}
              onChange={updateField}
            />
            <ChipGroup
              label="가장 큰 고민"
              name="concern"
              options={concerns}
              value={form.concern}
              error={errors.concern}
              onChange={updateField}
            />
            <SelectField
              label="상담 희망 시간"
              name="preferredTime"
              options={preferredTimes}
              value={form.preferredTime}
              error={errors.preferredTime}
              onChange={updateField}
            />
          </section>

          <section className="form-card">
            <h2>동의</h2>
            <label className={`privacy-box ${errors.privacy ? 'field-error-box' : ''}`}>
              <input
                type="checkbox"
                checked={form.privacy}
                onChange={(event) => updateField('privacy', event.target.checked)}
              />
              <span>상담 연락을 위한 개인정보 수집 및 이용에 동의합니다.</span>
            </label>
            {errors.privacy ? <p className="field-error">{errors.privacy}</p> : null}
          </section>

          <div className="sticky-submit">
            {submitError ? <p className="submit-error">{submitError}</p> : null}
            <button className="primary-button" type="submit" disabled={isSubmitting || !isFormReady}>
              {isSubmitting ? '신청 중...' : '상담 신청 완료하기'}
            </button>
            {!isFormReady ? <p>필수 정보를 모두 입력하면 신청할 수 있어요.</p> : null}
          </div>
        </form>
      </div>
    </main>
  );
}

function TextField({
  label,
  name,
  value,
  error,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        min={type === 'number' ? '1' : undefined}
        inputMode={inputMode}
        onChange={(event) => onChange(name, event.target.value)}
      />
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
}

function SelectField({ label, name, options, value, error, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} value={value} onChange={(event) => onChange(name, event.target.value)}>
        <option value="">선택해주세요</option>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
}

function ChipGroup({ label, name, options, value, error, onChange }) {
  return (
    <fieldset className="chip-field">
      <legend>{label}</legend>
      <div className="chip-list">
        {options.map((option) => (
          <button
            className={value === option ? 'chip chip--selected' : 'chip'}
            type="button"
            key={option}
            onClick={() => onChange(name, option)}
          >
            {option}
          </button>
        ))}
      </div>
      {error ? <p className="field-error">{error}</p> : null}
    </fieldset>
  );
}
