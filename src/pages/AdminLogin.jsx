import { ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminLogin() {
  const handleLogin = () => {
    base44.auth.redirectToLogin(`${window.location.origin}/admin`);
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-6 bg-ion/10 border border-ion/30 rounded">
            <div className="w-2 h-2 bg-ion rounded-full" />
          </div>
          <h1 className="font-display text-2xl tracking-widest mb-2">ADMIN ACCESS</h1>
          <p className="font-mono-ui text-xs text-circuit tracking-widest">Sign in with an admin Base44 account</p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            type="button"
            onClick={handleLogin}
            className="w-full px-4 py-3 bg-ion text-obsidian font-display text-xs tracking-widest hover:bg-ion/90 transition-colors"
          >
            SIGN IN
          </button>
        </div>

        {/* Back link */}
        <a
          href="/"
          className="inline-flex items-center gap-2 font-mono-ui text-xs text-circuit hover:text-ion tracking-widest transition-colors"
        >
          <ArrowLeft size={12} /> BACK TO HOME
        </a>
      </div>
    </div>
  );
}
