
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos validación y procedemos
    onLogin();
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#050505] max-w-md mx-auto relative text-white font-display">
      {/* Capa de fondo con video/imagen ambiental abstracta */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[-10%] right-[-10%] size-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] size-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full px-8 pt-20 pb-10">
        {/* Branding Branding */}
        <div className="flex flex-col items-center mb-10 animate-in fade-in zoom-in duration-1000">
          <div className="size-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-[0_0_60px_rgba(244,192,37,0.4)] rotate-12 mb-6">
            <span className="material-symbols-outlined text-black text-4xl font-black">pets</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic text-white leading-none">PERRI</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mt-3 opacity-80">The Alpha Experience</p>
        </div>

        {/* Card de Autenticación */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-zinc-900/40 backdrop-blur-3xl rounded-[3.5rem] p-8 border border-white/10 shadow-2xl space-y-8 animate-in slide-in-from-bottom-10 duration-700">
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-black tracking-tight italic">
                {mode === 'login' && 'Bienvenido'}
                {mode === 'register' && 'Únete a la manada'}
                {mode === 'forgot' && 'Recuperar'}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {mode === 'login' && 'Ingresa tus credenciales premium'}
                {mode === 'register' && 'Crea un perfil para tu mejor amigo'}
                {mode === 'forgot' && 'Te enviaremos un link de acceso'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="group space-y-2">
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl transition-colors group-focus-within:text-primary">mail</span>
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all outline-none placeholder:text-gray-600"
                    placeholder="Email institucional / Personal"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="group space-y-2">
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl transition-colors group-focus-within:text-primary">lock</span>
                    <input 
                      required
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 text-sm font-bold focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all outline-none placeholder:text-gray-600"
                      placeholder="Contraseña"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full h-16 bg-primary text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-[0_15px_40px_rgba(244,192,37,0.2)] active:scale-95 hover:brightness-110 transition-all flex items-center justify-center gap-3 mt-4"
              >
                {mode === 'login' && 'Entrar ahora'}
                {mode === 'register' && 'Registrarse'}
                {mode === 'forgot' && 'Enviar link'}
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </button>
            </form>

            <div className="flex flex-col gap-4 items-center">
              {mode === 'login' && (
                <button 
                  onClick={() => setMode('forgot')}
                  className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-primary transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
              
              <div className="flex items-center gap-4 w-full px-4">
                <div className="h-px flex-1 bg-white/10"></div>
                <span className="text-[9px] font-black text-gray-600 uppercase">o también</span>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>

              <button 
                onClick={onLogin}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              >
                <img src="https://www.google.com/favicon.ico" className="size-4 grayscale brightness-200" alt="Google" />
                Continuar como invitado
              </button>
            </div>
          </div>
        </div>

        {/* Switcher de modo */}
        <div className="mt-8 flex justify-center gap-8">
           <button 
             onClick={() => setMode('login')}
             className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${mode === 'login' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-500'}`}
           >
             Login
           </button>
           <button 
             onClick={() => setMode('register')}
             className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${mode === 'register' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-500'}`}
           >
             Registro
           </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
