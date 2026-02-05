
import React, { useState, useEffect, useCallback } from 'react';
import { VET_CLINICS as INITIAL_VETS } from '../constants';
import { VetClinic } from '../types';
import { getVetsByZone } from '../geminiService';

const VetsView: React.FC = () => {
  const [view, setView] = useState<'List' | 'Map'>('List');
  const [searchTerm, setSearchTerm] = useState('');
  const [clinics, setClinics] = useState<VetClinic[]>(INITIAL_VETS);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Buenos Aires');
  const [filter24h, setFilter24h] = useState(false);

  const performSearch = useCallback(async (term: string, lat?: number, lng?: number) => {
    setIsLoading(true);
    try {
      const results = await getVetsByZone(term, lat, lng);
      if (results && results.length > 0) {
        setClinics(results);
        setCurrentLocation(term === 'cerca de mi ubicación' ? 'Tu ubicación actual' : term);
      }
    } catch (err) {
      console.error("Error en búsqueda:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Búsqueda inicial por geolocalización
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => performSearch('cerca de mi ubicación', pos.coords.latitude, pos.coords.longitude),
        () => performSearch('Buenos Aires')
      );
    } else {
      performSearch('Buenos Aires');
    }
  }, [performSearch]);

  const handleManualSearch = () => {
    if (!searchTerm.trim()) return;
    performSearch(searchTerm);
  };

  const filteredClinics = filter24h 
    ? clinics.filter(v => v.is24h) 
    : clinics;

  const mapUrl = `https://www.google.com/maps?q=veterinarias+en+${encodeURIComponent(currentLocation)}&output=embed`;

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 border-b border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-black text-xl font-black">local_hospital</span>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight italic">Centro Veterinario</h2>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest -mt-1">Zona: {currentLocation}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
              className="w-full h-14 bg-gray-100 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary transition-all pr-12"
              placeholder="Cambiar región (ej: Madrid, Palermo...)"
            />
            {isLoading && (
              <div className="absolute right-4 top-4.5 size-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <button 
            onClick={handleManualSearch}
            disabled={isLoading}
            className="size-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined font-black text-black">search</span>
          </button>
        </div>

        {/* FILTROS RÁPIDOS */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => setFilter24h(!filter24h)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-2 border-2 ${
              filter24h ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 text-gray-500'
            }`}
          >
            <span className="material-symbols-outlined text-sm">emergency</span>
            Solo 24 Horas
          </button>
          
          <div className="h-9 w-[1px] bg-gray-100 dark:bg-zinc-800 mx-1 self-center"></div>

          <button 
            onClick={() => setView('List')}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${view === 'List' ? 'bg-zinc-900 text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'}`}
          >
            Lista
          </button>
          <button 
            onClick={() => setView('Map')}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${view === 'Map' ? 'bg-zinc-900 text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'}`}
          >
            Mapa
          </button>
        </div>
      </header>

      {view === 'List' ? (
        <div className="p-4 space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
               <span className="material-symbols-outlined text-6xl text-primary">pet_supplies</span>
               <p className="text-[10px] font-black uppercase text-gray-400 mt-4 tracking-widest">Escaneando zona...</p>
            </div>
          )}
          
          {!isLoading && filteredClinics.map((vet, idx) => (
            <div 
              key={vet.id} 
              className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-zinc-800 relative overflow-hidden animate-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {vet.is24h && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-4 py-1.5 uppercase rounded-bl-2xl shadow-sm">
                  ABIERTO 24H 🚑
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="font-black text-xl leading-tight pr-10">{vet.name}</h3>
                <div className="flex items-center gap-1 mt-1.5">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={`material-symbols-outlined text-[10px] ${s <= Math.round(vet.rating) ? 'text-primary material-symbols-fill' : 'text-gray-200'}`}>star</span>
                    ))}
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${vet.is24h ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {vet.closingTime || 'Cierra 20:00'}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mb-6 font-medium">
                <span className="material-symbols-outlined text-[16px] align-middle mr-1 text-primary">location_on</span>
                {vet.address}
              </p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => { setCurrentLocation(vet.name + " " + vet.address); setView('Map'); }}
                  className="flex-1 h-12 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase shadow-md active:scale-95 transition-all"
                >
                  Ver en el Mapa
                </button>
                <a 
                  href={`tel:${vet.phone}`} 
                  className="size-12 bg-primary text-black rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined font-black">call</span>
                </a>
              </div>
            </div>
          ))}

          {!isLoading && filteredClinics.length === 0 && (
            <div className="text-center py-20 px-10">
               <span className="material-symbols-outlined text-5xl text-gray-200">fmd_bad</span>
               <p className="text-xs font-black text-gray-400 uppercase mt-4">No hay resultados con estos filtros en {currentLocation}.</p>
               <button onClick={() => {setFilter24h(false); performSearch('Buenos Aires');}} className="mt-4 text-primary font-black text-[10px] uppercase underline">Resetear búsqueda</button>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-250px)] w-full overflow-hidden animate-in zoom-in duration-500 relative">
          <iframe 
            width="100%" height="100%" frameBorder="0" 
            src={mapUrl} title="Mapa"
            className="grayscale-[0.2] contrast-[1.1] dark:invert dark:hue-rotate-180"
            loading="lazy"
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-10">
            <button 
              onClick={() => setView('List')}
              className="w-full h-14 bg-zinc-900 text-white rounded-full font-black text-xs uppercase shadow-2xl border-2 border-primary active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">format_list_bulleted</span>
              Volver a la lista
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VetsView;
