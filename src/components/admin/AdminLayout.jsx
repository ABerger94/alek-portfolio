import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen bg-obsidian">
      {/* Sidebar */}
      <aside className={`border-r border-ion/10 flex flex-col py-8 shrink-0 transition-all duration-300 relative ${collapsed ? 'w-16 px-2' : 'w-56 px-4'}`}>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-obsidian border border-ion/20 text-circuit hover:text-ion flex items-center justify-center transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {!collapsed && (
          <Link to="/" className="font-display text-xs text-ion tracking-widest mb-10 block opacity-70 hover:opacity-100 transition-opacity">
            ← PORTFOLIO
          </Link>
        )}
        {collapsed && <div className="mb-10 mt-0 h-5" />}

        {!collapsed && (
          <p className="font-mono-ui text-xs text-circuit/40 tracking-widest uppercase mb-4 px-2">Control</p>
        )}

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = location.pathname === href || (href !== '/admin' && location.pathname.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 font-mono-ui text-xs tracking-widest transition-all duration-150 min-h-[44px] ${
                  active
                    ? 'text-ion bg-ion/10 border-l-2 border-ion'
                    : 'text-circuit hover:text-pure-white hover:bg-muted border-l-2 border-transparent'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon size={14} />
                {!collapsed && label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => base44.auth.logout('/')}
          title={collapsed ? 'Logout' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 font-mono-ui text-xs text-circuit hover:text-destructive tracking-widest transition-colors min-h-[44px] ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut size={14} />
          {!collapsed && 'LOGOUT'}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}