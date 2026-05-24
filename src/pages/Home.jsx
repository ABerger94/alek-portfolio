import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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

  const name = settings?.builder_name || 'Alek';
  const title = settings?.title || 'AI Native Product Builder';
  const tagline = settings?.tagline || 'I build at the speed of thought.';
  const pageTitle = `${name} — ${title}`;
  const description = `${name} is an ${title}. ${tagline} Explore projects, case studies, and AI-native product work.`;
  const siteUrl = window.location.origin;

  return (
    <div className="bg-obsidian min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${name}, AI builder, product builder, portfolio, ${settings?.skills?.join(', ') || 'React, AI, web development'}`} />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        {settings?.thumbnail_url && <meta property="og:image" content={settings.thumbnail_url} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        {settings?.thumbnail_url && <meta name="twitter:image" content={settings.thumbnail_url} />}

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": name,
          "jobTitle": title,
          "description": description,
          "url": siteUrl,
          "sameAs": [
            settings?.github_url,
            settings?.linkedin_url,
            settings?.twitter_url,
          ].filter(Boolean),
        })}</script>
      </Helmet>

      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar builderName={settings?.builder_name || 'NEURAL ARCHITECT'} />

      <main id="main-content">
        <HeroSection settings={settings} projects={projects} />
        <ProjectsSection projects={projects} />
        <AboutSection settings={settings} projects={projects} />
        <ContactSection />
      </main>

      <Footer settings={settings} />
    </div>
  );
}