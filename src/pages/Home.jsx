import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [projs, setts] = await Promise.all([
        base44.entities.Project.filter({ status: 'published' }, 'display_order', 20),
        base44.entities.SiteSettings.filter({ key: 'profile' }, '-created_date', 1),
      ]);
      setProjects(projs || []);
      setSettings(setts?.[0] || null);
      document.title = `${setts?.[0]?.builder_name || "Alek"}'s Portfolio`;
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="bg-obsidian min-h-screen">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar builderName={settings?.builder_name || 'NEURAL ARCHITECT'} />

      <main id="main-content">
        <HeroSection settings={settings} />
        <ProjectsSection projects={projects} />
        <AboutSection settings={settings} />
        <ContactSection />
      </main>

      <Footer settings={settings} />
    </div>
  );
}