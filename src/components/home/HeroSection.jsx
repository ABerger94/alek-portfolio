import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const STAT_LABELS = [
  { label: 'APPS DEPLOYED', key: 'apps_deployed', suffix: '' },
  { label: 'TOKENS ORCHESTRATED', key: 'tokens_orchestrated', suffix: '' },
  { label: 'SYSTEM STATUS', value: 'OPERATIONAL', color: 'text-ion' },
];

export default function HeroSection({ settings, projects = [] }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Animated counter
  useEffect(() => {
    const target = settings?.apps_deployed || projects.length || 0;
    const step = Math.ceil(target / 40);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [settings, projects]);

  const name = settings?.builder_name || 'YOUR NAME';
  const tagline = settings?.tagline || 'I BUILD AT THE SPEED OF THOUGHT.';
  const title = settings?.title || 'AI NATIVE PRODUCT BUILDER';

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-obsidian"
      aria-label="Hero section"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 bg-grid-pattern bg-grid opacity-100"
        aria-hidden="true"
      />

      {/* Cursor-following glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(ellipse 600px 600px at ${mousePos.x}% ${mousePos.y}%, rgba(0,245,255,0.07) 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-ion/5 blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-ion/3 blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid lg:grid-cols-[1fr_340px] gap-16 items-center">

          {/* Left: Identity */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono-ui text-xs text-ion tracking-widest mb-6 uppercase"
            >
              ◈ AI Native Builder
            </motion.p>

            {/* Stroke name behind */}
            <div className="relative mb-4">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display leading-none"
                style={{ fontSize: 'clamp(3rem, 9vw, 8.5rem)' }}
              >
                <span
                  className="block"
                  style={{
                    WebkitTextStroke: '1px rgba(0,245,255,0.15)',
                    color: 'transparent',
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    userSelect: 'none',
                  }}
                  aria-hidden="true"
                >
                  {name}
                </span>
                <span className="relative text-pure-white">{name}</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="font-display text-ion mb-6"
              style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2.75rem)' }}
            >
              {tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-mono-ui text-xs text-circuit tracking-widest mb-10 uppercase"
            >
              {title}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="hidden lg:flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-3 bg-ion text-obsidian font-display text-xs tracking-widest px-8 py-4 min-h-[44px] hover:bg-ion/90 transition-all duration-200 neural-glow-strong"
              >
                VIEW PROJECTS
                <ArrowDown size={14} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 border border-ion/30 text-ion font-display text-xs tracking-widest px-8 py-4 min-h-[44px] hover:border-ion/70 hover:bg-ion/5 transition-all duration-200"
              >
                WORK WITH ME
              </a>
            </motion.div>

            {/* Mobile Portfolio Vitality Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-pane p-5 mt-8 lg:hidden"
              aria-label="Portfolio vitality stats"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono-ui text-xs text-circuit tracking-widest uppercase">Portfolio Vitality</span>
                <div className="flex items-center gap-2">
                  <div className="pulse-dot" aria-hidden="true" />
                  <span className="font-mono-ui text-xs text-ion">LIVE</span>
                </div>
              </div>
              {(() => {
                const allTags = [...new Set(projects.flatMap(p => p.tech_stack || []))];
                const newestProject = projects[0];
                const newestDate = newestProject?.created_date
                  ? new Date(newestProject.created_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : null;
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-mono-ui text-xs text-circuit tracking-widest uppercase mb-1">Active Projects</p>
                        <p className="font-display text-ion" style={{ fontSize: '2rem', lineHeight: 1 }}>{count}</p>
                      </div>
                      <div>
                        <p className="font-mono-ui text-xs text-circuit tracking-widest uppercase mb-1">Avg Build</p>
                        <p className="font-display text-ion" style={{ fontSize: '2rem', lineHeight: 1 }}>{settings?.avg_build_time || '< 5d'}</p>
                      </div>
                    </div>
                    <div className="h-px bg-ion/10" />
                    <div>
                      <p className="font-mono-ui text-xs text-circuit tracking-widest uppercase mb-1">Tokens Orchestrated</p>
                      <p className="font-display text-ion" style={{ fontSize: '1.75rem', lineHeight: 1 }}>{settings?.tokens_orchestrated || '—'}</p>
                    </div>
                    <div className="h-px bg-ion/10" />
                    <div>
                      <p className="font-mono-ui text-xs text-circuit tracking-widest uppercase mb-2">Tech Stack Depth</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-ion/20 rounded-full overflow-hidden">
                          <div className="h-full bg-ion rounded-full" style={{ width: `${Math.min(allTags.length * 4, 100)}%` }} />
                        </div>
                        <span className="font-mono-ui text-xs text-ion whitespace-nowrap">{allTags.length} TECHS</span>
                      </div>
                    </div>
                    {newestDate && (
                      <>
                        <div className="h-px bg-ion/10" />
                        <div className="flex items-center justify-between">
                          <span className="font-mono-ui text-xs text-circuit">LAST SHIP</span>
                          <span className="font-mono-ui text-xs text-ion">{newestDate}</span>
                        </div>
                      </>
                    )}
                    <div className="h-px bg-ion/10" />
                    <div className="flex items-center justify-between">
                      <span className="font-mono-ui text-xs text-circuit">STATUS</span>
                      <span className="font-mono-ui text-xs text-ion">BUILDING</span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>

            {/* Mobile CTA buttons — below widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4 mt-6 lg:hidden"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-3 bg-ion text-obsidian font-display text-xs tracking-widest px-8 py-4 min-h-[44px] hover:bg-ion/90 transition-all duration-200 neural-glow-strong"
              >
                VIEW PROJECTS
                <ArrowDown size={14} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 border border-ion/30 text-ion font-display text-xs tracking-widest px-8 py-4 min-h-[44px] hover:border-ion/70 hover:bg-ion/5 transition-all duration-200"
              >
                WORK WITH ME
              </a>
            </motion.div>
          </div>

          {/* Right: Portfolio Vitality Widget — desktop only */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass-pane p-6 hidden lg:block"
            aria-label="Portfolio vitality stats"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono-ui text-xs text-circuit tracking-widest uppercase">Portfolio Vitality</span>
              <div className="flex items-center gap-2">
                <div className="pulse-dot" aria-hidden="true" />
                <span className="font-mono-ui text-xs text-ion">LIVE</span>
              </div>
            </div>

            {(() => {
              const publishedCount = projects.length;
              const allTags = [...new Set(projects.flatMap(p => p.tech_stack || []))];
              const newestProject = projects[0];
              const newestDate = newestProject?.created_date
                ? new Date(newestProject.created_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : null;

              return (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono-ui text-xs text-circuit tracking-widest uppercase mb-1">Active Projects</p>
                      <p className="font-display text-ion" style={{ fontSize: '2.5rem', lineHeight: 1 }}>
                        {count}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-ui text-xs text-circuit tracking-widest uppercase mb-1">Avg Build</p>
                      <p className="font-display text-ion" style={{ fontSize: '2rem', lineHeight: 1 }}>
                        {settings?.avg_build_time || '< 5d'}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-ion/10" />

                  <div>
                    <p className="font-mono-ui text-xs text-circuit tracking-widest uppercase mb-1">Tokens Orchestrated</p>
                    <p className="font-display text-ion" style={{ fontSize: '2rem', lineHeight: 1 }}>
                      {settings?.tokens_orchestrated || '—'}
                    </p>
                  </div>

                  <div className="h-px bg-ion/10" />

                  <div>
                    <p className="font-mono-ui text-xs text-circuit tracking-widest uppercase mb-2">Tech Stack Depth</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-ion/20 rounded-full overflow-hidden">
                        <div className="h-full bg-ion rounded-full transition-all duration-1000" style={{ width: `${Math.min(allTags.length * 4, 100)}%` }} />
                      </div>
                      <span className="font-mono-ui text-xs text-ion whitespace-nowrap">{allTags.length} TECHS</span>
                    </div>
                  </div>

                  {newestDate && (
                    <>
                      <div className="h-px bg-ion/10" />
                      <div className="flex items-center justify-between">
                        <span className="font-mono-ui text-xs text-circuit">LAST SHIP</span>
                        <span className="font-mono-ui text-xs text-ion">{newestDate}</span>
                      </div>
                    </>
                  )}

                  <div className="h-px bg-ion/10" />

                  <div className="flex items-center justify-between">
                    <span className="font-mono-ui text-xs text-circuit">STATUS</span>
                    <span className="font-mono-ui text-xs text-ion">BUILDING</span>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-mono-ui text-xs text-circuit tracking-widest">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-ion/50 to-transparent" />
      </motion.div>
    </section>
  );
}