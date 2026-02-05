
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0a0a0a] max-w-md mx-auto relative text-white">
      {/* Fondo Animado de Gradientes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] size-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] size-[400px] bg-primary/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full px-8 justify-center">
        <div className="flex flex-col items-center mb-12 animate-in zoom-in duration-700">
          <div className="size-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(244,192,37,0.3)] rotate-12 mb-6">
            <span className="material-symbols-outlined text-black text-5xl font-black">pets</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter italic text-white">PERRI</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">The Alpha Experience</p>
        </div>

        {/* Card Neumórfica Oscura */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight mb-1">
              {mode === 'login' && 'Bienvenido'}
              {mode === 'register' && 'Crea tu Cuenta'}
              {mode === 'forgot' && 'Recuperación'}
            </h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Gestiona tu manada con elegancia
            </p>
          </div>

          <div className="space-y-4">
            <div className="group">
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl transition-colors group-focus-within:text-primary">mail</span>
                <input 
                  type="email" 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all outline-none"
                  placeholder="Email"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="group">
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl transition-colors group-focus-within:text-primary">lock</span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 text-sm font-bold focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all outline-none"
                    placeholder="Contraseña"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={onLogin}
            className="w-full h-16 bg-primary text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(244,192,37,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {mode === 'login' && 'Entrar ahora'}
            {mode === 'register' && 'Registrarse'}
            {mode === 'forgot' && 'Enviar link'}
            <span className="material-symbols-outlined font-black">arrow_right_alt</span>
          </button>

          <button 
            onClick={onLogin}
            className="w-full text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-primary transition-colors"
          >
            Entrar como invitado
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
           <div className="flex gap-4">
             {['login', 'register'].map((m) => (
               <button 
                 key={m}
                 onClick={() => setMode(m as any)}
                 className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${mode === m ? 'bg-white/10 text-white' : 'text-gray-600'}`}
               >
                 {m}
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
