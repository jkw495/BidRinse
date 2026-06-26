import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public pages
import Home from './pages/Home';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import ForBusinesses from './pages/ForBusinesses';
import Terms from './pages/Terms';
import Login from './pages/Login';
import CustomerRegister from './pages/CustomerRegister';
import BusinessRegister from './pages/BusinessRegister';

// Customer pages
import CustomerDashboard from './pages/customer/Dashboard';
import PostJob from './pages/customer/PostJob';
import MyJobs from './pages/customer/MyJobs';
import JobDetail from './pages/customer/JobDetail';

// Business pages
import BusinessDashboard from './pages/business/Dashboard';
import AvailableJobs from './pages/business/AvailableJobs';
import MyQuotes from './pages/business/MyQuotes';
import ActiveJobs from './pages/business/ActiveJobs';
import Earnings from './pages/business/Earnings';
import BusinessProfile from './pages/business/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminBusinesses from './pages/admin/Businesses';
import AdminCustomers from './pages/admin/Customers';
import AdminJobs from './pages/admin/Jobs';

import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (user) {
    if (user.role === 'customer') return <Navigate to="/customer/dashboard" replace />;
    if (user.role === 'business') return <Navigate to="/business/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/for-businesses" element={<ForBusinesses />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><CustomerRegister /></GuestRoute>} />
      <Route path="/register/business" element={<GuestRoute><BusinessRegister /></GuestRoute>} />
      <Route path="/terms" element={<Terms />} />

      {/* Customer */}
      <Route path="/customer/dashboard" element={<ProtectedRoute roles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/customer/post-job" element={<ProtectedRoute roles={['customer']}><PostJob /></ProtectedRoute>} />
      <Route path="/customer/jobs" element={<ProtectedRoute roles={['customer']}><MyJobs /></ProtectedRoute>} />
      <Route path="/customer/jobs/:id" element={<ProtectedRoute roles={['customer']}><JobDetail /></ProtectedRoute>} />

      {/* Business */}
      <Route path="/business/dashboard" element={<ProtectedRoute roles={['business']}><BusinessDashboard /></ProtectedRoute>} />
      <Route path="/business/jobs" element={<ProtectedRoute roles={['business']}><AvailableJobs /></ProtectedRoute>} />
      <Route path="/business/quotes" element={<ProtectedRoute roles={['business']}><MyQuotes /></ProtectedRoute>} />
      <Route path="/business/active-jobs" element={<ProtectedRoute roles={['business']}><ActiveJobs /></ProtectedRoute>} />
      <Route path="/business/earnings" element={<ProtectedRoute roles={['business']}><Earnings /></ProtectedRoute>} />
      <Route path="/business/profile" element={<ProtectedRoute roles={['business']}><BusinessProfile /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/businesses" element={<ProtectedRoute roles={['admin']}><AdminBusinesses /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute roles={['admin']}><AdminCustomers /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute roles={['admin']}><AdminJobs /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
