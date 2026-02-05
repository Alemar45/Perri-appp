
import React, { useState } from 'react';
import { MOCK_POSTS } from '../constants';
import { Post } from '../types';
import { useNavigate } from 'react-router-dom';

const CommunityView: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const [posts] = useState<Post[]>(MOCK_POSTS);
  const navigate = useNavigate();

  const categories = [
    { name: 'Paseos', icon: 'directions_walk', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' },
    { name: 'Eventos', icon: 'groups', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' },
    { name: 'Travesuras', icon: 'mood', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' },
    { name: 'Extraviados', icon: 'emergency_home', color: 'bg-red-50 text-red-600 dark:bg-red-900/20' },
  ];

  return (
    <div className="pb-32 min-h-screen bg-[#fcfbf8] dark:bg-[#121212] animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Comunidad</h2>
        </div>
        <button className="h-10 px-4 rounded-full bg-primary text-black font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">
          Nuevo Post
        </button>
      </header>

      <div className="px-4 py-6">
        {/* GRID 2x2 PERFECTO - Los botones no se mueven de la pantalla */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilter(cat.name)}
              className={`flex flex-col items-center justify-center aspect-square rounded-[2rem] border-2 transition-all duration-300 ${
                filter === cat.name 
                  ? 'bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.02]' 
                  : 'bg-white dark:bg-zinc-800 border-gray-50 dark:border-zinc-800'
              }`}
            >
              <div className={`size-12 rounded-2xl flex items-center justify-center mb-2 ${cat.color}`}>
                <span className="material-symbols-outlined text-2xl font-bold">{cat.icon}</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${filter === cat.name ? 'text-black' : 'text-gray-400'}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* BOTÓN DE CHAT INTEGRADO EN PESTAÑA COMUNIDAD */}
        <button 
          onClick={() => navigate('/chat')}
          className="w-full p-5 bg-black dark:bg-white rounded-[2rem] flex items-center justify-between shadow-2xl active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="size-12 bg-primary rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
              <span className="material-symbols-outlined text-black font-black">smart_toy</span>
            </div>
            <div className="text-left">
              <p className="text-white dark:text-black text-[11px] font-black uppercase tracking-tight">¿Dudas sobre tu perro?</p>
              <p className="text-primary text-[9px] font-black uppercase">Chat con Perri AI</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary font-black">arrow_forward_ios</span>
        </button>
      </div>

      <div className="px-4 space-y-6">
        {posts.filter(p => filter === 'Todos' || p.category === filter).map((post) => (
          <div key={post.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 dark:border-zinc-800">
            <div className="p-5 flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-xs text-primary">
                {post.author[0]}
              </div>
              <div className="flex-1">
                <p className="font-black text-sm">{post.author}</p>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-black text-primary uppercase">{post.category}</span>
                   <span className="text-[9px] font-bold text-gray-400 uppercase">{post.time}</span>
                </div>
              </div>
            </div>
            {post.imageUrl && (
              <div className="px-4">
                <img src={post.imageUrl} className="w-full h-56 object-cover rounded-[2rem]" alt="Post" />
              </div>
            )}
            <div className="p-6">
              <p className="text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">{post.content}</p>
              <div className="mt-6 pt-4 border-t border-gray-50 dark:border-zinc-800 flex items-center gap-6">
                 <button className="flex items-center gap-2 text-gray-400">
                   <span className="material-symbols-outlined text-xl">favorite</span>
                   <span className="text-xs font-black">{post.likes}</span>
                 </button>
                 <button className="flex items-center gap-2 text-gray-400">
                   <span className="material-symbols-outlined text-xl">chat_bubble</span>
                   <span className="text-xs font-black">{post.comments}</span>
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityView;
