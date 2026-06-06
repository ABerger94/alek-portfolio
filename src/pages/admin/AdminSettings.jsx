import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Save, Plus, X } from 'lucide-react';

const EMPTY = {
  key: 'profile',
  builder_name: '', title: 'AI Native Product Builder',
  tagline: 'I BUILD AT THE SPEED OF THOUGHT.',
  bio: '', skills: [], github_url: '', linkedin_url: '',
  twitter_url: '', email: '',
  tokens_orchestrated: '47.2M', apps_deployed: 12
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(EMPTY);
  const [recordId, setRecordId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    base44.entities.SiteSettings.filter({ key: 'profile' }).then(data => {
      if (data?.[0]) {
        setSettings(data[0]);
        setRecordId(data[0].id);
      }
    });
  }, []);

  const set = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

  const save = async () => {
    setSaving(true);
    if (recordId) {
      await base44.entities.SiteSettings.update(recordId, settings);
    } else {
      const created = await base44.entities.SiteSettings.create(settings);
      setRecordId(created.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s || settings.skills?.includes(s)) return;
    set('skills', [...(settings.skills || []), s]);
    setNewSkill('');
  };

  const removeSkill = (skill) => set('skills', settings.skills.filter(s => s !== skill));

  const inputClass = "w-full bg-muted border border-ion/15 text-pure-white font-sans px-3 py-2.5 text-sm focus:outline-none focus:border-ion/50 transition-colors placeholder-circuit min-h-[44px]";
  const labelClass = "font-mono-ui text-xs text-circuit tracking-widest uppercase block mb-2";

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-2">◈ Admin / Settings</p>
            <h1 className="font-display text-pure-white" style={{ fontSize: '2.5rem' }}>SITE SETTINGS</h1>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-ion text-obsidian font-display text-xs tracking-widest px-6 py-3 min-h-[44px] hover:bg-ion/90 transition-colors disabled:opacity-50"
          >
            <Save size={13} />
            {saving ? 'SAVING...' : saved ? 'SAVED ✓' : 'SAVE'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Identity */}
          <div className="glass-pane p-6 space-y-4">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase border-b border-ion/10 pb-3">Identity</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Your Name</label>
                <input type="text" value={settings.builder_name} onChange={e => set('builder_name', e.target.value)}
                  className={inputClass} placeholder="Alex Chen" />
              </div>
              <div>
                <label className={labelClass}>Professional Title</label>
                <input type="text" value={settings.title} onChange={e => set('title', e.target.value)}
                  className={inputClass} placeholder="AI Native Product Builder" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Hero Tagline</label>
              <input type="text" value={settings.tagline} onChange={e => set('tagline', e.target.value)}
                className={inputClass} placeholder="I BUILD AT THE SPEED OF THOUGHT." />
            </div>
            <div>
              <label className={labelClass}>Bio</label>
              <textarea
                value={settings.bio}
                onChange={e => set('bio', e.target.value)}
                rows={4}
                className={inputClass + ' resize-none'}
                placeholder="Your about section bio..."
              />
            </div>
          </div>

          {/* Stats Widget */}
          <div className="glass-pane p-6 space-y-4">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase border-b border-ion/10 pb-3">Hero Stats Widget</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Apps Deployed (number)</label>
                <input type="number" value={settings.apps_deployed} onChange={e => set('apps_deployed', Number(e.target.value))}
                  className={inputClass} placeholder="12" />
              </div>
              <div>
                <label className={labelClass}>Tokens Orchestrated (display)</label>
                <input type="text" value={settings.tokens_orchestrated} onChange={e => set('tokens_orchestrated', e.target.value)}
                  className={inputClass} placeholder="47.2M" />
              </div>
              <div>
                <label className={labelClass}>Last Shipped (display)</label>
                <input type="text" value={settings.last_shipped || ''} onChange={e => set('last_shipped', e.target.value)}
                  className={inputClass} placeholder="Jun 2025" />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="glass-pane p-6 space-y-4">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase border-b border-ion/10 pb-3">Links</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={settings.email} onChange={e => set('email', e.target.value)}
                  className={inputClass} placeholder="you@email.com" />
              </div>
              <div>
                <label className={labelClass}>GitHub URL</label>
                <input type="url" value={settings.github_url} onChange={e => set('github_url', e.target.value)}
                  className={inputClass} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input type="url" value={settings.linkedin_url} onChange={e => set('linkedin_url', e.target.value)}
                  className={inputClass} placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className={labelClass}>Twitter/X URL</label>
                <input type="url" value={settings.twitter_url} onChange={e => set('twitter_url', e.target.value)}
                  className={inputClass} placeholder="https://twitter.com/..." />
              </div>
              <div>
                <label className={labelClass}>Apps Website URL</label>
                <input type="url" value={settings.apps_website_url || ''} onChange={e => set('apps_website_url', e.target.value)}
                  className={inputClass} placeholder="https://yourportfolio.com" />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass-pane p-6">
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase border-b border-ion/10 pb-3 mb-4">Skills / Stack</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {(settings.skills || []).map(skill => (
                <span key={skill} className="flex items-center gap-2 font-mono-ui text-xs text-ion border border-ion/20 px-3 py-1.5">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors" aria-label={`Remove ${skill}`}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                className={inputClass + ' flex-1'}
                placeholder="Add a skill..."
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 border border-ion/20 text-circuit hover:text-ion hover:border-ion/40 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}