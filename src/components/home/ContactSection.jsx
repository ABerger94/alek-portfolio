import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '', email: '', message: '', inquiry_type: 'hiring'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    await base44.entities.ContactInquiry.create({ ...form, status: 'unread' });
    setSubmitted(true);
    setSubmitting(false);
  };

  const inputClass = "w-full bg-muted border border-ion/15 text-pure-white font-sans px-4 py-3 text-sm focus:outline-none focus:border-ion/60 transition-colors placeholder-circuit min-h-[44px]";

  return (
    <section id="contact" className="py-32 relative" aria-labelledby="contact-heading">
      {/* Horizontal line */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="h-px bg-gradient-to-r from-ion/30 via-ion/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Left: Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-4">
              ◈ Initiate / Contact
            </p>
            <h2
              id="contact-heading"
              className="font-display text-pure-white mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              START A<br />SESSION.
            </h2>
            <p className="text-circuit max-w-sm" style={{ fontSize: '1rem', lineHeight: '1.8' }}>
              Whether you need an MVP in a week, an internal tool that actually works, or a technical partner who speaks product — let's talk.
            </p>

            <div className="mt-12 space-y-4">
              {[
                { label: 'RESPONSE TIME', value: '< 24 HOURS' },
                { label: 'AVAILABILITY', value: 'OPEN TO WORK' },
                { label: 'TIMEZONE', value: 'FLEXIBLE' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-ion/10 pb-4">
                  <span className="font-mono-ui text-xs text-circuit tracking-widest">{label}</span>
                  <span className="font-mono-ui text-xs text-ion tracking-widest">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {submitted ? (
              <div className="glass-pane p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <CheckCircle className="text-ion mb-4" size={40} />
                <h3 className="font-display text-pure-white text-2xl mb-3">TRANSMISSION RECEIVED.</h3>
                <p className="text-circuit">I'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-pane p-8 space-y-4" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="font-mono-ui text-xs text-circuit tracking-widest uppercase block mb-2">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="font-mono-ui text-xs text-circuit tracking-widest uppercase block mb-2">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiry-type" className="font-mono-ui text-xs text-circuit tracking-widest uppercase block mb-2">Inquiry Type</label>
                  <select
                    id="inquiry-type"
                    value={form.inquiry_type}
                    onChange={e => setForm({ ...form, inquiry_type: e.target.value })}
                    className={inputClass + ' cursor-pointer'}
                  >
                    <option value="hiring">Hiring — Full-time / Contract Role</option>
                    <option value="freelance">Freelance — Project Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="font-mono-ui text-xs text-circuit tracking-widest uppercase block mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className={inputClass + ' resize-none'}
                    placeholder="Tell me about the project or role..."
                  />
                </div>

                {error && (
                  <p className="font-mono-ui text-xs text-destructive">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-ion text-obsidian font-display text-xs tracking-widest px-8 py-4 min-h-[44px] hover:bg-ion/90 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'TRANSMITTING...' : 'SEND TRANSMISSION'}
                  {!submitting && <Send size={13} />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}