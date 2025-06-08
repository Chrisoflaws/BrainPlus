import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { isPWA } from './utils/pwa';
import Home from './pages/Home';
import About from './pages/About';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import Documentation from './pages/Documentation';
import Support from './pages/Support';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Security from './pages/Security';
import Services from './pages/Services';
import Resources from './pages/Resources';
import SecondBrain from './pages/SecondBrain';
import Login from './pages/Login';
import Register from './pages/Register';
import AccountCreated from './pages/AccountCreated';
import SecondBrainDashboard from './pages/SecondBrainDashboard';
import ConnectToSecondBrain from './pages/ConnectToSecondBrain';
import DailyChecklist from './pages/DailyChecklist';
import ProgressGoals from './pages/ProgressGoals';
import AppResources from './pages/AppResources';
import TroubleshootingGuide from './pages/TroubleshootingGuide';
import NotFound from './pages/NotFound';
import AppLayout from './components/AppLayout';
import LoadingScreen from './components/LoadingScreen';
import CircuitBreakerStatus from './components/CircuitBreakerStatus';

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isPWAMode] = React.useState(isPWA());

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Routes>
        {/* Public Marketing Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/support" element={<Support />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/security" element={<Security />} />
        <Route path="/services" element={<Services />} />
        <Route path="/second-brain" element={<SecondBrain />} />
        <Route path="/troubleshooting" element={<TroubleshootingGuide />} />
        <Route path="/account-created" element={<AccountCreated />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/app/dashboard\" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/app/dashboard\" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Protected App Routes */}
        <Route
          path="/app"
          element={
            isAuthenticated ? (
              <AppLayout />
            ) : (
              <Navigate to="/login\" state={{ from: location.pathname }} replace />
            )
          }
        >
          <Route path="dashboard" element={<SecondBrainDashboard />} />
          <Route path="connect" element={<ConnectToSecondBrain />} />
          <Route path="daily-checklist" element={<DailyChecklist />} />
          <Route path="progress-goals" element={<ProgressGoals />} />
          <Route path="resources" element={<AppResources />} />
          <Route index element={<Navigate to="dashboard\" replace />} />
        </Route>

        {/* Root Route */}
        <Route
          path="/"
          element={
            isPWAMode ? (
              isAuthenticated ? (
                <Navigate to="/app/dashboard\" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Navigate to={isAuthenticated ? "/app/dashboard" : "/home"} replace />
            )
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Circuit Breaker Status (Development Only) */}
      <CircuitBreakerStatus />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;