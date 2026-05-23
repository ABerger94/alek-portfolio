export default function Footer({ settings }) {
  const name = settings?.builder_name || 'NEURAL ARCHITECT';
  return (
    <footer className="border-t border-ion/10 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono-ui text-xs text-circuit tracking-widest">
          © {new Date().getFullYear()} {name} — ALL SYSTEMS OPERATIONAL
        </p>
        <p className="font-mono-ui text-xs text-circuit/40 tracking-widest">
          BUILT WITH AI. ORCHESTRATED BY HUMAN.
        </p>
      </div>
    </footer>
  );
}