
import React, { useState, useEffect } from 'react';
import { MOCK_POSTS } from '../constants';
import { Post } from '../types';
import ChatView from './ChatView';

const CommunityView: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  // Estado para los posts con persistencia local
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('perri_community_posts');
      return saved ? JSON.parse(saved) : MOCK_POSTS;
    } catch {
      return MOCK_POSTS;
    }
  });

  // Estado para el contenido del modal
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Travesuras');

  useEffect(() => {
    localStorage.setItem('perri_community_posts', JSON.stringify(posts));
  }, [posts]);

  const categories = [
    { name: 'Paseos', icon: 'directions_walk', color: 'bg-emerald-50 text-emerald-600', type: 'regular' as const },
    { name: 'Eventos', icon: 'groups', color: 'bg-blue-50 text-blue-600', type: 'event' as const },
    { name: 'Travesuras', icon: 'mood', color: 'bg-amber-50 text-amber-600', type: 'regular' as const },
    { name: 'Extraviados', icon: 'emergency_home', color: 'bg-red-50 text-red-600', type: 'lost' as const },
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
      // Editar existente
      setPosts(prev => prev.map(p => {
        if (p.id === editingPostId) {
          return { ...p, content, category };
        }
        return p;
      }));
    } else {
      // Crear nuevo
      const categoryObj = categories.find(c => c.name === category);
      const newPost: Post = {
        id: `p-${Date.now()}`,
        author: 'Tú',
        time: 'Recién',
        category: category,
        content: content,
        likes: 0,
        comments: 0,
        shares: 0,
        type: categoryObj ? categoryObj.type : 'regular',
        isLiked: false
      };
      setPosts(prev => [newPost, ...prev]);
    }

    setIsModalOpen(false);
    setContent('');
    setEditingPostId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Seguro que quieres borrar esta historia?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
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
    <div className="pb-40 min-h-screen bg-background-light dark:bg-background-dark">
      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-[60] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center rotate-6 shadow-lg shadow-primary/20">
             <span className="material-symbols-outlined text-black text-xl font-black">public</span>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic leading-none">Comunidad</h2>
            <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">La manada unida</p>
          </div>
        </div>
        <button 
          onClick={handleOpenNewPost}
          className="h-11 px-5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-[10px] uppercase shadow-xl active:scale-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm font-black">add_circle</span>
          Publicar
        </button>
      </header>

      <div className="px-4 py-6">
        {/* ASISTENTE AI - DISEÑO TIPO CARD DE CONTROL */}
        <div className="mb-10">
          <p className="text-[10px] font-black uppercase text-gray-400 mb-4 px-1 tracking-widest">¿Necesitas ayuda experta?</p>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-full relative group overflow-hidden bg-zinc-900 dark:bg-white p-6 rounded-[2.5rem] shadow-2xl active:scale-[0.98] transition-all border-b-8 border-primary/30"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-8xl font-black text-white dark:text-black">smart_toy</span>
            </div>
            <div className="relative z-10 flex items-center gap-5">
              <div className="size-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
                <span className="material-symbols-outlined text-black font-black text-3xl">chat_bubble</span>
              </div>
              <div className="text-left">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Perri AI Chat 2.5</p>
                <h4 className="text-white dark:text-black text-xl font-black tracking-tight italic">Consultar al Asistente</h4>
              </div>
            </div>
          </button>
        </div>

        {/* EXPLORAR CATEGORÍAS - GRID COMPACTO Y ORDENADO */}
        <p className="text-[10px] font-black uppercase text-gray-400 mb-4 px-1 tracking-widest">Filtrar Historias</p>
        <div className="grid grid-cols-2 gap-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilter(filter === cat.name ? 'Todos' : cat.name)}
              className={`flex items-center gap-3 p-4 rounded-[1.8rem] border-2 transition-all duration-300 h-16 ${
                filter === cat.name 
                  ? 'bg-primary border-primary shadow-xl scale-[1.05] text-black' 
                  : 'bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-800 text-gray-500'
              }`}
            >
              <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${cat.color} ${filter === cat.name ? 'bg-white/40 text-black' : ''}`}>
                <span className="material-symbols-outlined text-xl font-bold">{cat.icon}</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-tighter truncate">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* LISTADO DE POSTS CON OPCIONES DE EDICIÓN */}
        <div className="flex items-center justify-between px-1 mb-8">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black tracking-tighter italic">Novedades</h3>
            <span className="size-2 bg-red-500 rounded-full animate-pulse"></span>
          </div>
          {filter !== 'Todos' && (
            <button onClick={() => setFilter('Todos')} className="text-[10px] font-black text-primary uppercase underline tracking-[0.2em]">Restablecer</button>
          )}
        </div>

        <div className="space-y-8">
          {posts.filter(p => filter === 'Todos' || p.category === filter).map((post) => (
            <div key={post.id} className="group bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-sm text-primary shadow-inner">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="font-black text-base leading-none">{post.author}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1.5 flex items-center gap-2">
                      <span className="text-primary">#{post.category}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </p>
                  </div>
                </div>
                
                {/* BOTONES DE EDICIÓN SOLO PARA 'TÚ' */}
                {post.author === 'Tú' && (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOpenEdit(post)}
                      className="size-10 rounded-full bg-gray-50 dark:bg-zinc-800 text-gray-400 flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="size-10 rounded-full bg-gray-50 dark:bg-zinc-800 text-gray-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="px-8 pb-6">
                <p className="text-base font-medium leading-relaxed text-gray-700 dark:text-gray-300 italic">"{post.content}"</p>
              </div>

              {post.imageUrl && (
                <div className="px-4 pb-4">
                  <img src={post.imageUrl} className="w-full h-64 object-cover rounded-[2.5rem] shadow-lg" alt="Post" />
                </div>
              )}

              <div className="px-8 py-6 flex items-center gap-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-800/20">
                 <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 transition-all active:scale-125 ${post.isLiked ? 'text-red-500' : 'text-gray-400'}`}
                 >
                   <span className={`material-symbols-outlined text-2xl ${post.isLiked ? 'material-symbols-fill' : ''}`}>favorite</span>
                   <span className="text-xs font-black">{post.likes}</span>
                 </button>
                 <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                   <span className="material-symbols-outlined text-2xl">chat_bubble</span>
                   <span className="text-xs font-black">{post.comments}</span>
                 </button>
                 <button className="flex items-center gap-2 text-gray-400 ml-auto hover:text-primary transition-colors">
                   <span className="material-symbols-outlined text-2xl">share</span>
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTÓN FLOTANTE (FAB) PARA NUEVO POST - ACCESO GARANTIZADO */}
      <button 
        onClick={handleOpenNewPost}
        className="fixed bottom-32 right-6 size-16 bg-primary text-black rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center z-[70] animate-bounce active:scale-90 transition-all border-4 border-white dark:border-zinc-900"
      >
        <span className="material-symbols-outlined text-3xl font-black">add</span>
      </button>

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-md px-4 pb-0">
          <form 
            onSubmit={handleSubmit}
            className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-t-[3.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[92vh]"
          >
            <div className="flex items-center justify-between mb-8 shrink-0">
               <div>
                 <h3 className="text-3xl font-black tracking-tighter italic">
                   {editingPostId ? 'Editar Post' : 'Nueva Historia'}
                 </h3>
                 <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mt-2">Pack Leadership Panel</p>
               </div>
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
                <p className="text-[11px] font-black uppercase text-gray-400 ml-3 tracking-widest">Etiqueta tu historia</p>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-tight whitespace-nowrap transition-all border-2 ${
                        category === cat.name 
                          ? 'bg-primary border-primary text-black shadow-lg' 
                          : 'bg-gray-50 dark:bg-zinc-800 border-transparent text-gray-500'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-gray-400 ml-3 tracking-widest">Escribe algo increíble</p>
                <textarea
                  autoFocus
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-52 bg-gray-50 dark:bg-zinc-800 border-none rounded-[2.5rem] p-8 text-base font-bold focus:ring-4 focus:ring-primary/20 shadow-inner resize-none text-gray-800 dark:text-white"
                  placeholder="Ej: Max aprendió a dar la pata hoy... 🐾"
                />
              </div>
            </div>

            <div className="pt-6 pb-10 shrink-0">
               <button 
                type="submit"
                disabled={!content.trim()}
                className="w-full h-20 bg-primary text-black rounded-[2rem] font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-[0.3em] text-xs disabled:opacity-20 flex items-center justify-center gap-3"
               >
                 {editingPostId ? 'Guardar Cambios' : 'Lanzar al Muro'}
                 <span className="material-symbols-outlined font-black">send</span>
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
                  <h3 className="font-black text-base uppercase tracking-tight">Perri AI Chat</h3>
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
