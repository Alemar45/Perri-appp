import React, { useState, useEffect, useCallback } from 'react';
import { VET_CLINICS as INITIAL_VETS } from '../constants';
import { VetClinic } from '../types';
import { getVetsByZone } from '../geminiService';

const VetsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clinics, setClinics] = useState<VetClinic[]>(INITIAL_VETS);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Buenos Aires');
  const [filter24h, setFilter24h] = useState(false);

  const performSearch = useCallback(async (term: string, lat?: number, lng?: number) => {
    if (!term && !lat) return;
    setIsLoading(true);
    try {
      const results = await getVetsByZone(term || "veterinarias", lat, lng);
      if (results && results.length > 0) {
        setClinics(results);
        setCurrentLocation(lat && lng ? 'Mi Ubicación Actual' : term);
      }
    } catch (err) {
      console.error("Error en búsqueda:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => performSearch("", pos.coords.latitude, pos.coords.longitude),
      (error) => {
        console.error(error);
        setIsLoading(false);
        alert("No pudimos acceder a tu ubicación. Prueba buscando manualmente.");
      }
    );
  };

  useEffect(() => {
    // Carga inicial sugerida
    if (clinics.length <= 2) {
      performSearch('Buenos Aires');
    }
  }, [performSearch]);

  const displayClinics = filter24h 
    ? clinics.filter(v => v.is24h) 
    : clinics;

  return (
    <div className="pb-32 min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header Estilizado */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-6 border-b border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-3">
            <span className="material-symbols-outlined text-black text-2xl font-black">local_hospital</span>
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Vets Radar</h2>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">
              {isLoading ? 'Escaneando zona...' : `Cerca de: ${currentLocation}`}
            </p>
          </div>
        </div>
        
        {/* Barra de búsqueda y filtros */}
        <div className="flex gap-3">
          <button 
            onClick={handleGeoLocation} 
            disabled={isLoading}
            className="size-14 bg-white dark:bg-zinc-800 border-2 border-primary/20 rounded-[1.25rem] flex items-center justify-center text-primary shadow-sm active:scale-95 transition-all disabled:opacity-50"
            title="Usar mi ubicación"
          >
            <span className="material-symbols-outlined font-black">my_location</span>
          </button>
          <div className="relative flex-1">
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch(searchTerm)}
              className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-[1.25rem] px-6 text-sm font-bold shadow-inner outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
              placeholder="Ej: Palermo, Madrid..."
            />
            <button 
              onClick={() => performSearch(searchTerm)}
              className="absolute right-2 top-2 size-10 bg-primary text-black rounded-xl flex items-center justify-center shadow-md active:scale-90"
            >
              <span className="material-symbols-outlined font-black">search</span>
            </button>
          </div>
          <button 
            onClick={() => setFilter24h(!filter24h)}
            className={`size-14 rounded-[1.25rem] flex items-center justify-center border-2 transition-all active:scale-95 ${
              filter24h 
                ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' 
                : 'bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 text-gray-400'
            }`}
          >
            <span className="material-symbols-outlined font-black">emergency</span>
          </button>
        </div>
      </header>

      {/* Lista de Resultados */}
      <div className="p-6 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] text-center">
              La IA está rastreando <br/>las mejores clínicas...
            </p>
          </div>
        ) : displayClinics.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-zinc-800 mb-4">sentiment_dissatisfied</span>
            <p className="text-gray-400 font-bold text-sm italic">No encontramos clínicas en esta zona.</p>
          </div>
        ) : (
          <div className="grid gap-4 animate-in fade-in duration-500">
            {displayClinics.map((vet) => (
              <div key={vet.id} className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-zinc-800 group hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-black text-xl leading-tight group-hover:text-primary transition-colors">{vet.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-amber-400 text-sm material-symbols-fill">star</span>
                      <span className="text-[10px] font-black">{vet.rating || '4.5'}</span>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black px-3 py-1.5 rounded-full uppercase shrink-0 tracking-tighter ${vet.is24h ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {vet.is24h ? 'Abierto 24hs' : 'Horario Normal'}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 flex items-start gap-1">
                  <span className="material-symbols-outlined text-sm shrink-0">location_on</span>
                  {vet.address}
                </p>

                <div className="flex gap-2">
                  <a 
                    href={`tel:${vet.phone}`} 
                    className="flex-1 h-12 bg-primary text-black rounded-xl flex items-center justify-center font-black text-[10px] uppercase shadow-md active:scale-95 transition-all gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
                    Llamar ahora
                  </a>
                  <button className="size-12 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 rounded-xl flex items-center justify-center active:scale-95 hover:bg-primary/10 hover:text-primary transition-all">
                    <span className="material-symbols-outlined">directions</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nota de pie */}
      <p className="text-center text-[9px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mt-8 px-12 leading-relaxed">
        Datos actualizados mediante IA y Google Maps Radar. <br/> Confirma siempre por teléfono antes de asistir.
      </p>
    </div>
  );
};

export default VetsView;
