
import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_PET, HEALTH_STATS } from '../constants';
import { PetProfile, HealthStat } from '../types';

const HealthView: React.FC = () => {
  // Estado del Perfil
  const [pet, setPet] = useState<PetProfile>(() => {
    const savedPet = localStorage.getItem('perri_pet_data');
    return savedPet ? JSON.parse(savedPet) : INITIAL_PET;
  });

  // Estado de los Registros
  const [stats, setStats] = useState<HealthStat[]>(() => {
    const savedStats = localStorage.getItem('perri_health_stats');
    return savedStats ? JSON.parse(savedStats) : HEALTH_STATS;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempPet, setTempPet] = useState<PetProfile>(pet);
  const [tempStats, setTempStats] = useState<HealthStat[]>(stats);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('perri_pet_data', JSON.stringify(pet));
    localStorage.setItem('perri_health_stats', JSON.stringify(stats));
  }, [pet, stats]);

  const categories = [
    { name: 'Salud', type: 'health' as const, icon: 'favorite' },
    { name: 'Higiene', type: 'hygiene' as const, icon: 'spa' },
    { name: 'Desparasitación', type: 'deworming' as const, icon: 'verified_user' },
  ];

  const handleOpenEdit = () => {
    setTempPet({ ...pet });
    setTempStats([...stats]);
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    setPet({ ...tempPet });
    setStats([...tempStats]);
    setIsEditModalOpen(false);
  };

  const handleUpdateStat = (id: string, newStatus: string) => {
    setTempStats(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempPet({ ...tempPet, imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pb-32 bg-background-light dark:bg-background-dark animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800">
        <div className="flex flex-col items-center p-5 pt-7 pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black italic tracking-tighter text-black dark:text-white">PERRI</h1>
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center rotate-12 shadow-lg shadow-primary/20">
               <span className="material-symbols-outlined text-black text-lg font-black">pets</span>
            </div>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary mt-2">
            Salud & Bienestar Elite
          </p>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* HERO PET SECTION */}
        <div className="relative group flex flex-col items-center">
          <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full scale-110"></div>
             <div 
                className="relative size-40 rounded-[3rem] border-4 border-primary bg-cover bg-center shadow-2xl z-10 transition-transform group-hover:scale-105 duration-500"
                style={{ backgroundImage: `url("${pet.imageUrl}")` }}
             />
             <button 
                onClick={handleOpenEdit}
                className="absolute -bottom-2 -right-2 z-20 size-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all border-4 border-background-light dark:border-background-dark"
             >
                <span className="material-symbols-outlined text-xl">edit</span>
             </button>
          </div>
          <div className="text-center mt-6">
            <h2 className="text-4xl font-black tracking-tighter italic leading-none">{pet.name}</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">{pet.breed}</p>
            <div className="flex gap-2 justify-center mt-4">
              <span className="px-4 py-1.5 bg-white dark:bg-zinc-800 rounded-full text-[10px] font-black uppercase border border-gray-100 dark:border-zinc-700 shadow-sm">{pet.age}</span>
              <span className="px-4 py-1.5 bg-white dark:bg-zinc-800 rounded-full text-[10px] font-black uppercase border border-gray-100 dark:border-zinc-700 shadow-sm">{pet.weight}</span>
            </div>
          </div>
        </div>

        {/* NUTRICIÓN CARD */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Plan Nutricional</h3>
            <button onClick={handleOpenEdit} className="text-primary text-[10px] font-black uppercase">Cambiar Dieta</button>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-50 dark:border-zinc-800 grid grid-cols-2 gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <span className="material-symbols-outlined text-7xl font-black">restaurant</span>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Alimento</p>
              <p className="font-black text-base italic leading-tight text-primary">{pet.foodType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ración</p>
              <p className="font-black text-base italic leading-tight">{pet.foodDosage}</p>
            </div>
          </div>
        </div>

        {/* CATEGORÍAS MÉDICAS */}
        {categories.map((cat) => (
          <div key={cat.name} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-lg">{cat.icon}</span>
                 <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">{cat.name}</h3>
              </div>
              <button onClick={handleOpenEdit} className="text-primary text-[10px] font-black uppercase">Editar</button>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-gray-50 dark:border-zinc-800 shadow-sm divide-y divide-gray-50 dark:divide-zinc-800">
              {stats.filter(s => s.type === cat.type).map((stat) => (
                <div key={stat.id} className="flex items-center justify-between p-6 group active:bg-gray-50 dark:active:bg-zinc-800 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className={`size-12 rounded-2xl flex items-center justify-center transition-all ${stat.color ? 'bg-red-50 text-red-500 shadow-red-500/10' : 'bg-gray-50 dark:bg-zinc-800 text-primary'} shadow-lg`}>
                      <span className="material-symbols-outlined text-2xl font-black">{stat.icon}</span>
                    </div>
                    <div>
                      <p className="text-base font-black italic tracking-tight group-hover:text-primary transition-colors">{stat.title}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${stat.color || 'text-gray-400'}`}>{stat.status}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* MODAL EDITAR SALUD */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/80 backdrop-blur-md px-4 pb-0">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-t-[3.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-300 h-[94vh] flex flex-col">
            <div className="flex items-center justify-between mb-8 shrink-0">
               <div>
                 <h3 className="text-3xl font-black tracking-tighter italic">Gestión de Salud</h3>
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2">Pack Leadership Hub</p>
               </div>
               <button onClick={() => setIsEditModalOpen(false)} className="size-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 active:scale-90 transition-all">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-10 pb-12">
              {/* Sección Foto */}
              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-gray-400 ml-4 tracking-widest">Identidad</p>
                <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-zinc-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-zinc-700">
                  <div 
                    className="size-24 rounded-3xl bg-center bg-cover bg-zinc-200 border-4 border-primary shrink-0"
                    style={{ backgroundImage: `url("${tempPet.imageUrl}")` }}
                  />
                  <div className="space-y-3">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full text-[10px] font-black text-black uppercase bg-primary px-6 py-3 rounded-2xl shadow-xl active:scale-95 transition-all"
                    >
                      Nueva Foto
                    </button>
                    <p className="text-[9px] font-bold text-gray-500 text-center uppercase">Formatos: JPG, PNG</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-gray-400 ml-3 tracking-widest">Nombre</p>
                    <input type="text" value={tempPet.name} onChange={(e) => setTempPet({...tempPet, name: e.target.value})} className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 font-bold focus:ring-4 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-gray-400 ml-3 tracking-widest">Edad</p>
                    <input type="text" value={tempPet.age} onChange={(e) => setTempPet({...tempPet, age: e.target.value})} className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 font-bold focus:ring-4 focus:ring-primary/20" />
                  </div>
                </div>
              </div>

              {/* Nutrición */}
              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-gray-400 ml-4 tracking-widest">Nutrición</p>
                <div className="bg-gray-50 dark:bg-zinc-800 p-8 rounded-[2.5rem] space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Alimento</p>
                    <input type="text" value={tempPet.foodType} onChange={(e) => setTempPet({...tempPet, foodType: e.target.value})} className="w-full h-14 bg-white dark:bg-zinc-700 border-none rounded-2xl px-6 font-bold focus:ring-4 focus:ring-primary/20 shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Ración</p>
                    <input type="text" value={tempPet.foodDosage} onChange={(e) => setTempPet({...tempPet, foodDosage: e.target.value})} className="w-full h-14 bg-white dark:bg-zinc-700 border-none rounded-2xl px-6 font-bold focus:ring-4 focus:ring-primary/20 shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Registros */}
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-4">
                  <p className="text-[11px] font-black uppercase text-gray-400 ml-4 tracking-widest">{cat.name}</p>
                  <div className="bg-gray-50 dark:bg-zinc-800 p-8 rounded-[3rem] space-y-6">
                    {tempStats.filter(s => s.type === cat.type).map(stat => (
                      <div key={stat.id} className="space-y-2">
                        <div className="flex items-center gap-2 ml-2">
                          <span className="material-symbols-outlined text-sm text-primary">{stat.icon}</span>
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.title}</p>
                        </div>
                        <input 
                          type="text" 
                          value={stat.status} 
                          onChange={(e) => handleUpdateStat(stat.id, e.target.value)} 
                          className="w-full h-14 bg-white dark:bg-zinc-700 border-none rounded-2xl px-6 font-bold focus:ring-4 focus:ring-primary/20 shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="shrink-0 pt-6 pb-12 flex gap-4">
               <button onClick={() => setIsEditModalOpen(false)} className="flex-1 h-16 bg-gray-100 dark:bg-zinc-800 rounded-2xl font-black text-gray-400 uppercase tracking-widest text-[10px]">
                 Cerrar
               </button>
               <button onClick={handleSave} className="flex-[2] h-16 bg-primary text-black rounded-2xl font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-widest text-[10px]">
                 Guardar Todo
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthView;
