
import React, { useState, useEffect } from 'react';
import { MOCK_POSTS } from '../constants';
import { Post } from '../types';
import ChatView from './ChatView';

const CommunityView: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  
  // Estado para los posts con persistencia local
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('perri_community_posts');
      return saved ? JSON.parse(saved) : MOCK_POSTS;
    } catch {
      return MOCK_POSTS;
    }
  });

  // Estado para el nuevo post
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Travesuras');

  useEffect(() => {
    localStorage.setItem('perri_community_posts', JSON.stringify(posts));
  }, [posts]);

  const categories = [
    { name: 'Paseos', icon: 'directions_walk', color: 'bg-emerald-50 text-emerald-600', type: 'regular' as const },
    { name: 'Eventos', icon: 'groups', color: 'bg-blue-50 text-blue-600', type: 'event' as const },
    { name: 'Travesuras', icon: 'mood', color: 'bg-amber-50 text-amber-600', type: 'regular' as const },
    { name: 'Extraviados', icon: 'emergency_home', color: 'bg-red-50 text-red-600', type: 'lost' as const },
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const categoryObj = categories.find(c => c.name === newPostCategory);
    
    const newPost: Post = {
      id: `p-${Date.now()}`,
      author: 'Tú (Líder de Manada)',
      time: 'Recién',
      category: newPostCategory,
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      type: categoryObj ? categoryObj.type : 'regular',
      isLiked: false
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setIsNewPostModalOpen(false);
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked };
      }
      return p;
    }));
  };

  return (
    <div className="pb-32 min-h-screen bg-background-light dark:bg-background-dark">
      {/* HEADER DINÁMICO */}
      <header className="sticky top-0 z-[60] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center rotate-3">
             <span className="material-symbols-outlined text-black text-lg font-black">public</span>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Comunidad</h2>
        </div>
        <button 
          onClick={() => setIsNewPostModalOpen(true)}
          className="h-10 px-6 rounded-2xl bg-primary text-black font-black text-[10px] uppercase shadow-lg shadow-primary/20 active:scale-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm font-black">add</span>
          Nuevo Post
        </button>
      </header>

      <div className="px-4 py-6">
        {/* ACCESO RÁPIDO PERRI AI */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase text-gray-400 mb-3 px-1 tracking-widest">Asistente Virtual</p>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-full p-5 bg-zinc-900 dark:bg-white rounded-[2.5rem] flex items-center justify-between shadow-2xl active:scale-[0.98] transition-all group border-4 border-primary/10"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="size-12 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                <span className="material-symbols-outlined text-black font-black text-2xl">smart_toy</span>
              </div>
              <div>
                <p className="text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Perri AI Chat</p>
                <p className="text-white dark:text-black text-base font-black italic tracking-tight">¿Dudas con tu perrito?</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary font-black">arrow_forward</span>
          </button>
        </div>

        {/* FILTROS DE CATEGORÍA: GRID 2X2 ORDENADO */}
        <p className="text-[10px] font-black uppercase text-gray-400 mb-3 px-1 tracking-widest">Explorar Muro</p>
        <div className="grid grid-cols-2 gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilter(filter === cat.name ? 'Todos' : cat.name)}
              className={`flex items-center gap-3 p-4 rounded-[1.5rem] border-2 transition-all h-16 ${
                filter === cat.name 
                  ? 'bg-primary border-primary shadow-lg scale-[1.03] text-black' 
                  : 'bg-white dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800 text-gray-500'
              }`}
            >
              <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${cat.color} ${filter === cat.name ? 'bg-white/30 text-black' : ''}`}>
                <span className="material-symbols-outlined text-lg font-bold">{cat.icon}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight truncate">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* LISTADO DE POSTS */}
        <div className="flex items-center justify-between px-1 mb-6">
          <h3 className="text-xl font-black tracking-tighter italic">Tendencias de la manada</h3>
          {filter !== 'Todos' && (
            <button onClick={() => setFilter('Todos')} className="text-[10px] font-black text-primary uppercase underline tracking-widest">Ver todo</button>
          )}
        </div>

        <div className="space-y-6">
          {posts.filter(p => filter === 'Todos' || p.category === filter).map((post) => (
            <div key={post.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 animate-in slide-in-from-bottom duration-500">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-black text-xs text-primary">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="font-black text-sm leading-none">{post.author}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">@{post.category} • {post.time}</p>
                  </div>
                </div>
                <button className="text-gray-300"><span className="material-symbols-outlined">more_horiz</span></button>
              </div>
              
              <div className="px-6 pb-2">
                <p className="text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">{post.content}</p>
              </div>

              {post.imageUrl && (
                <div className="p-2">
                  <img src={post.imageUrl} className="w-full h-56 object-cover rounded-[2rem]" alt="Post" />
                </div>
              )}

              <div className="px-6 py-4 flex items-center gap-6">
                 <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-all active:scale-125 ${post.isLiked ? 'text-red-500' : 'text-gray-400'}`}
                 >
                   <span className={`material-symbols-outlined text-xl ${post.isLiked ? 'material-symbols-fill' : ''}`}>favorite</span>
                   <span className="text-xs font-black">{post.likes}</span>
                 </button>
                 <button className="flex items-center gap-1.5 text-gray-400">
                   <span className="material-symbols-outlined text-xl">chat_bubble</span>
                   <span className="text-xs font-black">{post.comments}</span>
                 </button>
                 <button className="flex items-center gap-1.5 text-gray-400 ml-auto">
                   <span className="material-symbols-outlined text-xl">share</span>
                 </button>
              </div>
            </div>
          ))}

          {posts.filter(p => filter === 'Todos' || p.category === filter).length === 0 && (
            <div className="py-24 text-center">
              <div className="size-20 bg-gray-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="material-symbols-outlined text-4xl text-gray-200">sentiment_dissatisfied</span>
              </div>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Aún no hay historias aquí</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL NUEVO POST: CORREGIDO Y ROBUSTO */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 backdrop-blur-md px-4 pb-0">
          <form 
            onSubmit={handleCreatePost}
            className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-8 shrink-0">
               <div>
                 <h3 className="text-2xl font-black tracking-tight italic">Compartir</h3>
                 <p className="text-[10px] font-black uppercase text-primary tracking-widest mt-1">Conecta con la manada</p>
               </div>
               <button 
                type="button"
                onClick={() => setIsNewPostModalOpen(false)} 
                className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 active:scale-90 transition-all"
               >
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>

            <div className="space-y-6 overflow-y-auto no-scrollbar pb-6 flex-1">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Elige una Categoría</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setNewPostCategory(cat.name)}
                      className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tight whitespace-nowrap transition-all border-2 ${
                        newPostCategory === cat.name 
                          ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20' 
                          : 'bg-gray-50 dark:bg-zinc-800 border-transparent text-gray-500'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Tu Historia</p>
                <textarea
                  autoFocus
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full h-44 bg-gray-50 dark:bg-zinc-800 border-none rounded-[2rem] p-6 text-sm font-bold focus:ring-2 focus:ring-primary shadow-inner resize-none text-gray-800 dark:text-white"
                  placeholder="¿Qué travesura hizo hoy tu mejor amigo?"
                />
              </div>
            </div>

            <div className="pt-4 pb-8 shrink-0">
               <button 
                type="submit"
                disabled={!newPostContent.trim()}
                className="w-full h-16 bg-primary text-black rounded-2xl font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-30 disabled:grayscale"
               >
                 Publicar ahora
               </button>
            </div>
          </form>
        </div>
      )}

      {/* CHAT OVERLAY (PERRI AI) */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md h-[94vh] bg-background-light dark:bg-background-dark rounded-t-[3.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500 flex flex-col">
            <div className="p-5 flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-black font-black">smart_toy</span>
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">Perri AI Chat</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">En línea</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative">
               <ChatView embedded={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityView;
