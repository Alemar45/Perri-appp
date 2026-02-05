
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_PET } from '../constants';

interface ProfileViewProps {
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showDogId, setShowDogId] = useState(false);
  const [pet] = useState(() => {
    const saved = localStorage.getItem('perri_pet_data');
    return saved ? JSON.parse(saved) : INITIAL_PET;
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark animate-in fade-in duration-500 pb-20">
      {/* HEADER DE PERFIL */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-20 dark:opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-light dark:to-background-dark"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center">
          <div className="relative">
            <div className="size-28 rounded-[2.5rem] bg-zinc-900 border-4 border-white dark:border-zinc-800 overflow-hidden shadow-2xl">
               <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="User" />
            </div>
            <div className="absolute -bottom-2 -right-2 size-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-white dark:border-zinc-900">
               <span className="material-symbols-outlined text-black text-lg font-black">verified</span>
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight">Sarah Thompson</h2>
          <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Premium Member</p>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* SORPRESA: CREDENCIAL DIGITAL */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-400 px-2 tracking-widest">Digital Dog ID</p>
          <div 
            onClick={() => setShowDogId(!showDogId)}
            className={`relative overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 cursor-pointer shadow-2xl ${
              showDogId ? 'h-72 bg-zinc-900 text-white' : 'h-24 bg-primary text-black'
            }`}
          >
            {/* Elementos Decorativos de la Tarjeta */}
            <div className="absolute top-[-20px] right-[-20px] size-32 bg-white/10 rounded-full blur-2xl"></div>
            
            {!showDogId ? (
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center gap-4">
                   <div className="size-12 rounded-2xl bg-black/10 flex items-center justify-center">
                     <span className="material-symbols-outlined text-3xl font-black">badge</span>
                   </div>
                   <div>
                     <p className="font-black uppercase tracking-tighter italic">Credencial Perri</p>
                     <p className="text-[9px] font-black opacity-60">TOCA PARA VER ID DIGITAL</p>
                   </div>
                </div>
                <span className="material-symbols-outlined font-black">expand_more</span>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter leading-none">{pet.name}</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">{pet.breed}</p>
                  </div>
                  <div className="size-16 rounded-2xl bg-white border-4 border-primary overflow-hidden">
                    <img src={pet.imageUrl} className="w-full h-full object-cover" alt="ID" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[8px] font-black uppercase opacity-50 tracking-widest">ID ÚNICO</p>
                    <p className="text-xs font-bold">#P-2024-MAX</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase opacity-50 tracking-widest">PROPIETARIO</p>
                    <p className="text-xs font-bold">S. THOMPSON</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase opacity-50 tracking-widest">PESO ACTUAL</p>
                    <p className="text-xs font-bold">{pet.weight}</p>
                  </div>
                  <div className="flex justify-end items-end">
                    <div className="bg-white p-1 rounded-lg">
                      {/* Placeholder QR */}
                      <div className="size-10 bg-zinc-900 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <p className="text-[8px] font-black text-center mt-6 opacity-30 tracking-[0.5em]">VALIDEZ NACIONAL 🐾</p>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN CUENTA */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-400 px-2 tracking-widest">Seguridad y Cuenta</p>
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm divide-y divide-gray-50 dark:divide-zinc-800">
            <button 
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="w-full p-6 flex items-center justify-between group active:bg-gray-50 dark:active:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="size-11 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black">Cambiar Contraseña</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Actualizado hace 3 meses</p>
                </div>
              </div>
              <span className={`material-symbols-outlined transition-transform duration-300 ${showPasswordSection ? 'rotate-90' : ''}`}>chevron_right</span>
            </button>

            {showPasswordSection && (
              <div className="p-6 bg-gray-50 dark:bg-zinc-800/30 space-y-4 animate-in slide-in-from-top duration-300">
                <label className="block">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Contraseña Actual</p>
                  <input type="password" placeholder="••••••••" className="w-full h-12 bg-white dark:bg-zinc-900 border-none rounded-xl px-4 text-sm font-bold shadow-inner focus:ring-2 focus:ring-primary" />
                </label>
                <label className="block">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Nueva Contraseña</p>
                  <input type="password" placeholder="••••••••" className="w-full h-12 bg-white dark:bg-zinc-900 border-none rounded-xl px-4 text-sm font-bold shadow-inner focus:ring-2 focus:ring-primary" />
                </label>
                <button className="w-full h-12 bg-primary text-black font-black text-xs uppercase rounded-xl shadow-lg active:scale-95 transition-all">
                  Actualizar Ahora
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN PREFERENCIAS */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-400 px-2 tracking-widest">Ajustes de App</p>
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm divide-y divide-gray-50 dark:divide-zinc-800">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-11 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                  <span className="material-symbols-outlined">{isDarkMode ? 'dark_mode' : 'light_mode'}</span>
                </div>
                <div>
                  <p className="text-sm font-black">Modo Oscuro</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{isDarkMode ? 'Activado' : 'Desactivado'}</p>
                </div>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-zinc-700'}`}
              >
                <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <button 
          onClick={onLogout}
          className="w-full p-6 bg-red-50 dark:bg-red-500/10 rounded-[2rem] flex items-center justify-center gap-3 active:scale-95 transition-all group"
        >
          <span className="material-symbols-outlined text-red-500 font-black">logout</span>
          <span className="text-red-500 font-black text-xs uppercase tracking-widest">Cerrar Sesión</span>
        </button>

        <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] py-4">
          Perri v1.0.5 - Hecho con 🦴
        </p>
      </div>
    </div>
  );
};

export default ProfileView;
