import { motion } from 'framer-motion';

const DEFAULT_SKILLS = [
  'Base44', 'React', 'Supabase', 'Anthropic API', 'OpenAI', 'Prompt Engineering',
  'System Architecture', 'MVP Development', 'Rapid Prototyping', 'TypeScript',
  'PostgreSQL', 'Vercel', 'REST APIs', 'Agent Workflows', 'Product Strategy',
];

export default function AboutSection({ settings, projects = [] }) {
  const baseSkills = settings?.skills?.length ? settings.skills : DEFAULT_SKILLS;
  const projectTags = projects.flatMap(p => p.tech_stack || []);
  const normalize = (s) => s.toLowerCase().replace(/[\s\-_\.]+/g, '');
  const seen = new Map();
  for (const skill of [...baseSkills, ...projectTags]) {
    const key = normalize(skill);
    if (!seen.has(key)) seen.set(key, skill);
  }
  const skills = [...seen.values()];
  const bio = settings?.bio || 'I build production-grade software at the speed of thought — fusing deep product intuition with AI orchestration to ship in days, not months. Startups and growth-stage companies hire me when they need something real, fast, and fully functional.';

  return (
    <section id="about" className="py-32 relative" aria-labelledby="about-heading">
      {/* Horizontal line */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="h-px bg-gradient-to-r from-ion/30 via-ion/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-4">
              ◈ Identity / About
            </p>
            <h2
              id="about-heading"
              className="font-display text-pure-white mb-8"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              THE BUILDER.
            </h2>
            <p
              className="text-circuit mb-8"
              style={{ fontSize: '1.125rem', lineHeight: '1.8' }}
            >
              {bio}
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: settings?.apps_deployed || '12+', label: 'Apps Deployed' },
                { value: '< 5', label: 'Days Per MVP' },
                { value: settings?.tokens_orchestrated || '47.2M', label: 'Tokens Orchestrated' },
                { value: '100%', label: 'AI-Augmented' },
              ].map(({ value, label }) => (
                <div key={label} className="glass-pane p-4 text-center">
                  <p className="font-display text-ion text-2xl mb-1">{value}</p>
                  <p className="font-mono-ui text-xs text-circuit tracking-wide uppercase">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-4">
              ◈ Capabilities / Stack
            </p>
            <h3
              className="font-display text-pure-white mb-8"
              style={{ fontSize: '1.5rem' }}
            >
              ACTIVE MODULES
            </h3>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="font-mono-ui text-xs tracking-widest px-3 py-2 border border-ion/20 text-circuit hover:border-ion/50 hover:text-ion transition-all duration-200 cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>

            {/* Social links */}
            {(settings?.github_url || settings?.linkedin_url || settings?.twitter_url || settings?.email) && (
              <div className="mt-10 flex flex-wrap gap-4">
                {settings?.github_url && (
                  <a href={settings.github_url} target="_blank" rel="noopener noreferrer"
                    className="font-mono-ui text-xs text-circuit hover:text-ion tracking-widest transition-colors min-h-[44px] flex items-center gap-2">
                    ↗ GITHUB
                  </a>
                )}
                {settings?.linkedin_url && (
                  <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer"
                    className="font-mono-ui text-xs text-circuit hover:text-ion tracking-widest transition-colors min-h-[44px] flex items-center gap-2">
                    ↗ LINKEDIN
                  </a>
                )}
                {settings?.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer"
                    className="font-mono-ui text-xs text-circuit hover:text-ion tracking-widest transition-colors min-h-[44px] flex items-center gap-2">
                    ↗ TWITTER/X
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`}
                    className="font-mono-ui text-xs text-circuit hover:text-ion tracking-widest transition-colors min-h-[44px] flex items-center gap-2">
                    ↗ EMAIL
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}