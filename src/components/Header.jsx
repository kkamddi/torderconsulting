import { navigate } from '../App.jsx';

export default function Header({ compact = false }) {
  return (
    <header className={`site-header ${compact ? 'site-header--compact' : ''}`}>
      <a
        className="brand"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          navigate('/');
        }}
      >
        사장님파트너
      </a>
      <a
        className="header-link"
        href="/apply"
        onClick={(event) => {
          event.preventDefault();
          navigate('/apply');
        }}
      >
        상담 신청
      </a>
    </header>
  );
}
