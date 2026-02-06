import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginView from "./vistas/LoginView";
import HealthView from "./vistas/HealthView";
import CommunityView from "./vistas/CommunityView";
import VetsView from "./vistas/VetsView";
import ChatView from "./vistas/ChatView";
import ProfileView from "./vistas/ProfileView";

import BottomNav from "./componentes/BottomNav";

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("perri_auth") === "true";
  });

  const handleLogin = () => {
    localStorage.setItem("perri_auth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("perri_auth");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <LoginView onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <MainLayout>
                <HealthView />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/community"
          element={
            isAuthenticated ? (
              <MainLayout>
                <CommunityView />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/vets"
          element={
            isAuthenticated ? (
              <MainLayout>
                <VetsView />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/chat"
          element={
            isAuthenticated ? (
              <MainLayout>
                <ChatView />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <MainLayout>
                <ProfileView onLogout={handleLogout} />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

