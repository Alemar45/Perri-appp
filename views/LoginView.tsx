
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginView from './views/LoginView';
import HealthView from './views/HealthView';
import CommunityView from './views/CommunityView';
import VetsView from './views/VetsView';
import ChatView from './views/ChatView';
import ProfileView from './views/ProfileView';
import BottomNav from './components/BottomNav';

const MainLayout: React.FC<{ children: React.ReactNode; onLogout: () => void }> = ({ children, onLogout }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {children}
      </div>
      <BottomNav />
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('perri_auth') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('perri_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('perri_auth');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <LoginView onLogin={handleLogin} />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <MainLayout onLogout={handleLogout}><HealthView /></MainLayout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/community" 
          element={isAuthenticated ? <MainLayout onLogout={handleLogout}><CommunityView /></MainLayout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/vets" 
          element={isAuthenticated ? <MainLayout onLogout={handleLogout}><VetsView /></MainLayout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/chat" 
          element={isAuthenticated ? <MainLayout onLogout={handleLogout}><ChatView /></MainLayout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <MainLayout onLogout={handleLogout}><ProfileView onLogout={handleLogout} /></MainLayout> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
