
import React, { useState } from 'react';
import { MOCK_POSTS } from '../constants';
import { Post } from '../types';
import ChatView from './ChatView';

const CommunityView: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [posts] = useState<Post[]>(MOCK_POSTS);

  const categories = [
    { name: 'Paseos', icon: 'directions_walk', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Eventos', icon: 'groups', color: 'bg-blue-50 text-blue-600' },
    { name: 'Travesuras', icon: 'mood', color: 'bg-amber-50 text-amber-600' },
    { name: 'Extraviados', icon: 'emergency_home', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="pb-32 min-h-screen bg-background-light dark:bg-background-dark animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Comunidad</h2>
        </div>
        <button className="h-10 px-5 rounded-full bg-primary text-black font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">
          Nuevo Post
        </button>
      </header>

      <div className="px-4 py-6">
        {/* BOTÓN PERRI AI MEJORADO */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase text-gray-400 mb-3 px-1 tracking-widest">¿Dudas con tu perrito?</p>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-full p-6 bg-zinc-900 dark:bg-white rounded-[2.5rem] flex items-center justify-between shadow-2xl active:scale-[0.98] transition-all group border-4 border-primary/20"
          >
            <div className="flex items-center gap-4">
              <div className="size-14 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-xl shadow-primary/20">
                <span className="material-symbols-outlined text-black font-black text-3xl">smart_toy</span>
              </div>
              <div className="text-left">
                <p className="text-primary text-[10px] font-black uppercase tracking-widest leading-none mb-1">Perri AI Chat</p>
                <p className="text-white dark:text-black text-lg font-black leading-tight">Consultar ahora</p>
              </div>
            </div>
            <div className="size-10 rounded-full bg-white/10 dark:bg-black/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary font-black">arrow_forward_ios</span>
            </div>
          </button>
        </div>

        {/* CATEGORÍAS EN GRID PERFECTO 2x2 */}
        <p className="text-[10px] font-black uppercase text-gray-400 mb-3 px-1 tracking-widest">Categorías del muro</p>
        <div className="grid grid-cols-2 gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilter(filter === cat.name ? 'Todos' : cat.name)}
              className={`flex flex-col items-center justify-center gap-2 p-5 rounded-[2.5rem] border-2 transition-all duration-300 h-28 ${
                filter === cat.name 
                  ? 'bg-primary border-primary shadow-xl scale-[1.02]' 
                  : 'bg-white dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800'
              }`}
            >
              <div className={`size-10 rounded-xl flex items-center justify-center ${cat.color} ${filter === cat.name ? 'bg-white/40 text-black' : ''}`}>
                <span className="material-symbols-outlined text-xl font-bold">{cat.icon}</span>
              </div>
              <span className={`text-[11px] font-black uppercase tracking-tight ${filter === cat.name ? 'text-black' : 'text-gray-500'}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-1 mb-6">
          <h3 className="text-[22px] font-black tracking-tighter italic">Historias de hoy</h3>
          {filter !== 'Todos' && (
            <button onClick={() => setFilter('Todos')} className="text-[10px] font-black text-primary uppercase underline">Ver todo</button>
          )}
        </div>

        <div className="space-y-6">
          {posts.filter(p => filter === 'Todos' || p.category === filter).map((post) => (
            <div key={post.id} className="bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden shadow-sm border border-gray-50 dark:border-zinc-800 animate-in slide-in-from-bottom duration-500">
              <div className="p-5 flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-xs text-primary border border-primary/10">
                  {post.author[0]}
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm">{post.author}</p>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black text-primary uppercase">{post.category}</span>
                     <span className="text-[9px] text-gray-400 font-bold">• {post.time}</span>
                  </div>
                </div>
              </div>
              {post.imageUrl && (
                <div className="px-4">
                  <img src={post.imageUrl} className="w-full h-52 object-cover rounded-[2.5rem]" alt="Post" />
                </div>
              )}
              <div className="p-6">
                <p className="text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">{post.content}</p>
                <div className="mt-6 pt-4 border-t border-gray-50 dark:border-zinc-800 flex items-center gap-6">
                   <button className="flex items-center gap-2 text-gray-400 group">
                     <span className="material-symbols-outlined text-xl group-active:scale-125 transition-transform">favorite</span>
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

      {/* CHAT OVERLAY (BOTTOM SHEET) */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md h-[92vh] bg-background-light dark:bg-background-dark rounded-t-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500 flex flex-col">
            <div className="p-4 flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-black font-black">smart_toy</span>
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase">Perri AI Asistente</h3>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Activo ahora</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
               <ChatView embedded={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityView;
