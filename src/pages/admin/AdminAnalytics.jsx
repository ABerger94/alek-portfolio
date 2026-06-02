import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';
import { format } from 'date-fns';

export default function AdminAnalytics() {
  const [pageViews, setPageViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('first_seen_at');

  useEffect(() => {
    base44.entities.PageView.list('-first_seen_at', 5000).catch(() => []).then(data => {
      setPageViews(data);
      setLoading(false);
    });
  }, []);

  const todayKey = new Date().toISOString().slice(0, 10);

  const filtered = pageViews.filter(v => {
    if (filter === 'new') return (v.first_seen_at || v.created_date || '').slice(0, 10) === todayKey;
    if (filter === 'returning') return (v.view_count || 1) > 1;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'view_count') return (b.view_count || 1) - (a.view_count || 1);
    if (sortBy === 'last_seen_at') return new Date(b.last_seen_at || 0) - new Date(a.last_seen_at || 0);
    return new Date(b.first_seen_at || b.created_date || 0) - new Date(a.first_seen_at || a.created_date || 0);
  });

  const filterCounts = {
    all: pageViews.length,
    new: pageViews.filter(v => (v.first_seen_at || v.created_date || '').slice(0, 10) === todayKey).length,
    returning: pageViews.filter(v => (v.view_count || 1) > 1).length,
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-2">◈ Admin / Analytics</p>
        <h1 className="font-display text-pure-white mb-8" style={{ fontSize: '2.5rem' }}>TRAFFIC</h1>

        <div className="mb-12">
          <AnalyticsPanel pageViews={pageViews} loading={loading} />
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {/* Filter tabs */}
          <div className="flex gap-2">
            {['all', 'new', 'returning'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono-ui text-xs tracking-widest px-4 py-2 border transition-all min-h-[44px] ${
                  filter === f
                    ? 'border-ion text-ion bg-ion/10'
                    : 'border-circuit/20 text-circuit hover:border-circuit/40'
                }`}
              >
                {f.toUpperCase()}
                <span className={`ml-2 ${filter === f ? 'text-ion' : 'text-circuit/50'}`}>
                  ({filterCounts[f]})
                </span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="font-mono-ui text-xs text-circuit tracking-widest">SORT:</span>
            {[
              { key: 'first_seen_at', label: 'First Seen' },
              { key: 'last_seen_at', label: 'Last Seen' },
              { key: 'view_count', label: 'Views' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`font-mono-ui text-xs tracking-widest px-3 py-2 border transition-all min-h-[44px] ${
                  sortBy === key
                    ? 'border-ion/50 text-ion'
                    : 'border-circuit/20 text-circuit hover:border-circuit/40'
                }`}
              >
                {label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-muted animate-pulse" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="glass-pane p-12 text-center">
            <p className="font-mono-ui text-xs text-circuit tracking-widest">NO VISITORS IN THIS FILTER</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[1fr_160px_140px_140px_56px] gap-2 px-4 py-2 mb-1">
              <span className="font-mono-ui text-xs text-circuit/40 tracking-widest">PAGE</span>
              <span className="font-mono-ui text-xs text-circuit/40 tracking-widest">FIRST SEEN</span>
              <span className="font-mono-ui text-xs text-circuit/40 tracking-widest">LAST SEEN</span>
              <span className="font-mono-ui text-xs text-circuit/40 tracking-widest hidden md:block">VISITOR ID</span>
              <span className="font-mono-ui text-xs text-circuit/40 tracking-widest text-right">VIEWS</span>
            </div>

            <div className="space-y-1">
              {sorted.map(v => {
                const isNew = (v.first_seen_at || v.created_date || '').slice(0, 10) === todayKey;
                const isReturning = (v.view_count || 1) > 1;
                const shortId = (v.ip_hash || '').slice(0, 8);
                const firstSeen = v.first_seen_at || v.created_date;
                const lastSeen = v.last_seen_at || v.first_seen_at;

                return (
                  <div
                    key={v.id}
                    className={`glass-pane px-4 py-3 grid grid-cols-[1fr_160px_140px_140px_56px] gap-2 items-center ${
                      isNew ? 'border-ion/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isNew && <div className="pulse-dot shrink-0" />}
                      <span className="font-mono-ui text-xs text-pure-white truncate">{v.page_path || '/'}</span>
                    </div>

                    <span className="font-mono-ui text-xs text-circuit">
                      {firstSeen ? format(new Date(firstSeen), 'MMM d, h:mm a') : '—'}
                    </span>

                    <span className="font-mono-ui text-xs text-circuit">
                      {lastSeen && lastSeen !== firstSeen ? format(new Date(lastSeen), 'MMM d, h:mm a') : '—'}
                    </span>

                    <span className="font-mono-ui text-xs text-circuit/40 hidden md:block tracking-widest">
                      {shortId}…
                    </span>

                    <div className="flex items-center justify-end gap-1">
                      <span className={`font-mono-ui text-xs ${isReturning ? 'text-ion' : 'text-circuit/50'}`}>
                        {v.view_count || 1}
                      </span>
                      {isReturning && (
                        <span className="font-mono-ui text-xs text-circuit/30 tracking-widest">↑</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="font-mono-ui text-xs text-circuit/30 tracking-widest mt-4">
              SHOWING {sorted.length} OF {pageViews.length} UNIQUE VISITORS
            </p>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
