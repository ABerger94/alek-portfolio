import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useEffect, useState } from 'react';

export default function Footer({ settings }) {
  const name = settings?.builder_name || '';
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.role === 'admin') setIsAdmin(true);
    }).catch(() => {});
  }, []);

  const handleAdminClick = (e) => {
    if (!isAdmin) {
      e.preventDefault();
      base44.auth.redirectToLogin('/admin');
    }
  };

  return (
    <footer className="border-t border-ion/10 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono-ui text-xs text-circuit tracking-widest">
          © {new Date().getFullYear()} {name} — ALL SYSTEMS OPERATIONAL
        </p>
        <div className="flex items-center gap-6">
          <p className="font-mono-ui text-xs text-circuit/40 tracking-widest">
            BUILT WITH AI. ORCHESTRATED BY HUMAN.
          </p>
          <Link
            to="/admin"
            onClick={handleAdminClick}
            className="font-mono-ui text-xs text-circuit/20 hover:text-circuit/50 tracking-widest transition-colors"
          >
            ·
          </Link>
        </div>
      </div>
    </footer>
  );
}