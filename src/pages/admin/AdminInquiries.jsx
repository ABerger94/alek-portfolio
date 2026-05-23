import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { format } from 'date-fns';
import { Archive, Mail, MailOpen } from 'lucide-react';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    base44.entities.ContactInquiry.list('-created_date', 100).then(data => {
      setInquiries(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.ContactInquiry.update(id, { status });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);

  const typeColors = {
    hiring: 'border-ion/30 text-ion',
    freelance: 'border-yellow-500/30 text-yellow-400',
    other: 'border-circuit/20 text-circuit',
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-2">◈ Admin / Inquiries</p>
        <h1 className="font-display text-pure-white mb-8" style={{ fontSize: '2.5rem' }}>INQUIRIES</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'unread', 'read', 'archived'].map(f => (
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
              {f === 'unread' && (
                <span className="ml-2 text-ion">
                  ({inquiries.filter(i => i.status === 'unread').length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-pane p-12 text-center">
            <p className="font-mono-ui text-xs text-circuit tracking-widest">NO INQUIRIES IN THIS FILTER</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((inq) => (
              <div key={inq.id} className={`glass-pane overflow-hidden transition-all ${inq.status === 'unread' ? 'border-ion/30' : ''}`}>
                {/* Row */}
                <div
                  className="px-4 py-4 flex items-center gap-4 cursor-pointer hover:bg-ion/5 transition-colors"
                  onClick={() => {
                    setExpanded(expanded === inq.id ? null : inq.id);
                    if (inq.status === 'unread') updateStatus(inq.id, 'read');
                  }}
                >
                  {inq.status === 'unread'
                    ? <div className="pulse-dot shrink-0" />
                    : <div className="w-2 h-2 rounded-full bg-circuit/20 shrink-0" />
                  }

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-mono-ui text-xs text-pure-white">{inq.name}</p>
                      <p className="font-mono-ui text-xs text-circuit">{inq.email}</p>
                    </div>
                    <p className="font-mono-ui text-xs text-circuit/60 truncate">{inq.message}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`font-mono-ui text-xs px-2 py-1 border ${typeColors[inq.inquiry_type] || typeColors.other}`}>
                      {inq.inquiry_type?.toUpperCase()}
                    </span>
                    {inq.created_date && (
                      <span className="font-mono-ui text-xs text-circuit/40">
                        {format(new Date(inq.created_date), 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded */}
                {expanded === inq.id && (
                  <div className="border-t border-ion/10 px-6 py-5 bg-obsidian">
                    <p className="text-circuit text-sm leading-relaxed mb-5" style={{ lineHeight: '1.8' }}>
                      {inq.message}
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href={`mailto:${inq.email}`}
                        className="inline-flex items-center gap-2 font-mono-ui text-xs text-ion border border-ion/20 px-4 py-2 hover:bg-ion/5 transition-colors min-h-[44px]"
                      >
                        <Mail size={11} />
                        REPLY VIA EMAIL
                      </a>
                      {inq.status !== 'read' && (
                        <button
                          onClick={() => updateStatus(inq.id, 'read')}
                          className="inline-flex items-center gap-2 font-mono-ui text-xs text-circuit border border-circuit/20 px-4 py-2 hover:border-circuit/40 transition-colors min-h-[44px]"
                        >
                          <MailOpen size={11} />
                          MARK READ
                        </button>
                      )}
                      {inq.status !== 'archived' && (
                        <button
                          onClick={() => updateStatus(inq.id, 'archived')}
                          className="inline-flex items-center gap-2 font-mono-ui text-xs text-circuit border border-circuit/20 px-4 py-2 hover:border-circuit/40 transition-colors min-h-[44px]"
                        >
                          <Archive size={11} />
                          ARCHIVE
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}