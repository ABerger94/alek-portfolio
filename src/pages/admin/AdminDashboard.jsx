import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';
import { FolderOpen, MessageSquare, Eye, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    published: 0,
    inquiries: 0,
    unread: 0,
    uniqueViews: 0,
    repeatViews: 0,
    viewsToday: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [pageViews, setPageViews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [projects, inquiries, views] = await Promise.all([
        base44.entities.Project.list('-created_date', 50),
        base44.entities.ContactInquiry.list('-created_date', 5),
        base44.entities.PageView.list('-created_date', 5000).catch(() => []),
      ]);
      const allInquiries = await base44.entities.ContactInquiry.list('-created_date', 200);
      const todayKey = new Date().toISOString().slice(0, 10);
      setStats({
        projects: projects.length,
        published: projects.filter(p => p.status === 'published').length,
        inquiries: allInquiries.length,
        unread: allInquiries.filter(i => i.status === 'unread').length,
        uniqueViews: views.length,
        repeatViews: views.reduce((sum, view) => sum + Math.max((view.view_count || 1) - 1, 0), 0),
        viewsToday: views.filter(view => (view.first_seen_at || view.created_date || '').slice(0, 10) === todayKey).length,
      });
      setPageViews(views);
      setRecentInquiries(inquiries);
      setLoading(false);
    };
    load();
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats.projects, sub: `${stats.published} published`, icon: FolderOpen, href: '/admin/projects' },
    { label: 'Inquiries', value: stats.inquiries, sub: `${stats.unread} unread`, icon: MessageSquare, href: '/admin/inquiries' },
    { label: 'Unique Views', value: stats.uniqueViews, sub: `${stats.viewsToday} new today / ${stats.repeatViews} returning`, icon: Eye, href: '/admin/analytics' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-2">◈ Admin / Dashboard</p>
        <h1 className="font-display text-pure-white mb-8" style={{ fontSize: '2.5rem' }}>COMMAND CENTER</h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {statCards.map(({ label, value, sub, icon: Icon, href }) => (
            <Link key={label} to={href} className="glass-pane p-6 hover:border-ion/40 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <Icon className="text-ion" size={20} />
                <ArrowRight size={14} className="text-circuit group-hover:text-ion transition-colors" />
              </div>
              <p className="font-display text-ion mb-1" style={{ fontSize: '2.5rem', lineHeight: 1 }}>
                {loading ? '—' : value}
              </p>
              <p className="font-mono-ui text-xs text-circuit tracking-widest uppercase">{label}</p>
              <p className="font-mono-ui text-xs text-circuit/50 tracking-widest mt-1">{sub}</p>
            </Link>
          ))}
        </div>

        {/* Recent inquiries */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase">Recent Inquiries</p>
            <Link to="/admin/inquiries" className="font-mono-ui text-xs text-circuit hover:text-ion tracking-widest transition-colors">
              VIEW ALL →
            </Link>
          </div>
          <div className="space-y-2">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-14 bg-muted animate-pulse" />)
            ) : recentInquiries.length === 0 ? (
              <p className="font-mono-ui text-xs text-circuit tracking-widest py-6">NO INQUIRIES YET</p>
            ) : (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="glass-pane px-4 py-3 flex items-center gap-4">
                  {inq.status === 'unread' && <div className="pulse-dot shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono-ui text-xs text-pure-white truncate">{inq.name} — {inq.email}</p>
                    <p className="font-mono-ui text-xs text-circuit truncate">{inq.message}</p>
                  </div>
                  <span className={`font-mono-ui text-xs tracking-widest px-2 py-1 border shrink-0 ${
                    inq.inquiry_type === 'hiring' ? 'border-ion/30 text-ion' : 'border-circuit/20 text-circuit'
                  }`}>
                    {inq.inquiry_type?.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Analytics */}
        <AnalyticsPanel pageViews={pageViews} loading={loading} />
      </div>
    </AdminLayout>
  );
}
