import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import AnalysisPage from './pages/AnalysisPage';
import RealityCheckPage from './pages/RealityCheckPage';
import AppealPage from './pages/AppealPage';
import TrackingPage from './pages/TrackingPage';
import NotFoundPage from './pages/NotFoundPage';

import './styles/global.css';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/upload" element={<UploadPage />} />

              {/* Analysis & Case Processing Routes (supports /analysis, /analysis/:id, and nested paths with slashes) */}
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/analysis/:id" element={<AnalysisPage />} />
              <Route path="/analysis/*" element={<AnalysisPage />} />

              <Route path="/processing" element={<ProcessingPage />} />
              <Route path="/processing/:id" element={<ProcessingPage />} />
              <Route path="/processing/*" element={<ProcessingPage />} />

              <Route path="/reality-check" element={<RealityCheckPage />} />
              <Route path="/reality-check/:id" element={<RealityCheckPage />} />
              <Route path="/reality-check/*" element={<RealityCheckPage />} />

              <Route path="/appeal" element={<AppealPage />} />
              <Route path="/appeal/:id" element={<AppealPage />} />
              <Route path="/appeal/*" element={<AppealPage />} />

              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/tracking/:id" element={<TrackingPage />} />
              <Route path="/tracking/*" element={<TrackingPage />} />

              {/* Protected / Dashboard Route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

