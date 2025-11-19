import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import EmailVerification from './components/Auth/EmailVerification';

import VotingPage from './components/Voting/VotingPage';
import SuccessPage from './components/Voting/SuccessPage';

import AdminDashboard from './components/Admin/AdminDashboard';
import ClearDatabaseAdmin from './components/Admin/ClearDatabaseAdmin';

import ProtectedRoute from './components/Shared/ProtectedRoute';
// import LoadingSpinner from './components/Shared/LoadingSpinner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route 
              path="/verify-email" 
              element={
                <ProtectedRoute>
                  <EmailVerification />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/vote" 
              element={
                <ProtectedRoute>
                  <VotingPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/success" 
              element={
                <ProtectedRoute>
                  <SuccessPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/clear-database" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <ClearDatabaseAdmin />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;