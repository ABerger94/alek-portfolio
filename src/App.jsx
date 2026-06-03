import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { base44 } from '@/api/base44Client';
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';

// Page imports
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import ProjectEditor from './pages/admin/ProjectEditor';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ResumePrint from './pages/ResumePrint';

const AdminRoute = ({ children }) => {
  const [state, setState] = useState({ loading: true, allowed: false, error: null });

  useEffect(() => {
    let mounted = true;

    base44.auth.me()
      .then((user) => {
        if (!mounted) return;
        setState({
          loading: false,
          allowed: user?.role === 'admin',
          error: user?.role === 'admin' ? null : 'Admin role required',
        });
      })
      .catch(() => {
        if (!mounted) return;
        setState({ loading: false, allowed: false, error: null });
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-ion/30 border-t-ion rounded-full animate-spin" />
      </div>
    );
  }

  if (!state.allowed && !state.error) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!state.allowed) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="font-mono-ui text-xs text-ion tracking-widest uppercase mb-3">Access denied</p>
          <h1 className="font-display text-2xl tracking-widest mb-4">ADMIN ROLE REQUIRED</h1>
          <p className="font-mono-ui text-xs text-circuit tracking-wide mb-6">
            Your Base44 account is signed in, but it is not an admin for this app.
          </p>
          <button
            onClick={() => base44.auth.logout('/admin-login')}
            className="px-4 py-3 bg-ion text-obsidian font-display text-xs tracking-widest hover:bg-ion/90 transition-colors"
          >
            SIGN OUT
          </button>
        </div>
      </div>
    );
  }

  return children;
};

const RouteViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    base44.functions.invoke('trackPageView', {
      page_path: location.pathname || '/',
    }).catch((error) => {
      console.warn('View tracking failed:', error);
    });
  }, [location.pathname]);

  return null;
};

const AuthenticatedApp = () => {
  return (
    <>
      <RouteViewTracker />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/resume" element={<ResumePrint />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin routes - password protected */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
        <Route path="/admin/projects/:id" element={<AdminRoute><ProjectEditor /></AdminRoute>} />
        <Route path="/admin/inquiries" element={<AdminRoute><AdminInquiries /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
