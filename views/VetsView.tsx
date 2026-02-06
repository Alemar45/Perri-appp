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
        const locationName = lat && lng ? `${lat},${lng}` : term;
        setCurrentLocation(locationName);
      }
    } catch (err) {
      console.error("Error en búsqueda:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }
    
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        performSearch("clínicas veterinarias cercanas", position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        setIsLoading(false);
        alert("No pudimos obtener tu ubicación actual. Asegúrate de dar permisos.");
      }
    );
  };

  useEffect(() => {
    if (clinics.length <= 2) {
      performSearch('Buenos Aires');
    }
  }, [performSearch]);

  const handleManualSearch = () => {
    if (!searchTerm.trim()) return;
    performSearch(searchTerm);
  };

  const displayClinics = filter24h 
    ? clinics.filter(v => v.is24h) 
    : clinics;

  const mapUrl = `https://www.google.com/maps?q=veterinarias+en+${encodeURIComponent(currentLocation)}&output=embed&z=15`;

  return (
    <div className="pb-32 min-h-screen bg-background-light dark:bg-background-dark animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-6 border-b border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-3">
              <span className="material-symbols-outlined text-black text-2xl font-black">local_hospital</span>
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Vets Radar</h2>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">
                {isLoading ? 'Rastreando...' : `Zona: ${currentLocation.length > 20 ? 'Mi Ubicación' : currentLocation}`}
              </p>
            </div>
          </div>
          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-2xl">
            <button onClick={() => setView('List')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === 'List' ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm' : 'text-gray-400'}`}>Lista</button>
            <button onClick={() => setView('Map')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === 'Map' ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm' : 'text-gray-400'}`}>Mapa</button>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleGeoLocation}
            className="size-14 bg-white dark:bg-zinc-800 border-2 border-primary/20 rounded-[1.25rem] flex items-center justify-center text-primary active:scale-90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined font-black">my_location</span>
          </button>
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
              className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-[1.25rem] pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-primary transition-all shadow-inner"
              placeholder="Buscar ciudad o barrio..."
            />
          </div>
          <button 
            onClick={() => setFilter24h(!filter24h)}
            className={`size-14 rounded-[1.25rem] flex items-center justify-center transition-all border-2 ${filter24h ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 text-gray-400'}`}
          >
            <span className="material-symbols-outlined font-black">emergency</span>
          </button>
        </div>
      </header>

      {view === 'List' ? (
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
               <div className="size-20 border-t-4 border-primary rounded-full animate-spin mb-8"></div>
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Buscando especialistas...</p>
            </div>
          ) : displayClinics.length === 0 ? (
            <div className="text-center py-20">
               <span className="material-symbols-outlined text-6xl text-gray-200">error</span>
               <p className="mt-4 font-bold text-gray-400">No encontramos resultados en esta zona.</p>
            </div>
          ) : (
            displayClinics.map((vet) => (
              <div 
                key={vet.id} 
                className="group bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-zinc-800 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-black text-xl leading-tight group-hover:text-primary transition-colors">{vet.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                       <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${vet.is24h ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                         {vet.is24h ? 'URGENCIAS 24H' : 'HORARIO REGULAR'}
                       </span>
                       <span className="text-[8px] font-black bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-full uppercase tracking-widest text-gray-500">
                         {vet.rating} ⭐
                       </span>
                    </div>
                  </div>
                  <div className="size-14 bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-2xl font-black">medical_services</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 font-medium mb-6 flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm shrink-0">location_on</span>
                  {vet.address}
                </p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setView('Map'); setCurrentLocation(`${vet.name}, ${vet.address}`); }}
                    className="flex-1 h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase shadow-md active:scale-95 transition-all"
                  >
                    Ver ubicación
                  </button>
                  <a href={`tel:${vet.phone}`} className="size-14 bg-primary text-black rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
                    <span className="material-symbols-outlined font-black">call</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-320px)] w-full relative">
          <iframe 
            width="100%" height="100%" frameBorder="0" 
            src={mapUrl} title="Mapa Interactivo de Veterinarias"
            className="dark:invert dark:contrast-125 dark:hue-rotate-180 transition-all"
            allowFullScreen
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            <button 
              onClick={() => setView('List')}
              className="px-8 h-14 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-full font-black text-[10px] uppercase shadow-2xl active:scale-95 transition-all flex items-center gap-2 border border-gray-100 dark:border-zinc-800"
            >
              <span className="material-symbols-outlined">list</span>
              Lista
            </button>
            <button 
              onClick={handleGeoLocation}
              className="px-8 h-14 bg-primary text-black rounded-full font-black text-[10px] uppercase shadow-2xl active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">radar</span>
              Recargar Radar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VetsView;
