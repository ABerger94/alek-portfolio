import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

export default function ProjectsSection({ projects }) {
  return (
    <section id="projects" className="py-32 relative" aria-labelledby="projects-heading">
      {/* Section label */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-4">
            ◈ Featured Work
          </p>
          <h2
            id="projects-heading"
            className="font-display text-pure-white mb-4"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
          >
            THE VAULT
          </h2>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {projects.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="monolith-border bg-card aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}