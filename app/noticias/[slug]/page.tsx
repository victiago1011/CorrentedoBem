'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  ChevronLeft, 
  Share2,
  Clock,
  ArrowLeft,
  Loader2,
  Tag,
  Bookmark,
  Handshake,
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Navbar } from '@/app/components/Navbar';

interface Noticia {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  author?: string;
  category?: string;
  status: string;
  published_at: string;
}

export default function NoticiaDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNoticia() {
      if (!slug) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (data) {
        setNoticia(data);
      } else {
        console.error('Notícia não encontrada');
      }
      setIsLoading(false);
    }
    fetchNoticia();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-[#00628c] animate-spin mb-4" />
        <p className="text-[#00628c] font-black uppercase tracking-widest text-sm animate-pulse">Carregando Artigo...</p>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h1 className="text-4xl font-black text-[#1a2b3b] mb-4">Artigo não encontrado</h1>
        <p className="text-[#3e4850] mb-8">O conteúdo que você está procurando não existe ou foi removido.</p>
        <Link href="/noticias" className="px-8 py-3 bg-[#00628c] text-white font-black rounded-xl">
           Voltar para Notícias
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Header / Banner */}
      <header className="relative w-full h-[70vh] bg-[#1a2b3b] overflow-hidden">
        {noticia.image_url ? (
          <Image 
            src={noticia.image_url} 
            alt={noticia.title} 
            fill 
            className="object-cover opacity-80 transition-transform duration-[10s] hover:scale-110"
            priority
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-[#00628c]"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2b3b]/60 via-transparent to-white"></div>
        
        <div className="container mx-auto px-6 relative h-full flex flex-col justify-end pb-12 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl"
          >
            <div className="flex flex-wrap gap-4 mb-8">
               <button 
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl"
               >
                 <ArrowLeft className="w-4 h-4" />
                 Voltar para o Blog
               </button>
               <span className="px-6 py-3 bg-[#fc820c] text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-2xl shadow-[#fc820c]/20">
                 {noticia.category || 'Destaque'}
               </span>
            </div>
            
            <h1 className="text-4xl lg:text-7xl font-black text-[#1a2b3b] mb-10 leading-[1.1] tracking-tighter max-w-4xl">
              {noticia.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-6 gap-x-12 text-[#1a2b3b]/50 font-black text-[10px] uppercase tracking-widest pt-10 border-t border-[#1a2b3b]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00628c] flex items-center justify-center text-white shadow-lg shadow-[#00628c]/20">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[#1a2b3b] text-xs mb-0.5">{noticia.author || 'Redação'}</p>
                  <p className="opacity-60">Escritor principal</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#F1F5F9]/50 px-4 py-2 rounded-xl">
                <Calendar className="w-4 h-4 text-[#fc820c]" />
                {new Date(noticia.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-3 bg-[#F1F5F9]/50 px-4 py-2 rounded-xl">
                <Clock className="w-4 h-4 text-[#fc820c]" />
                <span>5 minutos de leitura</span>
              </div>
              <div className="ml-auto hidden lg:flex items-center gap-3">
                <button className="flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow border border-[#bec8d1]/20">
                  <Share2 className="w-4 h-4 text-[#00628c]" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {noticia.excerpt && (
                <div className="relative mb-20">
                  <div className="absolute -left-8 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#00628c] to-[#fc820c] rounded-full hidden lg:block"></div>
                  <p className="text-2xl lg:text-3xl font-black text-[#1a2b3b] italic leading-relaxed opacity-80">
                    {noticia.excerpt}
                  </p>
                </div>
              )}
              
              <div className="prose prose-2xl prose-slate max-w-none text-[#3e4850] leading-[1.8] font-medium 
                prose-headings:text-[#1a2b3b] prose-headings:font-black prose-headings:tracking-tight 
                prose-p:mb-8 prose-li:mb-2 prose-a:text-[#00628c] prose-a:font-bold prose-strong:text-[#1a2b3b]
                selection:bg-[#00628c]/10 prose-img:rounded-[2rem] prose-img:shadow-2xl">
                <ReactMarkdown>
                  {noticia.content}
                </ReactMarkdown>
              </div>

              <div className="mt-24 pt-12 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-10">
                <div className="flex items-center gap-6">
                  <span className="text-[#1a2b3b] font-black text-xs uppercase tracking-[0.2em]">Categorias</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-5 py-2 bg-[#F8FAFC] border border-[#F1F5F9] text-[#475569] font-black text-[10px] rounded-full uppercase tracking-wider hover:bg-[#00628c] hover:text-white transition-all cursor-default">#{noticia.category || 'Comunidade'}</span>
                    <span className="px-5 py-2 bg-[#F8FAFC] border border-[#F1F5F9] text-[#475569] font-black text-[10px] rounded-full uppercase tracking-wider hover:bg-[#fc820c] hover:text-white transition-all cursor-default">#Esperança</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-3 px-8 py-4 bg-[#1a2b3b] text-white rounded-2xl hover:bg-[#00628c] transition-all font-black text-xs uppercase tracking-widest shadow-xl">
                    <Bookmark size={18} className="text-[#fc820c]" />
                    Salvar Artigo
                  </button>
                  <button className="p-4 bg-[#F8FAFC] text-[#1a2b3b] rounded-2xl hover:bg-[#00628c] hover:text-white transition-all border border-[#F1F5F9]">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Author Sidebar - Now integrated below content for mobile/cleaner for desktop */}
            <div className="mt-32 p-12 bg-[#F8FAFC] rounded-[3rem] border border-[#F1F5F9] flex flex-col md:flex-row gap-12 items-center">
                <div className="w-40 h-40 relative rounded-[2.5rem] overflow-hidden shadow-2xl flex-shrink-0 bg-[#00628c]">
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <User size={64} />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#fc820c] mb-3 block">Autor em Destaque</span>
                  <h3 className="text-3xl font-black text-[#1a2b3b] mb-4">{noticia.author || 'Equipe Corrente do Bem'}</h3>
                  <p className="text-lg text-[#3e4850] leading-relaxed mb-8 opacity-70">
                    Dedicado a narrar histórias de superação e conectar pessoas através da informação qualificada e humanizada.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <Link href="/noticias" className="px-6 py-2 bg-white text-[#00628c] border border-[#00628c]/10 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#00628c] hover:text-white transition-all">
                      Ver Perfil Completo
                    </Link>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </article>

      {/* Navigation Footer */}
      <footer className="py-20 bg-[#F8FAFC] border-t border-[#F1F5F9]">
        <div className="container mx-auto px-6">
           <div className="flex justify-between items-center">
             <Link href="/noticias" className="flex items-center gap-3 text-[#1a2b3b] font-black uppercase tracking-widest text-xs hover:text-[#00628c] transition-colors group">
               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
               Todas as Notícias
             </Link>
           </div>
        </div>
      </footer>
      {/* Footer */}
      <footer className="bg-[#f0eded] py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-left">
            <div className="col-span-1 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6 text-left">
                <div className="w-8 h-8 bg-[#00628c] rounded-lg flex items-center justify-center text-white">
                  <Handshake className="w-5 h-5 text-left" />
                </div>
                <span className="text-xl font-bold text-[#00628c] font-headline">Corrente do Bem</span>
              </Link>
              <p className="text-[#3e4850] max-w-md leading-relaxed text-left">
                Transformando a busca por emprego em uma jornada de respeito e conexões verdadeiras. Conectando carreiras com dignidade.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-[#00628c] mb-6 text-left">Empresa</h4>
              <ul className="space-y-4 text-left">
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Sobre Nós</Link></li>
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Privacidade</Link></li>
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-[#00628c] mb-6 text-left">Suporte</h4>
              <ul className="space-y-4 text-left">
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Contato</Link></li>
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Ajuda</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#bec8d1]/30 text-center">
            <p className="text-xs font-bold text-[#6f7881] uppercase tracking-widest text-center">
              © 2024 Corrente do Bem. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
