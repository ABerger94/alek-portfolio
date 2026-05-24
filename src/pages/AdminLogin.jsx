import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ADMIN_PASSWORD = 'alek';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      navigate('/admin');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
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
          <p className="font-mono-ui text-xs text-circuit tracking-widest">Enter credentials to proceed</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 bg-secondary border border-ion/20 text-foreground placeholder-circuit/50 focus:outline-none focus:border-ion focus:ring-1 focus:ring-ion/30 font-mono-ui text-sm"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs text-destructive font-mono-ui tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-ion text-obsidian font-display text-xs tracking-widest hover:bg-ion/90 transition-colors"
          >
            ACCESS GRANTED
          </button>
        </form>

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