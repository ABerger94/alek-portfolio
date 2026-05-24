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
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import ProjectEditor from './pages/admin/ProjectEditor';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminSettings from './pages/admin/AdminSettings';
import ResumePrint from './pages/ResumePrint';

const AdminRoute = ({ children }) => {
  const authenticated = sessionStorage.getItem('admin_authenticated') === 'true';
  
  if (!authenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

const AuthenticatedApp = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/resume" element={<ResumePrint />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Admin routes — password protected */}
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