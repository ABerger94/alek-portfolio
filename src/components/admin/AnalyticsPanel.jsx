import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { TrendingUp, Users, Calendar, RefreshCw } from 'lucide-react';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-pane px-3 py-2">
      <p className="font-mono-ui text-xs text-circuit tracking-widest mb-1">{label}</p>
      <p className="font-mono-ui text-xs text-ion">{payload[0].value} new visitor{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  );
};

export default function AnalyticsPanel({ pageViews, loading }) {
  const analytics = useMemo(() => {
    if (!pageViews?.length) return null;

    const now = new Date();

    const days30 = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().slice(0, 10);
    });

    const days7Set = new Set(days30.slice(-7));
    const days30Set = new Set(days30);

    const visitorsByDay = {};
    pageViews.forEach(v => {
      const day = (v.first_seen_at || v.created_date || '').slice(0, 10);
      if (day) visitorsByDay[day] = (visitorsByDay[day] || 0) + 1;
    });

    const chartData = days30.map(day => ({
      label: new Date(day + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: visitorsByDay[day] || 0,
    }));

    const week = pageViews.filter(v => days7Set.has((v.first_seen_at || v.created_date || '').slice(0, 10))).length;
    const month = pageViews.filter(v => days30Set.has((v.first_seen_at || v.created_date || '').slice(0, 10))).length;
    const returning = pageViews.filter(v => (v.view_count || 1) > 1).length;
    const returnRate = Math.round((returning / pageViews.length) * 100);

    const pageCounts = {};
    pageViews.forEach(v => {
      const p = v.page_path || '/';
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([path, count]) => ({
        path,
        count,
        pct: Math.round((count / pageViews.length) * 100),
      }));

    return { chartData, week, month, returning, returnRate, topPages, total: pageViews.length };
  }, [pageViews]);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-3 w-40 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-muted animate-pulse" />)}
        </div>
        <div className="h-52 bg-muted animate-pulse" />
        <div className="h-40 bg-muted animate-pulse" />
      </div>
    );
  }

  if (!analytics) {
    return <p className="font-mono-ui text-xs text-circuit tracking-widest py-6">NO TRAFFIC DATA YET</p>;
  }

  const summaryCards = [
    { label: 'All-Time Visitors', value: analytics.total, icon: Users },
    { label: 'This Week', value: analytics.week, icon: Calendar },
    { label: 'This Month', value: analytics.month, icon: TrendingUp },
    { label: 'Return Rate', value: `${analytics.returnRate}%`, icon: RefreshCw },
  ];

  return (
    <div>
      <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-4">Traffic Analytics</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass-pane p-4">
            <Icon size={14} className="text-ion mb-3" />
            <p className="font-display text-ion mb-1" style={{ fontSize: '1.75rem', lineHeight: 1 }}>
              {value}
            </p>
            <p className="font-mono-ui text-xs text-circuit tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      <div className="glass-pane p-4 mb-4">
        <p className="font-mono-ui text-xs text-circuit tracking-widest uppercase mb-4">
          New Unique Visitors — Last 30 Days
        </p>
        <div style={{ height: 168 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.chartData} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(142,145,150,0.08)" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#8E9196', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                interval={4}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: '#8E9196', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(0,245,255,0.15)', strokeWidth: 1 }} />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#00F5FF"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: '#00F5FF', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-pane p-4">
        <p className="font-mono-ui text-xs text-circuit tracking-widest uppercase mb-4">Top Pages</p>
        <div className="space-y-3">
          {analytics.topPages.map(({ path, count, pct }) => (
            <div key={path} className="flex items-center gap-3">
              <span className="font-mono-ui text-xs text-pure-white/60 truncate flex-1 min-w-0">{path}</span>
              <div className="w-20 h-px bg-circuit/20 shrink-0 relative">
                <div className="absolute top-0 left-0 h-full bg-ion/50 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="font-mono-ui text-xs text-ion w-5 text-right shrink-0">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
