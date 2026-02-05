
import React, { useState } from 'react';
import { VET_CLINICS as INITIAL_VETS } from '../constants';
import { VetClinic } from '../types';
import { getVetsByZone } from '../geminiService';

const VetsView: React.FC = () => {
  const [view, setView] = useState<'List' | 'Map'>('List');
  const [searchTerm, setSearchTerm] = useState('');
  const [clinics, setClinics] = useState<VetClinic[]>(INITIAL_VETS);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setView('List');
    const results = await getVetsByZone(searchTerm);
    if (results && results.length > 0) {
      setClinics(results);
    }
    setIsLoading(false);
  };

  // URL de mapa real usando Google Maps Embed
  const mapUrl = `https://www.google.com/maps/embed/v1/search?key=${process.env.API_KEY || ''}&q=veterinarias+en+${encodeURIComponent(searchTerm || 'Argentina')}`;
  
  // URL de respaldo si no hay API Key de Google (usando el buscador público)
  const publicMapUrl = `https://maps.google.com/maps?q=veterinarias+en+${encodeURIComponent(searchTerm || 'Argentina')}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="pb-24 min-h-screen bg-[#fcfbf8] dark:bg-[#121212] animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">local_hospital</span>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight italic">Veterinarias</h2>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full h-12 bg-gray-100 dark:bg-zinc-800 border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
              placeholder="Ej: Palermo, Rosario..."
            />
          </div>
          <button 
            onClick={handleSearch}
            className="size-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined font-black text-black">search</span>
          </button>
        </div>
        
        <div className="flex h-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl mt-4 p-1.5">
          <button 
            onClick={() => setView('List')} 
            className={`flex-1 rounded-xl text-[10px] font-black uppercase transition-all ${view === 'List' ? 'bg-white dark:bg-zinc-700 shadow-md text-primary' : 'text-gray-400'}`}
          >
            Lista
          </button>
          <button 
            onClick={() => setView('Map')} 
            className={`flex-1 rounded-xl text-[10px] font-black uppercase transition-all ${view === 'Map' ? 'bg-white dark:bg-zinc-700 shadow-md text-primary' : 'text-gray-400'}`}
          >
            Mapa Real
          </button>
        </div>
      </header>

      {view === 'List' ? (
        <div className="p-4 space-y-4">
          {clinics.map(vet => (
            <div key={vet.id} className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-zinc-800 group animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-black text-lg">{vet.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-xs text-primary material-symbols-fill">star</span>
                    <span className="text-xs font-bold">{vet.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 italic line-clamp-1">{vet.address}</p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => { setSearchTerm(vet.name); setView('Map'); }}
                  className="flex-1 h-12 bg-primary text-black rounded-xl font-black text-[10px] uppercase shadow-md active:scale-95 transition-all"
                >
                  Ver en Mapa
                </button>
                <a href={`tel:${vet.phone}`} className="size-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined font-black">call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[calc(100vh-260px)] w-full overflow-hidden animate-in zoom-in duration-700">
           <iframe 
            width="100%" height="100%" frameBorder="0" 
            src={publicMapUrl} title="Mapa"
            className="contrast-[1.1] grayscale-[0.1]"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default VetsView;
