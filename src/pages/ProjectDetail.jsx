import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ExternalLink, ArrowLeft, Copy, Check, Github, Download } from 'lucide-react';

function TerminalBlock({ content, title }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = content?.replace(/<[^>]+>/g, '') || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-block rounded-none overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ion/15 bg-obsidian">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-ion/60" />
          <span className="font-mono-ui text-xs text-circuit ml-3 tracking-widest">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="font-mono-ui text-xs text-circuit hover:text-ion transition-colors flex items-center gap-1.5 min-h-[44px] min-w-[44px] justify-center"
          aria-label="Copy content"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>

      {/* Content */}
      <div
        className="p-6 text-sm leading-relaxed prose prose-invert max-w-none
          prose-headings:font-display prose-headings:text-pure-white prose-headings:tracking-wider
          prose-p:text-circuit prose-p:leading-relaxed
          prose-strong:text-ion prose-code:text-ion prose-code:bg-ion/10 prose-code:px-1.5 prose-code:py-0.5
          prose-li:text-circuit prose-ul:text-circuit"
        dangerouslySetInnerHTML={{ __html: content || '<p class="text-circuit">No content yet.</p>' }}
      />
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [proj, setts] = await Promise.all([
        base44.entities.Project.filter({ id }),
        base44.entities.SiteSettings.filter({ key: 'profile' }, '-created_date', 1),
      ]);
      setProject(proj?.[0] || null);
      setSettings(setts?.[0] || null);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-obsidian min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ion/30 border-t-ion rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-obsidian min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="font-display text-pure-white text-4xl">PROJECT NOT FOUND</p>
        <Link to="/" className="font-mono-ui text-xs text-ion tracking-widest hover:opacity-70 flex items-center gap-2">
          <ArrowLeft size={12} /> RETURN HOME
        </Link>
      </div>
    );
  }

  // Convert YouTube/Loom URL to embed
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('loom.com/share/')) {
      return url.replace('loom.com/share/', 'loom.com/embed/');
    }
    if (url.includes('youtube.com/watch?v=')) {
      const vid = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${vid}`;
    }
    if (url.includes('youtu.be/')) {
      const vid = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${vid}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(project.video_embed_url);

  return (
    <div className="bg-obsidian min-h-screen">
      <Navbar builderName={settings?.builder_name || 'NEURAL ARCHITECT'} />

      <main className="pt-24">
        {/* Back */}
        <div className="max-w-5xl mx-auto px-6 mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono-ui text-xs text-circuit hover:text-ion tracking-widest transition-colors min-h-[44px]"
          >
            <ArrowLeft size={12} /> BACK TO VAULT
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-4">
              ◈ Case Study / Deep Logic
            </p>
            <h1
              className="font-display text-pure-white mb-4"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
            >
              {project.title}
            </h1>
            <p className="text-circuit text-xl mb-8">{project.tagline}</p>

            {/* Links row */}
            <div className="flex flex-wrap gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 glass-pane px-6 py-3 font-mono-ui text-xs text-ion tracking-widest hover:bg-ion/5 transition-colors min-h-[44px]"
                >
                  <div className="pulse-dot" />
                  OPEN LIVE APP
                  <ExternalLink size={12} />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 glass-pane px-6 py-3 font-mono-ui text-xs text-circuit hover:text-ion tracking-widest hover:bg-ion/5 transition-colors min-h-[44px]"
                >
                  <Github size={12} />
                  VIEW ON GITHUB
                </a>
              )}
              {project.download_url && (
                <a
                  href={project.download_url}
                  download
                  className="inline-flex items-center gap-3 glass-pane px-6 py-3 font-mono-ui text-xs text-circuit hover:text-ion tracking-widest hover:bg-ion/5 transition-colors min-h-[44px]"
                >
                  <Download size={12} />
                  DOWNLOAD FILES
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* SECTION 1: Video */}
        {embedUrl && (
          <div className="max-w-5xl mx-auto px-6 mb-20">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-4">
              ◈ Signal_01 / Live Walkthrough
            </p>
            <div className="terminal-block">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-ion/15 bg-obsidian">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-ion/60" />
                <span className="font-mono-ui text-xs text-circuit ml-3 tracking-widest">VIDEO_WALKTHROUGH.mp4</span>
              </div>
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  title={`${project.title} walkthrough`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Product Logic & Architecture */}
        <div className="max-w-5xl mx-auto px-6 mb-20">
          <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-4">
            ◈ Signal_02 / Product Logic & Architecture
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Problem */}
            <div className="glass-pane p-8">
              <h2 className="font-display text-pure-white text-xl mb-4 tracking-wide">THE LOGIC</h2>
              <p className="font-mono-ui text-xs text-ion tracking-widest mb-4">WHAT & WHY</p>
              <p className="text-circuit leading-relaxed" style={{ fontSize: '1rem' }}>
                {project.problem_statement || 'No problem statement provided.'}
              </p>
            </div>
            {/* Architecture */}
            <div className="glass-pane p-8">
              <h2 className="font-display text-pure-white text-xl mb-4 tracking-wide">THE ARCHITECTURE</h2>
              <p className="font-mono-ui text-xs text-ion tracking-widest mb-4">HOW IT'S BUILT</p>
              {project.architecture ? (
                <div
                  className="text-circuit leading-relaxed prose prose-sm prose-invert max-w-none prose-p:text-circuit prose-strong:text-ion prose-li:text-circuit"
                  dangerouslySetInnerHTML={{ __html: project.architecture }}
                  style={{ fontSize: '1rem' }}
                />
              ) : (
                <p className="text-circuit">No architecture details provided.</p>
              )}
            </div>
          </div>

          {/* Tech stack */}
          {project.tech_stack?.length > 0 && (
            <div className="mt-6 glass-pane p-6 flex flex-wrap gap-2 items-center">
              <span className="font-mono-ui text-xs text-circuit tracking-widest mr-4">STACK:</span>
              {project.tech_stack.map((tag) => (
                <span key={tag} className="font-mono-ui text-xs px-3 py-1.5 border border-ion/20 text-ion tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: AI Collaboration Log */}
        <div className="max-w-5xl mx-auto px-6 mb-20">
          <div className="flex items-center gap-4 mb-4">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase">
              ◈ Signal_03 / AI Collaboration Log
            </p>
            <div className="flex-1 h-px bg-ion/10" />
            <div className="flex items-center gap-2">
              <div className="pulse-dot" />
              <span className="font-mono-ui text-xs text-ion">THE EDGE</span>
            </div>
          </div>
          <p className="text-circuit mb-6 text-sm">
            The moment the AI hit a wall — and how I diagnosed, debugged, and course-corrected to ship.
          </p>
          <TerminalBlock
            content={project.ai_collaboration_log}
            title="AI_COLLABORATION.log"
          />
        </div>

      </main>

      <Footer settings={settings} />
    </div>
  );
}