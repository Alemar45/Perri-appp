
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#050505] max-w-md mx-auto relative text-white font-display">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] size-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] size-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full px-8 pt-24 pb-12">
        <div className="flex flex-col items-center mb-16 animate-in fade-in zoom-in duration-1000">
          <div className="size-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(244,192,37,0.4)] rotate-12 mb-8">
            <span className="material-symbols-outlined text-black text-5xl font-black">pets</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter italic text-white leading-none">PERRI</h1>
          <p className="text-[12px] font-black uppercase tracking-[0.6em] text-primary mt-4 opacity-80">Premium Care</p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-zinc-900/40 backdrop-blur-3xl rounded-[3.5rem] p-10 border border-white/10 shadow-2xl space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight italic">
                {mode === 'login' ? 'Bienvenido' : 'Únete al Pack'}
              </h2>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-5">
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-18 bg-white/5 border border-white/10 rounded-3xl px-8 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                placeholder="Tu Email"
              />
              <button 
                type="submit"
                className="w-full h-18 bg-primary text-black font-black text-xs uppercase tracking-[0.3em] rounded-3xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Entrar ahora
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </button>
            </form>

            <button 
              onClick={() => onLogin()}
              className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest"
            >
              Continuar como invitado
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-8">
          <button onClick={() => setMode('login')} className={`text-[11px] font-black uppercase tracking-widest ${mode === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>Login</button>
          <button onClick={() => setMode('register')} className={`text-[11px] font-black uppercase tracking-widest ${mode === 'register' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>Registro</button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
