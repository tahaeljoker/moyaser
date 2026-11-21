import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import PublicShowcase from './components/PublicShowcase.jsx';
import AdminLogin from './components/admin/AdminLogin.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Public Real Estate Showcase */}
            <Route path="/" element={<PublicShowcase />} />

            {/* 2. Admin & Sales Login Page */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 3. Protected CRM & Unit Management Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* 4. Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
