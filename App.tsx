
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginView from './views/LoginView';
import HealthView from './views/HealthView';
import CommunityView from './views/CommunityView';
import VetsView from './views/VetsView';
import ChatView from './views/ChatView';
import ProfileView from './views/ProfileView';
import BottomNav from './components/BottomNav';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {children}
      </div>
      <BottomNav />
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for demo purposes
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/" element={<ProtectedRoute><HealthView /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><CommunityView /></ProtectedRoute>} />
        <Route path="/vets" element={<ProtectedRoute><VetsView /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatView /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
