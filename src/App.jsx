import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { base44 } from '@/api/base44Client';
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';

// Page imports
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import ProjectEditor from './pages/admin/ProjectEditor';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminSettings from './pages/admin/AdminSettings';
import ResumePrint from './pages/ResumePrint';

const AdminRoute = ({ children }) => {
  const [authState, setAuthState] = React.useState('loading'); // 'loading' | 'admin' | 'redirect'

  React.useEffect(() => {
    base44.auth.me().then(user => {
      if (user && user.role === 'admin') {
        setAuthState('admin');
      } else if (!user) {
        setAuthState('redirect');
      } else {
        // Logged in but not admin
        setAuthState('forbidden');
      }
    }).catch(() => {
      setAuthState('redirect');
    });
  }, []);

  if (authState === 'loading') return (
    <div className="fixed inset-0 flex items-center justify-center bg-obsidian">
      <div className="w-8 h-8 border-2 border-ion/30 border-t-ion rounded-full animate-spin"></div>
    </div>
  );

  if (authState === 'redirect') {
    base44.auth.redirectToLogin(window.location.origin + '/admin');
    return null;
  }

  if (authState === 'forbidden') return <Navigate to="/" replace />;

  return children;
};

const AuthenticatedApp = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/resume" element={<ResumePrint />} />

      {/* Admin routes — only for admin users */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
      <Route path="/admin/projects/:id" element={<AdminRoute><ProjectEditor /></AdminRoute>} />
      <Route path="/admin/inquiries" element={<AdminRoute><AdminInquiries /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
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