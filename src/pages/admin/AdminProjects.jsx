import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    const data = await base44.entities.Project.list('display_order', 50);
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (project) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    await base44.entities.Project.update(project.id, { status: newStatus });
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, status: newStatus } : p));
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    setDeleting(id);
    await base44.entities.Project.delete(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-2">◈ Admin / Projects</p>
            <h1 className="font-display text-pure-white" style={{ fontSize: '2.5rem' }}>PROJECTS</h1>
          </div>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-ion text-obsidian font-display text-xs tracking-widest px-6 py-3 min-h-[44px] hover:bg-ion/90 transition-colors"
          >
            <Plus size={14} />
            NEW PROJECT
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-pane p-12 text-center">
            <p className="font-mono-ui text-xs text-circuit tracking-widest mb-4">NO PROJECTS YET</p>
            <Link to="/admin/projects/new" className="font-mono-ui text-xs text-ion tracking-widest hover:opacity-70">
              CREATE YOUR FIRST PROJECT →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass-pane px-4 py-4 flex items-center gap-4 group"
              >
                <GripVertical size={14} className="text-circuit/30 cursor-grab" />

                {/* Thumbnail */}
                <div className="w-12 h-8 bg-muted overflow-hidden shrink-0">
                  {project.thumbnail_url
                    ? <img src={project.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono-ui text-xs text-circuit/30">IMG</span>
                      </div>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-mono-ui text-xs text-pure-white truncate">{project.title}</p>
                  <p className="font-mono-ui text-xs text-circuit/50 truncate">{project.tagline}</p>
                </div>

                {/* Status toggle */}
                <button
                  onClick={() => toggleStatus(project)}
                  className={`flex items-center gap-2 font-mono-ui text-xs tracking-widest px-3 py-1.5 border transition-all min-h-[44px] shrink-0 ${
                    project.status === 'published'
                      ? 'border-ion/30 text-ion hover:border-ion/60'
                      : 'border-circuit/20 text-circuit hover:border-circuit/40'
                  }`}
                  aria-label={`Toggle ${project.title} status`}
                >
                  {project.status === 'published' ? <Eye size={11} /> : <EyeOff size={11} />}
                  {project.status?.toUpperCase()}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/admin/projects/${project.id}`}
                    className="p-2 text-circuit hover:text-ion transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={`Edit ${project.title}`}
                  >
                    <Edit size={14} />
                  </Link>
                  <button
                    onClick={() => deleteProject(project.id)}
                    disabled={deleting === project.id}
                    className="p-2 text-circuit hover:text-destructive transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-40"
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}