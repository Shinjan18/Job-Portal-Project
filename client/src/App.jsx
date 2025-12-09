import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Main Pages
import HomePage from './pages/HomePage';
import JobsPage from './pages/jobs/JobsPage';
import JobDetailsPage from './pages/jobs/JobDetailsPage';
import PostJobPage from './pages/employer/PostJobPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployerDashboardPage from './pages/employer/EmployerDashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import ApplicationsPage from './pages/applications/ApplicationsPage';

// Static Pages
import AboutPage from './pages/static/AboutPage';
import ContactPage from './pages/static/ContactPage';
import NotFoundPage from './pages/static/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Route>

          {/* Main Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            
            {/* Public Routes */}
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:id" element={<JobDetailsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            
            {/* Protected Routes - Job Seeker */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute roles={['jobseeker']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes - Employer */}
            <Route
              path="employer"
              element={
                <ProtectedRoute roles={['employer']}>
                  <EmployerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="employer/post-job"
              element={
                <ProtectedRoute roles={['employer']}>
                  <PostJobPage />
                </ProtectedRoute>
              }
            />
            
            {/* Common Protected Routes */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="applications"
              element={
                <ProtectedRoute>
                  <ApplicationsPage />
                </ProtectedRoute>
              }
            />
            
            {/* 404 - Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
