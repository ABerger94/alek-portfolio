import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export default function ResumePrint() {
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.SiteSettings.filter({ key: 'profile' }, '-created_date', 1),
      base44.entities.Project.filter({ status: 'published' }, 'display_order', 20),
    ]).then(([setts, projs]) => {
      setSettings(setts?.[0] || null);
      setProjects((projs || []).slice(0, 3));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  const s = settings || {};
  const name = s.builder_name || 'YOUR NAME';

  return (
    <>
      {/* Print controls — hidden when printing */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-obsidian border-b border-ion/20 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 font-mono-ui text-xs text-circuit hover:text-ion tracking-widest transition-colors min-h-[44px]">
          <ArrowLeft size={12} /> BACK
        </Link>
        <div className="flex items-center gap-4">
          <p className="font-mono-ui text-xs text-circuit tracking-widest hidden sm:block">
            USE BROWSER PRINT → SAVE AS PDF FOR BEST RESULTS
          </p>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-ion text-obsidian font-display text-xs tracking-widest px-5 py-2.5 min-h-[44px] hover:bg-ion/90 transition-colors"
          >
            <Printer size={13} />
            PRINT / SAVE PDF
          </button>
        </div>
      </div>

      {/* Resume document */}
      <div className="print:pt-0 pt-16 bg-white min-h-screen">
        <div
          className="resume-doc mx-auto bg-white"
          style={{ maxWidth: '794px', fontFamily: 'Inter, Helvetica, Arial, sans-serif' }}
        >
          {/* ── HEADER ── */}
          <div style={{ background: '#020204', padding: '36px 40px 28px', position: 'relative', overflow: 'hidden' }}>
            {/* Cyan accent bar */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: '#00F5FF' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div>
                <h1 style={{ fontFamily: 'Inter Tight, Inter, sans-serif', fontSize: '32px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.03em', textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
                  {name}
                </h1>
                <p style={{ color: '#00F5FF', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '8px', marginBottom: '4px' }}>
                  {s.title || 'AI NATIVE PRODUCT BUILDER'}
                </p>
                {s.tagline && (
                  <p style={{ color: '#8E9196', fontSize: '11px', marginTop: '6px', lineHeight: 1.5, maxWidth: '400px' }}>
                    {s.tagline}
                  </p>
                )}
              </div>
              {/* Contact block */}
              <div style={{ textAlign: 'right', fontSize: '9.5px', color: '#8E9196', fontFamily: 'monospace', lineHeight: 2, flexShrink: 0 }}>
                {s.email && <div>{s.email}</div>}
                {s.github_url && <div>{s.github_url.replace('https://', '')}</div>}
                {s.linkedin_url && <div>{s.linkedin_url.replace('https://', '')}</div>}
              </div>
            </div>
          </div>

          <div style={{ padding: '32px 40px' }}>

            {/* ── BIO ── */}
            {s.bio && (
              <section style={{ marginBottom: '28px' }}>
                <SectionLabel>About</SectionLabel>
                <p style={{ fontSize: '11px', color: '#2d2d3a', lineHeight: 1.75 }}>{s.bio}</p>
              </section>
            )}

            {/* ── STATS ── */}
            <section style={{ marginBottom: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Apps Deployed', value: String(s.apps_deployed || '12+') },
                  { label: 'Tokens Orchestrated', value: s.tokens_orchestrated || '—' },
                  { label: 'Avg Build Time', value: s.avg_build_time || '< 5 Days' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: '#F5F8FC', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '20px', fontWeight: 800, color: '#020204', lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: '8px', color: '#8E9196', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px', fontFamily: 'monospace' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SKILLS ── */}
            {s.skills?.length > 0 && (
              <section style={{ marginBottom: '28px' }}>
                <SectionLabel>Skills & Stack</SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {s.skills.map(skill => (
                    <span key={skill} style={{ fontSize: '9.5px', background: '#EFF8FF', color: '#0070a0', padding: '3px 9px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* ── PROJECTS ── */}
            {projects.length > 0 && (
              <section>
                <SectionLabel>Active Projects</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {projects.map((project, idx) => (
                    <div key={project.id} style={{ pageBreakInside: 'avoid' }}>
                      {/* Title row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <h3 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '15px', fontWeight: 800, color: '#020204', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                          <span style={{ color: '#00F5FF', fontSize: '11px', marginRight: '8px', fontFamily: 'monospace' }}>{String(idx + 1).padStart(2, '0')}</span>
                          {project.title}
                        </h3>
                        {project.live_url && (
                          <span style={{ fontSize: '8.5px', color: '#00F5FF', fontFamily: 'monospace' }}>↗ {project.live_url}</span>
                        )}
                      </div>

                      {project.tagline && (
                        <p style={{ fontSize: '10.5px', color: '#555', fontStyle: 'italic', marginBottom: '10px', marginTop: '2px' }}>{project.tagline}</p>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                        {project.problem_statement && (
                          <div>
                            <div style={{ fontSize: '8px', color: '#00F5FF', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>The Logic</div>
                            <p style={{ fontSize: '10px', color: '#333', lineHeight: 1.65 }}>{project.problem_statement}</p>
                          </div>
                        )}
                        {project.architecture && (
                          <div>
                            <div style={{ fontSize: '8px', color: '#00F5FF', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Architecture</div>
                            <p style={{ fontSize: '10px', color: '#333', lineHeight: 1.65 }}>{stripHtml(project.architecture).slice(0, 300)}</p>
                          </div>
                        )}
                      </div>

                      {project.ai_collaboration_log && (
                        <div style={{ background: '#000', padding: '10px 14px', marginBottom: '10px' }}>
                          <div style={{ fontSize: '7.5px', color: '#00F5FF', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '5px' }}>// AI Collaboration Log</div>
                          <p style={{ fontSize: '9px', color: '#a0f0ff', fontFamily: 'monospace', lineHeight: 1.7, margin: 0 }}>
                            {stripHtml(project.ai_collaboration_log).slice(0, 400)}{stripHtml(project.ai_collaboration_log).length > 400 ? '...' : ''}
                          </p>
                        </div>
                      )}

                      {project.tech_stack?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {project.tech_stack.map(tag => (
                            <span key={tag} style={{ fontSize: '8px', background: '#EFF8FF', color: '#0070a0', padding: '2px 7px', fontFamily: 'monospace' }}>{tag}</span>
                          ))}
                        </div>
                      )}

                      {idx < projects.length - 1 && (
                        <div style={{ height: '1px', background: '#e5e7eb', marginTop: '20px' }} />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div style={{ background: '#020204', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '8px', color: '#8E9196', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
              {name} — AI NATIVE PRODUCT BUILDER
            </span>
            <span style={{ fontSize: '8px', color: '#00F5FF', fontFamily: 'monospace' }}>
              BUILT WITH AI. ORCHESTRATED BY HUMAN.
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .resume-doc { max-width: 100% !important; }
        }
      `}</style>
    </>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <span style={{ fontSize: '8px', color: '#00F5FF', fontFamily: 'monospace', letterSpacing: '0.18em', textTransform: 'uppercase' }}>◈ {children}</span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(0,245,255,0.4), transparent)' }} />
    </div>
  );
}