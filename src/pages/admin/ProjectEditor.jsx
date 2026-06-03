import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, ArrowLeft, Upload, Plus, X } from 'lucide-react';

const EMPTY_PROJECT = {
  title: '', tagline: '', thumbnail_url: '', live_url: '', github_url: '', download_url: '', video_embed_url: '',
  problem_statement: '', architecture: '', ai_collaboration_log: '',
  tech_stack: [], status: 'draft', display_order: 99
};

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [project, setProject] = useState(EMPTY_PROJECT);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingDownload, setUploadingDownload] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      base44.entities.Project.filter({ id })
        .then((data) => {
          if (data?.[0]) setProject(data[0]);
        })
        .catch(() => {
          setError('Unable to load this project. Confirm your Base44 account has admin access.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = (field, value) => setProject(prev => ({ ...prev, [field]: value }));

  const save = async () => {
    setSaving(true);
    setError('');

    try {
      if (isNew) {
        const created = await base44.entities.Project.create(project);
        navigate(`/admin/projects/${created.id}`);
      } else {
        const updates = { ...project };
        delete updates.id;
        delete updates.created_date;
        delete updates.updated_date;
        delete updates.created_by;
        await base44.entities.Project.update(project.id, updates);
      }
    } catch (err) {
      const denied = err?.status === 401 || err?.status === 403;
      setError(
        denied
          ? 'Permission denied. Sign in with a Base44 admin account before saving projects.'
          : 'Save failed. Please try again.'
      );
      console.error('Project save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleThumbnail = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('thumbnail_url', file_url);
    setUploading(false);
  };

  const handleDownloadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDownload(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('download_url', file_url);
    setUploadingDownload(false);
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (!tag || project.tech_stack?.includes(tag)) return;
    set('tech_stack', [...(project.tech_stack || []), tag]);
    setNewTag('');
  };

  const removeTag = (tag) => set('tech_stack', project.tech_stack.filter(t => t !== tag));

  const inputClass = "w-full bg-muted border border-ion/15 text-pure-white font-sans px-3 py-2.5 text-sm focus:outline-none focus:border-ion/50 transition-colors placeholder-circuit min-h-[44px]";
  const labelClass = "font-mono-ui text-xs text-circuit tracking-widest uppercase block mb-2";

  const quillModules = {
    toolbar: [
      [{ header: [2, 3, false] }],
      ['bold', 'italic', 'code'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-ion/30 border-t-ion rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/admin/projects')}
              className="font-mono-ui text-xs text-circuit hover:text-ion tracking-widest flex items-center gap-2 mb-3 min-h-[44px]"
            >
              <ArrowLeft size={12} /> BACK
            </button>
            <h1 className="font-display text-pure-white" style={{ fontSize: '2rem' }}>
              {isNew ? 'NEW PROJECT' : 'EDIT PROJECT'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={project.status}
              onChange={e => set('status', e.target.value)}
              className="bg-muted border border-ion/15 text-circuit font-mono-ui text-xs tracking-widest px-3 py-2 focus:outline-none focus:border-ion/50 min-h-[44px] cursor-pointer"
            >
              <option value="draft">DRAFT</option>
              <option value="published">PUBLISHED</option>
            </select>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-ion text-obsidian font-display text-xs tracking-widest px-6 py-3 min-h-[44px] hover:bg-ion/90 transition-colors disabled:opacity-50"
            >
              <Save size={13} />
              {saving ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </div>
        {error && (
          <div className="mb-6 border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive font-mono-ui text-xs tracking-wide">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Core fields */}
          <div className="glass-pane p-6 space-y-4">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase border-b border-ion/10 pb-3 mb-4">Core Info</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Title *</label>
                <input type="text" value={project.title} onChange={e => set('title', e.target.value)}
                  className={inputClass} placeholder="Project name" />
              </div>
              <div>
                <label className={labelClass}>Display Order</label>
                <input type="number" value={project.display_order} onChange={e => set('display_order', Number(e.target.value))}
                  className={inputClass} placeholder="1" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input type="text" value={project.tagline} onChange={e => set('tagline', e.target.value)}
                className={inputClass} placeholder="Short punchy description" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Live App URL</label>
                <input type="url" value={project.live_url} onChange={e => set('live_url', e.target.value)}
                  className={inputClass} placeholder="https://..." />
              </div>
              <div>
                <label className={labelClass}>Video Walkthrough URL</label>
                <input type="url" value={project.video_embed_url} onChange={e => set('video_embed_url', e.target.value)}
                  className={inputClass} placeholder="Loom or YouTube URL" />
              </div>
              <div>
                <label className={labelClass}>GitHub Repository URL</label>
                <input type="url" value={project.github_url} onChange={e => set('github_url', e.target.value)}
                  className={inputClass} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className={labelClass}>Download File URL</label>
                <input type="url" value={project.download_url} onChange={e => set('download_url', e.target.value)}
                  className={inputClass} placeholder="https://... or upload below" />
                <div className="mt-2">
                  <label className="inline-flex items-center gap-2 border border-ion/20 text-circuit hover:text-ion font-mono-ui text-xs tracking-widest px-4 py-2 cursor-pointer hover:border-ion/40 transition-colors min-h-[44px]">
                    <Upload size={12} />
                    {uploadingDownload ? 'UPLOADING...' : 'UPLOAD ARCHIVE'}
                    <input type="file" onChange={handleDownloadFile} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="glass-pane p-6">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase border-b border-ion/10 pb-3 mb-4">Thumbnail</p>
            <div className="flex items-start gap-4">
              <div className="w-32 h-20 bg-muted border border-ion/10 overflow-hidden shrink-0">
                {project.thumbnail_url
                  ? <img src={project.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center">
                      <span className="font-mono-ui text-xs text-circuit/30">NO IMG</span>
                    </div>
                }
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className={labelClass}>Image URL</label>
                  <input type="url" value={project.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)}
                    className={inputClass} placeholder="https://..." />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono-ui text-xs text-circuit">OR</span>
                  <label className="inline-flex items-center gap-2 border border-ion/20 text-circuit hover:text-ion font-mono-ui text-xs tracking-widest px-4 py-2 cursor-pointer hover:border-ion/40 transition-colors min-h-[44px]">
                    <Upload size={12} />
                    {uploading ? 'UPLOADING...' : 'UPLOAD FILE'}
                    <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Product Logic */}
          <div className="glass-pane p-6">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase border-b border-ion/10 pb-3 mb-4">Product Logic</p>
            <label className={labelClass}>Problem Statement — What & Why</label>
            <textarea
              value={project.problem_statement}
              onChange={e => set('problem_statement', e.target.value)}
              rows={4}
              className={inputClass + ' resize-none'}
              placeholder="What specific problem does this solve, and who is it for?"
            />
          </div>

          {/* Architecture */}
          <div className="glass-pane p-6">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase border-b border-ion/10 pb-3 mb-4">Architecture</p>
            <label className={labelClass}>System Architecture — How It's Built</label>
            <div className="quill-dark">
              <ReactQuill
                theme="snow"
                value={project.architecture}
                onChange={val => set('architecture', val)}
                modules={quillModules}
                placeholder="Describe the tech stack and how data flows through the app..."
              />
            </div>
          </div>

          {/* AI Collaboration Log */}
          <div className="glass-pane p-6">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase border-b border-ion/10 pb-3 mb-4">AI Collaboration Log</p>
            <label className={labelClass}>The Debugging Story — Your Edge</label>
            <div className="quill-dark">
              <ReactQuill
                theme="snow"
                value={project.ai_collaboration_log}
                onChange={val => set('ai_collaboration_log', val)}
                modules={quillModules}
                placeholder="Detail a specific moment where the AI hit a wall and how you diagnosed + fixed it..."
              />
            </div>
          </div>

          {/* Tech stack */}
          <div className="glass-pane p-6">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase border-b border-ion/10 pb-3 mb-4">Tech Stack Tags</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {(project.tech_stack || []).map(tag => (
                <span key={tag} className="flex items-center gap-2 font-mono-ui text-xs text-ion border border-ion/20 px-3 py-1.5">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors" aria-label={`Remove ${tag}`}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()}
                className={inputClass + ' flex-1'}
                placeholder="React, Supabase, Anthropic..."
              />
              <button
                onClick={addTag}
                className="px-4 py-2 border border-ion/20 text-circuit hover:text-ion hover:border-ion/40 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Add tag"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .quill-dark .ql-toolbar { background: #0a0a14; border-color: rgba(0,245,255,0.15); }
        .quill-dark .ql-container { background: #0a0a14; border-color: rgba(0,245,255,0.15); min-height: 180px; color: #F8FAFC; font-size: 15px; }
        .quill-dark .ql-editor { min-height: 180px; line-height: 1.7; }
        .quill-dark .ql-stroke { stroke: #8E9196; }
        .quill-dark .ql-fill { fill: #8E9196; }
        .quill-dark .ql-picker { color: #8E9196; }
        .quill-dark .ql-toolbar button:hover .ql-stroke { stroke: #00F5FF; }
        .quill-dark .ql-active .ql-stroke { stroke: #00F5FF; }
      `}</style>
    </AdminLayout>
  );
}
