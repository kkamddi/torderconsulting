import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import ApplyPage from './pages/ApplyPage.jsx';
import CompletePage from './pages/CompletePage.jsx';
import AdminLeadsPage from './pages/AdminLeadsPage.jsx';
import AdminLeadDetailPage from './pages/AdminLeadDetailPage.jsx';

function getPath() {
  return window.location.pathname || '/';
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
}

export default function App() {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handleRouteChange = () => setPath(getPath());
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  if (path === '/apply') {
    return <ApplyPage />;
  }

  if (path === '/complete') {
    return <CompletePage />;
  }

  if (path === '/admin') {
    return <AdminLeadsPage />;
  }

  if (path.startsWith('/admin/leads/')) {
    const leadId = decodeURIComponent(path.replace('/admin/leads/', ''));
    return <AdminLeadDetailPage leadId={leadId} />;
  }

  return <LandingPage />;
}
