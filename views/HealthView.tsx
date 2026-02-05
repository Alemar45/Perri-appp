
import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_PET, HEALTH_STATS } from '../constants';
import { PetProfile, HealthStat } from '../types';

const HealthView: React.FC = () => {
  // Estado del Perfil
  const [pet, setPet] = useState<PetProfile>(() => {
    const savedPet = localStorage.getItem('perri_pet_data');
    return savedPet ? JSON.parse(savedPet) : INITIAL_PET;
  });

  // Estado de los Registros (Vacunas, Baños, etc.)
  const [stats, setStats] = useState<HealthStat[]>(() => {
    const savedStats = localStorage.getItem('perri_health_stats');
    return savedStats ? JSON.parse(savedStats) : HEALTH_STATS;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempPet, setTempPet] = useState<PetProfile>(pet);
  const [tempStats, setTempStats] = useState<HealthStat[]>(stats);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistencia
  useEffect(() => {
    localStorage.setItem('perri_pet_data', JSON.stringify(pet));
    localStorage.setItem('perri_health_stats', JSON.stringify(stats));
  }, [pet, stats]);

  const categories = [
    { name: 'Salud', type: 'health' as const },
    { name: 'Higiene', type: 'hygiene' as const },
    { name: 'Desparasitación', type: 'deworming' as const },
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

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setTempPet({ ...tempPet, imageUrl: event.target?.result as string });
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  return (
    <div className="pb-10 relative">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex flex-col items-center p-4 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-extrabold leading-none tracking-tighter text-primary">PERRI</h1>
            <span className="text-3xl animate-bounce">🐾</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9c8749] mt-1">
            "El mejor amigo de tu mejor amigo" 🦴
          </p>
        </div>
      </header>

      <div className="flex flex-col items-center p-6 gap-4">
        <div className="relative">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-primary shadow-xl"
            style={{ backgroundImage: `url("${pet.imageUrl}")` }}
          />
          <button 
            onClick={handleOpenEdit}
            className="absolute bottom-0 right-0 bg-primary rounded-full p-2 border-4 border-background-light dark:border-background-dark shadow-lg active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-white text-sm">edit</span>
          </button>
        </div>
        <div className="text-center">
          <p className="text-[32px] font-black leading-tight tracking-tight">{pet.name}</p>
          <p className="text-[#9c8749] text-base font-bold">{pet.breed} 🐕</p>
          <div className="flex gap-2 justify-center mt-1">
            <span className="text-[10px] bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-full font-bold uppercase">{pet.age}</span>
            <span className="text-[10px] bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-full font-bold uppercase">{pet.weight}</span>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[22px] font-black tracking-tight uppercase text-sm text-gray-400">Nutrición</h2>
          <button onClick={handleOpenEdit} className="text-primary font-bold text-xs uppercase">Ajustar Dieta</button>
        </div>
        <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="size-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-500">
               <span className="material-symbols-outlined">restaurant</span>
            </div>
            <div>
               <p className="text-xs font-black text-gray-400 uppercase">Tipo de Comida</p>
               <p className="text-base font-bold leading-tight">{pet.foodType}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="size-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500">
               <span className="material-symbols-outlined">scale</span>
            </div>
            <div>
               <p className="text-xs font-black text-gray-400 uppercase">Dosis Alimenticia</p>
               <p className="text-base font-bold leading-tight">{pet.foodDosage}</p>
            </div>
          </div>
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat.name} className="px-4 mt-4 mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[22px] font-black tracking-tight uppercase text-sm text-gray-400">{cat.name}</h2>
            <button onClick={handleOpenEdit} className="text-primary font-bold text-xs">EDITAR REGISTROS</button>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-[2rem] shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-white/5 border border-gray-100 dark:border-white/10">
            {stats.filter(s => s.type === cat.type).map((stat) => (
              <div key={stat.id} className="flex items-center gap-4 px-5 min-h-[80px] py-4 justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center rounded-2xl shrink-0 size-12 shadow-inner ${stat.color ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-base font-black leading-tight group-hover:text-primary transition-colors">{stat.title}</p>
                    <p className={`text-[11px] font-bold mt-0.5 ${stat.color || 'text-[#9c8749]'}`}>{stat.status.toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={handleOpenEdit} className="flex size-10 items-center justify-center rounded-full bg-gray-50 dark:bg-white/10 active:scale-90 transition-all">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div 
          onPaste={handlePaste}
          className="fixed inset-0 z-[150] flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-0"
        >
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 h-[92vh] flex flex-col">
            <div className="flex items-center justify-between mb-6 shrink-0">
               <h3 className="text-2xl font-black tracking-tight">Editar Información</h3>
               <button onClick={() => setIsEditModalOpen(false)} className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 active:scale-90">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar pr-1 space-y-8 pb-10">
              {/* Sección Foto */}
              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-primary tracking-[0.2em]">Perfil Principal</p>
                <div className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-zinc-800">
                  <div 
                    className="size-24 rounded-3xl bg-center bg-cover bg-gray-200 border-2 border-primary"
                    style={{ backgroundImage: `url("${tempPet.imageUrl}")` }}
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] font-black text-black uppercase bg-primary px-6 py-3 rounded-2xl shadow-lg active:scale-95 transition-all"
                  >
                    Actualizar Foto
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-2">Nombre</p>
                    <input type="text" value={tempPet.name} onChange={(e) => setTempPet({...tempPet, name: e.target.value})} className="w-full h-14 bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-5 font-bold focus:ring-2 focus:ring-primary" />
                  </label>
                  <label className="block">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-2">Edad</p>
                    <input type="text" value={tempPet.age} onChange={(e) => setTempPet({...tempPet, age: e.target.value})} className="w-full h-14 bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-5 font-bold focus:ring-2 focus:ring-primary" />
                  </label>
                </div>
              </div>

              {/* Sección Nutrición */}
              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-primary tracking-[0.2em]">Plan Nutricional</p>
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-[2.5rem] space-y-4">
                  <label className="block">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-2">Tipo de Alimento</p>
                    <input type="text" value={tempPet.foodType} onChange={(e) => setTempPet({...tempPet, foodType: e.target.value})} className="w-full h-14 bg-white dark:bg-zinc-800 border-none rounded-2xl px-5 font-bold focus:ring-2 focus:ring-primary shadow-sm" />
                  </label>
                  <label className="block">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-2">Dosis Recomendada</p>
                    <input type="text" value={tempPet.foodDosage} onChange={(e) => setTempPet({...tempPet, foodDosage: e.target.value})} className="w-full h-14 bg-white dark:bg-zinc-800 border-none rounded-2xl px-5 font-bold focus:ring-2 focus:ring-primary shadow-sm" />
                  </label>
                </div>
              </div>

              {/* Sección de Registros Médicos e Higiene */}
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-4">
                  <p className="text-[11px] font-black uppercase text-primary tracking-[0.2em]">{cat.name}</p>
                  <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-[2.5rem] space-y-4">
                    {tempStats.filter(s => s.type === cat.type).map(stat => (
                      <label key={stat.id} className="block">
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">{stat.icon}</span>
                          {stat.title}
                        </p>
                        <input 
                          type="text" 
                          value={stat.status} 
                          onChange={(e) => handleUpdateStat(stat.id, e.target.value)} 
                          className="w-full h-14 bg-white dark:bg-zinc-800 border-none rounded-2xl px-5 font-bold focus:ring-2 focus:ring-primary shadow-sm"
                          placeholder="Ej: Al día, Próximo martes..."
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="shrink-0 pt-4 pb-8 flex gap-3">
               <button onClick={() => setIsEditModalOpen(false)} className="flex-1 h-16 bg-gray-100 dark:bg-white/10 rounded-2xl font-black text-gray-500 uppercase tracking-widest text-xs">
                 CANCELAR
               </button>
               <button onClick={handleSave} className="flex-[2] h-16 bg-primary text-black rounded-2xl font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-widest text-xs">
                 GUARDAR CAMBIOS
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthView;
