import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import ResumeUpload from './pages/ResumeUpload';
import JobMatcher from './pages/JobMatching/JDMatcher';
import Settings from './pages/Settings';
// import Payments from './pages/Payments';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  
  // Clone children and pass logout prop
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { onLogout: logout });
    }
    return child;
  });

  return isAuthenticated ? childrenWithProps : <Navigate to="/auth" replace />;
};

// Public Route Component (for auth pages)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

// Session Manager Component
const SessionManager = ({ children }) => {
  const { setIsAuthenticated, setUser } = useAuth();

  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem('session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session?.user && session?.access_token) {
          setUser(session.user);
          setIsAuthenticated(true);
        }
      }
    };

    // Check on mount
    checkSession();

    // Add storage event listener for cross-tab synchronization
    const handleStorageChange = (e) => {
      if (e.key === 'session') {
        if (e.newValue) {
          const session = JSON.parse(e.newValue);
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setIsAuthenticated, setUser]);

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <SessionManager>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/resume-upload"
              element={
                <PrivateRoute>
                  <ResumeUpload />
                </PrivateRoute>
              }
            />
            <Route
              path="/job-matching"
              element={
                <PrivateRoute>
                  {/* <JobMatching /> */}
                  <JobMatcher/>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            /> 
            {/* <Route
              path="/payments"
              element={
                <PrivateRoute>
                  <Payments />
                </PrivateRoute>
              }
            />  */}

            {/* Catch all route - redirect to dashboard if authenticated, otherwise to auth */}
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Navigate to="/" replace />
                </PrivateRoute>
              }
            />
          </Routes>
        </SessionManager>
      </Router>
    </AuthProvider>
  );
}

export default App;
