import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, MessageSquare, Settings, LogOut, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-obsidian">
      {/* Sidebar */}
      <aside className="w-56 border-r border-ion/10 flex flex-col py-8 px-4 shrink-0">
        <Link to="/" className="font-display text-xs text-ion tracking-widest mb-10 block opacity-70 hover:opacity-100 transition-opacity">
          ← PORTFOLIO
        </Link>

        <p className="font-mono-ui text-xs text-circuit/40 tracking-widest uppercase mb-4 px-2">Control</p>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = location.pathname === href || (href !== '/admin' && location.pathname.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-3 px-3 py-2.5 font-mono-ui text-xs tracking-widest transition-all duration-150 min-h-[44px] ${
                  active
                    ? 'text-ion bg-ion/10 border-l-2 border-ion'
                    : 'text-circuit hover:text-pure-white hover:bg-muted border-l-2 border-transparent'
                }`}
              >
                <Icon size={14} />
                {label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => base44.auth.logout('/')}
          className="flex items-center gap-3 px-3 py-2.5 font-mono-ui text-xs text-circuit hover:text-destructive tracking-widest transition-colors min-h-[44px]"
        >
          <LogOut size={14} />
          LOGOUT
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}