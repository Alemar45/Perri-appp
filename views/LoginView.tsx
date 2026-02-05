
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark max-w-md mx-auto">
      <div className="flex items-center p-4 pb-2 justify-between">
        <div className="w-12 h-12 flex items-center justify-center bg-primary rounded-full">
          <span className="material-symbols-outlined text-white text-3xl">pets</span>
        </div>
        <h2 className="text-[#1c180d] dark:text-[#fcfbf8] text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Perri</h2>
      </div>

      <div className="px-4 py-6">
        <div 
          className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[220px] shadow-lg"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80")' }}
        />
      </div>

      <div className="px-4 pt-4">
        <h2 className="text-[#1c180d] dark:text-[#fcfbf8] tracking-light text-[28px] font-bold leading-tight text-center">¡Bienvenido, amante de los perros!</h2>
        <p className="text-[#9c8749] text-center text-sm font-medium pt-2">Inicia sesión para cuidar la salud de tu mejor amigo</p>
      </div>

      <div className="flex flex-col gap-1 px-4 py-6">
        <div className="flex flex-wrap items-end gap-4 py-2">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#1c180d] dark:text-[#fcfbf8] text-base font-medium leading-normal pb-2">Email</p>
            <input 
              className="form-input flex w-full min-w-0 flex-1 rounded-full text-[#1c180d] focus:outline-0 focus:ring-2 focus:ring-primary border border-[#e8e2ce] bg-white h-14 px-6 text-base" 
              placeholder="Ingresa tu email" 
              type="email"
            />
          </label>
        </div>
        
        <div className="flex flex-wrap items-end gap-4 py-2 relative">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#1c180d] dark:text-[#fcfbf8] text-base font-medium leading-normal pb-2">Contraseña</p>
            <div className="relative">
              <input 
                className="form-input flex w-full min-w-0 flex-1 rounded-full text-[#1c180d] focus:outline-0 focus:ring-2 focus:ring-primary border border-[#e8e2ce] bg-white h-14 px-6 pr-14 text-base" 
                placeholder="Ingresa tu contraseña" 
                type={showPassword ? "text" : "password"}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-4 text-[#9c8749]"
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </label>
        </div>
        
        <div className="flex justify-end px-2 pt-1">
          <button className="text-sm font-semibold text-primary">¿Olvidaste tu contraseña?</button>
        </div>
      </div>

      <div className="px-4 pb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex w-full h-14 items-center justify-center rounded-full bg-primary text-black text-lg font-bold shadow-md active:scale-[0.98] transition-transform"
        >
          Entrar
        </button>
      </div>

      <div className="flex items-center px-8 pb-6 gap-4">
        <div className="h-[1px] flex-1 bg-[#e8e2ce]"></div>
        <p className="text-xs text-[#9c8749] font-medium">O continúa con</p>
        <div className="h-[1px] flex-1 bg-[#e8e2ce]"></div>
      </div>

      <div className="flex justify-center gap-6 pb-8">
        <button className="w-14 h-14 rounded-full border border-[#e8e2ce] flex items-center justify-center bg-white shadow-sm active:scale-95 transition-all">
          <svg className="h-6 w-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c3.11 0 5.71-1.03 7.62-2.81l-3.57-2.77c-.99.66-2.23 1.06-4.05 1.06-3.11 0-5.74-2.1-6.68-4.93H1.23v2.85C3.13 20.21 7.29 23 12 23z" fill="#34A853"></path><path d="M5.32 13.55a5.95 5.95 0 010-3.1V7.6H1.23a11.97 11.97 0 000 8.8l4.09-2.85z" fill="#FBBC05"></path><path d="M12 4.64c1.69 0 3.21.58 4.41 1.72l3.31-3.31C17.71 1.14 15.11 0 12 0 7.29 0 3.13 2.79 1.23 6.75l4.09 2.85c.94-2.83 3.57-4.96 6.68-4.96z" fill="#EA4335"></path></svg>
        </button>
        <button className="w-14 h-14 rounded-full border border-[#e8e2ce] flex items-center justify-center bg-white shadow-sm active:scale-95 transition-all">
          <svg className="h-6 w-6" viewBox="0 0 24 24"><path d="M17.05 20.28c-.96.95-2.18 1.78-3.32 1.78-.97 0-1.42-.58-2.61-.58-1.18 0-1.68.56-2.63.56-1.11 0-2.48-.96-3.52-2.16-2.13-2.43-3.26-6.42-1.39-9.53.94-1.54 2.52-2.51 4.1-2.51.8 0 1.54.34 2.19.64.44.2.82.38 1.08.38.2 0 .58-.16 1.08-.39.73-.34 1.63-.75 2.6-.75 1.34 0 3.03.54 4.09 1.87-3.07 1.84-2.58 5.75.14 7.02-.75 1.56-1.85 3.04-3.13 4.27zm-2.44-17.2c-.17 2.06-1.87 3.66-3.8 3.51.21-2.13 2-3.79 3.8-3.51z"></path></svg>
        </button>
      </div>

      <div className="mt-auto pb-10 flex flex-col items-center">
        <p className="text-sm font-medium text-[#1c180d] dark:text-[#fcfbf8]">
          ¿No tienes una cuenta? 
          <button className="text-primary font-bold ml-1">Regístrate</button>
        </p>
      </div>
    </div>
  );
};

export default LoginView;
