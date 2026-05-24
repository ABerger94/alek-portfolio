import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Github, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative card-hover monolith-border bg-card overflow-hidden"
    >
      {/* Scan line animation */}
      <div className="scan-line" aria-hidden="true" />

      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-obsidian flex items-center justify-center">
            <div className="font-display text-ion/20 text-5xl select-none">{String(index + 1).padStart(2, '0')}</div>
          </div>
        )}

        {/* Overlay with live URL */}
        <div className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 glass-pane px-5 py-3 font-mono-ui text-xs text-ion tracking-widest hover:bg-ion/10 transition-colors min-h-[44px]"
              aria-label={`Open live app: ${project.title}`}
            >
              <div className="pulse-dot" />
              LIVE APP
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Index label */}
        <div className="absolute top-4 left-4 font-mono-ui text-xs text-ion/60 tracking-widest">
          PROJ_{String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-pure-white mb-2 group-hover:text-ion transition-colors duration-200" style={{ fontSize: '1.4rem' }}>
          {project.title}
        </h3>
        <p className="text-circuit text-sm mb-5 line-clamp-2" style={{ fontSize: '0.875rem' }}>
          {project.tagline}
        </p>

        {/* Three-column logic row */}
        <div className="grid grid-cols-3 gap-3 mb-5 border-t border-ion/10 pt-5">
          <div>
            <p className="font-mono-ui text-xs text-ion/60 tracking-widest uppercase mb-1">Logic</p>
            <p className="text-xs text-circuit" style={{ fontSize: '0.75rem' }}>
              {project.problem_statement || '—'}
            </p>
          </div>
          <div>
            <p className="font-mono-ui text-xs text-ion/60 tracking-widest uppercase mb-1">Stack</p>
            <div className="flex flex-wrap gap-1">
              {(project.tech_stack || []).slice(0, 3).map((tag) => (
                <span key={tag} className="font-mono-ui text-xs text-circuit border border-ion/15 px-1.5 py-0.5 leading-none">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono-ui text-xs text-ion/60 tracking-widest uppercase mb-1">AI Edge</p>
            <p className="text-xs text-circuit line-clamp-3" style={{ fontSize: '0.75rem' }}>
              {project.ai_collaboration_log
                ? project.ai_collaboration_log.replace(/<[^>]+>/g, '').slice(0, 80) + '...'
                : '—'}
            </p>
          </div>
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            to={`/project/${project.id}`}
            className="inline-flex items-center gap-2 font-mono-ui text-xs text-ion tracking-widest hover:gap-4 transition-all duration-200 min-h-[44px]"
            aria-label={`View case study: ${project.title}`}
          >
            VIEW CASE STUDY
            <ArrowRight size={12} />
          </Link>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 font-mono-ui text-xs text-circuit hover:text-ion tracking-widest transition-colors min-h-[44px]"
              aria-label={`GitHub repo: ${project.title}`}
            >
              <Github size={12} /> GITHUB
            </a>
          )}
          {project.download_url && (
            <a
              href={project.download_url}
              download
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 font-mono-ui text-xs text-circuit hover:text-ion tracking-widest transition-colors min-h-[44px]"
              aria-label={`Download files: ${project.title}`}
            >
              <Download size={12} /> DOWNLOAD
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}