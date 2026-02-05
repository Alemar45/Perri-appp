
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_PET } from '../constants';

interface ProfileViewProps {
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [showDogId, setShowDogId] = useState(false);
  const [pet] = useState(() => {
    const saved = localStorage.getItem('perri_pet_data');
    return saved ? JSON.parse(saved) : INITIAL_PET;
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark');
  };

  const badges = [
    { name: 'Buen Chico', icon: 'award_star', color: 'text-amber-500' },
    { name: 'Explorador', icon: 'explore', color: 'text-emerald-500' },
    { name: 'Atleta', icon: 'bolt', color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark animate-in fade-in duration-500 pb-32">
      {/* Header Visual */}
      <div className="h-48 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-light dark:to-background-dark"></div>
      </div>

      <div className="px-6 -mt-20 relative z-10 space-y-8">
        {/* Perfil Usuario */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="size-28 rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 overflow-hidden shadow-2xl">
               <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="User" />
            </div>
            <div className="absolute -bottom-2 -right-2 size-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-white dark:border-zinc-900">
               <span className="material-symbols-outlined text-black text-lg font-black">check</span>
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight leading-none">Sarah T.</h2>
          <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mt-2">Pack Leader Premium</p>
        </div>

        {/* LA SORPRESA: PET PASSPORT 3D-ish */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Passport Canino</p>
            <span className="text-[10px] font-black text-emerald-500 uppercase">Verificado</span>
          </div>
          
          <div 
            onClick={() => setShowDogId(!showDogId)}
            className={`relative w-full transition-all duration-700 cursor-pointer overflow-hidden ${
              showDogId ? 'h-80' : 'h-28'
            } rounded-[3rem] bg-zinc-900 text-white shadow-2xl group border border-white/10`}
          >
            {/* Brillo dinámico */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none"></div>
            
            {!showDogId ? (
              <div className="flex items-center p-6 h-full justify-between">
                <div className="flex items-center gap-4">
                   <div className="size-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                     <span className="material-symbols-outlined text-3xl font-black">qr_code_2</span>
                   </div>
                   <div>
                     <p className="text-lg font-black italic tracking-tighter leading-none">PERRI ID DIGITAL</p>
                     <p className="text-[9px] font-black text-primary uppercase mt-1">Toca para presentar</p>
                   </div>
                </div>
                <div className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white animate-bounce">expand_more</span>
                </div>
              </div>
            ) : (
              <div className="p-8 animate-in zoom-in duration-500 flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-4xl font-black italic tracking-tighter leading-none">{pet.name}</h3>
                    <p className="text-xs font-black text-primary uppercase mt-2 tracking-widest">{pet.breed}</p>
                  </div>
                  <div className="size-20 rounded-2xl border-4 border-primary overflow-hidden shadow-xl rotate-3">
                    <img src={pet.imageUrl} className="w-full h-full object-cover" alt="Dog" />
                  </div>
                </div>

                <div className="mt-8 flex-1 grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">ID REGISTRO</p>
                    <p className="text-sm font-bold">#PR-2024-MAX-01</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-white p-2 rounded-xl">
                      <div className="size-14 bg-black rounded-sm flex items-center justify-center">
                         <span className="material-symbols-outlined text-white text-3xl">qr_code_2</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex justify-between items-center opacity-40">
                   <p className="text-[8px] font-black uppercase tracking-[0.4em]">VALIDEZ OFICIAL</p>
                   <span className="material-symbols-outlined">pets</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LOGROS */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-gray-400 px-2 tracking-widest">Muro de Logros</p>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {badges.map((badge) => (
              <div key={badge.name} className="flex flex-col items-center gap-2 min-w-[100px] p-4 bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                <div className={`size-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center ${badge.color}`}>
                  <span className="material-symbols-outlined text-2xl font-black">{badge.icon}</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-tighter">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AJUSTES RÁPIDOS */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm">
          <button 
            onClick={toggleDarkMode}
            className="w-full p-6 flex items-center justify-between active:bg-gray-50 dark:active:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="size-11 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                <span className="material-symbols-outlined">{isDarkMode ? 'dark_mode' : 'light_mode'}</span>
              </div>
              <p className="text-sm font-black">Modo Oscuro</p>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-primary' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
            </div>
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full p-6 flex items-center justify-between text-red-500 active:bg-red-50 dark:active:bg-red-500/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="size-11 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined">logout</span>
              </div>
              <p className="text-sm font-black uppercase tracking-widest">Cerrar Sesión</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
