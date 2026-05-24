import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Download } from 'lucide-react';

export default function Navbar({ builderName = "NEURAL ARCHITECT" }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);




  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-pane' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-sm tracking-widest text-ion hover:opacity-80 transition-opacity min-h-[44px] flex items-center"
        >
          {builderName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono-ui text-xs text-circuit hover:text-ion transition-colors duration-200 tracking-widest uppercase"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/resume"
            className="inline-flex items-center gap-1.5 font-mono-ui text-xs text-ion border border-ion/30 hover:border-ion/70 hover:bg-ion/5 transition-all duration-200 tracking-widest uppercase px-3 py-1.5 min-h-[44px] items-center"
          >
            <Download size={11} />
            PDF
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-circuit hover:text-ion transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-pane border-t border-ion/10">
          <nav className="flex flex-col px-6 py-4 gap-4" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-mono-ui text-xs text-circuit hover:text-ion transition-colors tracking-widest uppercase py-2 min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}