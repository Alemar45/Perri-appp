
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Salud', icon: 'health_and_safety' },
    { path: '/community', label: 'Muro', icon: 'dynamic_feed' },
    { path: '/vets', label: 'Vets', icon: 'local_hospital' },
    { path: '/profile', label: 'Perfil', icon: 'person' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800 pb-8 pt-3 px-6 z-50 flex justify-center">
      <div className="max-w-md w-full flex justify-between items-center relative">
        {navItems.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-primary scale-110' : 'text-gray-400'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'material-symbols-fill' : ''}`} style={{ fontSize: '26px' }}>
                {item.icon}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}

        {/* Botón Central de IA */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => navigate('/chat')}
            className={`size-16 rounded-full shadow-2xl flex items-center justify-center transition-all -mt-10 border-4 border-background-light dark:border-background-dark ${
              location.pathname === '/chat' ? 'bg-black text-primary' : 'bg-primary text-black'
            }`}
          >
            <span className="material-symbols-outlined text-3xl font-black">pets</span>
          </button>
          <span className="text-[9px] font-black uppercase tracking-wider mt-1 text-primary">PERRI AI</span>
        </div>

        {navItems.slice(2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-primary scale-110' : 'text-gray-400'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'material-symbols-fill' : ''}`} style={{ fontSize: '26px' }}>
                {item.icon}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;

