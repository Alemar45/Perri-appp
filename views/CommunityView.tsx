

import React, { useState, useEffect } from 'react';
import { MOCK_POSTS } from '../constants';
import { Post } from '../types';
import ChatView from './ChatView';

const CommunityView: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('perri_community_posts');
      return saved ? JSON.parse(saved) : MOCK_POSTS;
    } catch {
      return MOCK_POSTS;
    }
  });

  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Travesuras');

  useEffect(() => {
    localStorage.setItem('perri_community_posts', JSON.stringify(posts));
  }, [posts]);

  const categories = [
    { name: 'Paseos', icon: 'directions_walk', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Eventos', icon: 'groups', color: 'bg-blue-50 text-blue-600' },
    { name: 'Travesuras', icon: 'mood', color: 'bg-amber-50 text-amber-600' },
    { name: 'Extraviados', icon: 'emergency_home', color: 'bg-red-50 text-red-600' },
  ];

  const handleOpenNewPost = () => {
    setEditingPostId(null);
    setContent('');
    setCategory('Travesuras');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPostId(post.id);
    setContent(post.content);
    setCategory(post.category);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (editingPostId) {
      setPosts(prev => prev.map(p => p.id === editingPostId ? { ...p, content, category } : p));
    } else {
      const newPost: Post = {
        id: `p-${Date.now()}`,
        author: 'Tú',
        time: 'Recién',
        category: category,
        content: content,
        likes: 0,
        comments: 0,
        shares: 0,
        type: 'regular',
        isLiked: false
      };
      setPosts(prev => [newPost, ...prev]);
    }
    setIsModalOpen(false);
    setContent('');
    setEditingPostId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta historia?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="pb-40 min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* HEADER SIMPLIFICADO */}
      <header className="sticky top-0 z-[60] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
             <span className="material-symbols-outlined text-black text-xl font-black">public</span>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic leading-none">Comunidad</h2>
            <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">Tu Manada Online</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* ÁREA DE COMPOSICIÓN (REEMPLAZA AL BOTÓN NUEVO POST) */}
        <div className="mb-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-4 shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
             <span className="material-symbols-outlined font-black">edit_note</span>
          </div>
          <button 
            onClick={handleOpenNewPost}
            className="flex-1 text-left h-12 px-6 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-400 font-bold text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          >
            ¿Qué está pasando con tu perrito?
          </button>
        </div>

        {/* BANNER PERRI AI - MEJORADO */}
        <div className="mb-8">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-full relative overflow-hidden bg-zinc-900 dark:bg-white p-5 rounded-[2.5rem] shadow-2xl active:scale-[0.98] transition-all group border-b-8 border-primary/30"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4 text-left">
                <div className="size-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                  <span className="material-symbols-outlined text-black font-black text-2xl">smart_toy</span>
                </div>
                <div>
                  <p className="text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Asistente Virtual</p>
                  <p className="text-white dark:text-black text-lg font-black italic tracking-tight leading-none">Chat de la Comunidad</p>
                </div>
              </div>
              <div className="size-10 rounded-full bg-white/10 dark:bg-black/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary font-black">chat</span>
              </div>
            </div>
          </button>
        </div>

        {/* CATEGORÍAS - GRID ORDENADO 2x2 */}
        <p className="text-[10px] font-black uppercase text-gray-400 mb-4 px-1 tracking-widest">Filtrar por interés</p>
        <div className="grid grid-cols-2 gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilter(filter === cat.name ? 'Todos' : cat.name)}
              className={`flex items-center gap-3 p-4 rounded-3xl border-2 transition-all h-16 ${
                filter === cat.name 
                  ? 'bg-primary border-primary shadow-lg scale-[1.03] text-black' 
                  : 'bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-800 text-gray-500'
              }`}
            >
              <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${cat.color} ${filter === cat.name ? 'bg-white/40 text-black' : ''}`}>
                <span className="material-symbols-outlined text-lg font-bold">{cat.icon}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight truncate">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* FEED DE HISTORIAS */}
        <div className="flex items-center justify-between px-1 mb-6">
          <h3 className="text-2xl font-black tracking-tighter italic">Novedades</h3>
          {filter !== 'Todos' && (
            <button onClick={() => setFilter('Todos')} className="text-[10px] font-black text-primary uppercase underline">Ver todo</button>
          )}
        </div>

        <div className="space-y-6">
          {posts.filter(p => filter === 'Todos' || p.category === filter).map((post) => (
            <div key={post.id} className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 transition-all hover:shadow-md">
              {/* BOTÓN DE EDICIÓN EN CADA POST (LÁPIZ) */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => handleOpenEdit(post)}
                  className="size-10 rounded-full bg-gray-50/80 dark:bg-zinc-800/80 backdrop-blur-md text-gray-400 flex items-center justify-center hover:bg-primary hover:text-black transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg font-black">edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="size-10 rounded-full bg-gray-50/80 dark:bg-zinc-800/80 backdrop-blur-md text-gray-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg font-black">delete</span>
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-black text-xs text-primary">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="font-black text-sm leading-none">{post.author}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">#{post.category} • {post.time}</p>
                  </div>
                </div>
                
                <p className="text-[15px] font-medium leading-relaxed text-gray-700 dark:text-gray-300 italic mb-4 pr-12">
                  "{post.content}"
                </p>

                {post.imageUrl && (
                  <img src={post.imageUrl} className="w-full h-56 object-cover rounded-[2rem] shadow-sm mb-4" alt="Post" />
                )}

                <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-zinc-800">
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

      {/* MODAL DE COMPOSICIÓN / EDICIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-md px-4 pb-0">
          <form 
            onSubmit={handleSubmit}
            className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-t-[3.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[92vh]"
          >
            <div className="flex items-center justify-between mb-8 shrink-0">
               <h3 className="text-3xl font-black tracking-tighter italic">
                 {editingPostId ? 'Modificar Historia' : 'Crear Historia'}
               </h3>
               <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="size-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 active:scale-90 transition-all"
               >
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>

            <div className="space-y-8 overflow-y-auto no-scrollbar pb-8 flex-1">
              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-gray-400 ml-3 tracking-widest">Etiqueta de grupo</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-tight whitespace-nowrap transition-all border-2 ${
                        category === cat.name 
                          ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20' 
                          : 'bg-gray-50 dark:bg-zinc-800 border-transparent text-gray-500'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-gray-400 ml-3 tracking-widest">Tu Mensaje</p>
                <textarea
                  autoFocus
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-44 bg-gray-50 dark:bg-zinc-800 border-none rounded-[2.5rem] p-8 text-base font-bold focus:ring-4 focus:ring-primary/20 shadow-inner resize-none text-gray-800 dark:text-white"
                  placeholder="¡Escribe aquí para la manada! 🐾"
                />
              </div>
            </div>

            <div className="pt-6 pb-12 shrink-0">
               <button 
                type="submit"
                className="w-full h-18 bg-primary text-black rounded-[2rem] font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 py-6"
               >
                 {editingPostId ? 'Guardar Cambios' : 'Publicar Ahora'}
                 <span className="material-symbols-outlined font-black text-xl">send</span>
               </button>
            </div>
          </form>
        </div>
      )}

      {/* CHAT AI BOTTOM SHEET */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md h-[95vh] bg-background-light dark:bg-background-dark rounded-t-[4rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500 flex flex-col">
            <div className="p-6 flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-black font-black">smart_toy</span>
                </div>
                <div>
                  <h3 className="font-black text-base uppercase tracking-tight">Chat de la Manada</h3>
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">IA Conectada</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="size-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-all"
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
