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
  Paperclip,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Link as LinkIcon,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Navbar } from '@/app/components/Navbar';
import { cn } from '@/lib/utils';

interface Noticia {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  attachment_url?: string;
  author?: string;
  category?: string;
  status: string;
  published_at: string;
}

const SafeImage = ({ src, alt, className, fill, unoptimized, ...props }: any) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    return (
      <div className={cn(
        "bg-[#f0f2f5] flex items-center justify-center overflow-hidden",
        className,
        fill ? "absolute inset-0" : ""
      )}>
        <div className="w-12 h-12 text-[#bec8d1]">
          <Handshake className="w-full h-full opacity-20" />
        </div>
      </div>
    );
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      unoptimized={unoptimized}
      className={cn(className, "object-cover")}
      onError={() => setError(true)}
      {...props}
    />
  );
};

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

  const formattedDate = new Date(noticia.published_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-white font-body selection:bg-[#00628c]/10 selection:text-[#00628c]">
      <Navbar />
      
      <main className="pt-24 lg:pt-32 pb-24">
        {/* News Header - G1 Style */}
        <article className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Breadcrumb / Category */}
          <div className="flex items-center gap-2 mb-6">
            <Link href="/noticias" className="text-[#00628c] font-black text-[10px] uppercase tracking-widest hover:underline">
              {noticia.category || 'Geral'}
            </Link>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-[#1a2b3b] leading-[1.1] mb-6 tracking-tight">
            {noticia.title}
          </h1>

          {/* Subtitle / Excerpt */}
          {noticia.excerpt && (
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed mb-8">
              {noticia.excerpt}
            </p>
          )}

          {/* Byline */}
          <div className="border-t border-gray-100 pt-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 items-start">
                <div className="flex items-center gap-2 text-sm text-[#1a2b3b] font-bold">
                  <span>Por {noticia.author || 'Corrente do Bem'}</span>
                </div>
                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>{formattedDate.replace(',', ' — ')}</span>
                </div>
              </div>
              
              {/* Sharing Buttons */}
              <div className="flex items-center gap-2">
                <button title="Compartilhar no Facebook" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-100 hover:bg-[#1877f2] hover:text-white transition-all text-gray-400">
                  <Facebook className="w-4 h-4" />
                </button>
                <button title="Compartilhar no Twitter" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-100 hover:bg-[#1da1f2] hover:text-white transition-all text-gray-400">
                  <Twitter className="w-4 h-4" />
                </button>
                <button title="Copiar link" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 transition-all text-gray-400">
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Image */}
          {noticia.image_url && (
            <figure className="mb-12 -mx-4 md:mx-0">
              <div className="relative aspect-[16/9] w-full overflow-hidden md:rounded-xl">
                <SafeImage 
                  src={noticia.image_url} 
                  alt={noticia.title} 
                  fill 
                  priority
                  unoptimized
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <figcaption className="mt-3 px-4 md:px-0 text-[11px] text-gray-400 font-medium italic">
                Foto: {noticia.author || 'Divulgação'} / Corrente do Bem
              </figcaption>
            </figure>
          )}

          {/* News Content */}
          <div 
            className="prose prose-lg md:prose-xl prose-slate max-w-none text-[#333] leading-[1.8] font-serif-ish news-content"
            dangerouslySetInnerHTML={{ __html: noticia.content }}
          />

          {/* Attachment if exists */}
          {noticia.attachment_url && (
            <div className="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                 <Paperclip className="w-5 h-5 text-[#00628c]" />
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#00628c]">Material de Apoio</h3>
              </div>
              <a 
                href={noticia.attachment_url} 
                target="_blank" 
                rel="noopener noreferrer"
                download
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-transparent hover:border-[#00628c]/20 transition-all group shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-[#00628c]/5 flex items-center justify-center text-[#00628c]">
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a2b3b]">Baixar arquivo em anexo</p>
                  <p className="text-xs text-gray-400">Conteúdo extra selecionado por nossa redação</p>
                </div>
              </a>
            </div>
          )}

          {/* Tags / Interaction Footer */}
          <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 bg-gray-50 text-gray-500 font-bold text-[10px] uppercase tracking-wider rounded-full border border-gray-100">
                #{noticia.category || 'NOTÍCIA'}
              </span>
              <span className="px-4 py-1.5 bg-gray-50 text-gray-500 font-bold text-[10px] uppercase tracking-wider rounded-full border border-gray-100">
                #CORRENTEDOBEM
              </span>
            </div>
            
            <Link 
              href="/noticias" 
              className="inline-flex items-center gap-2 text-[#00628c] font-black text-xs uppercase tracking-widest hover:gap-4 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver todas as notícias
            </Link>
          </div>
        </article>
      </main>

      {/* Styled JSX for content consistency */}
      <style jsx global>{`
        .news-content p { margin-bottom: 2rem; font-size: 1.25rem; }
        @media (max-width: 768px) {
          .news-content p { font-size: 1.125rem; }
        }
        .news-content h2 { font-size: 2rem; margin-top: 3rem; margin-bottom: 1.5rem; font-weight: 900; line-height: 1.2; }
        .news-content h3 { font-size: 1.5rem; margin-top: 2.5rem; margin-bottom: 1rem; font-weight: 800; }
        .news-content blockquote { border-left-width: 4px; border-color: #00628c; padding-left: 1.5rem; font-style: italic; color: #4b5563; font-weight: 500; margin: 3rem 0; }
        .news-content ul, .news-content ol { padding-left: 1.5rem; margin-bottom: 2rem; }
        .news-content li { margin-bottom: 0.75rem; }
        .news-content img { border-radius: 0.75rem; margin: 3rem 0; }
      `}</style>

      {/* Footer from listing page for consistency */}
      <footer className="bg-white border-t border-gray-100 py-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#00628c] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#00628c]/20">
                  <Handshake className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-[#1a2b3b] tracking-tighter">Corrente do Bem</span>
              </Link>
              <p className="text-[#3e4850] text-lg lg:text-xl opacity-60 leading-relaxed max-w-md">
                Unindo talentos e empresas através de conexões genuínas e respeito mútuo.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-[#00628c] mb-8">Navegação</h4>
              <ul className="space-y-4">
                <li><Link href="/vagas" className="text-lg text-[#3e4850]/60 hover:text-[#00628c] transition-colors font-bold">Vagas</Link></li>
                <li><Link href="/talentos" className="text-lg text-[#3e4850]/60 hover:text-[#00628c] transition-colors font-bold">Currículos</Link></li>
                <li><Link href="/negocios" className="text-lg text-[#3e4850]/60 hover:text-[#00628c] transition-colors font-bold">Negócios</Link></li>
                <li><Link href="/noticias" className="text-lg text-[#00628c] transition-colors font-black">Notícias</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-[#00628c] mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-lg text-[#3e4850]/60 hover:text-[#00628c] transition-colors font-bold">Privacidade</Link></li>
                <li><Link href="#" className="text-lg text-[#3e4850]/60 hover:text-[#00628c] transition-colors font-bold">Termos de Uso</Link></li>
                <li><Link href="#" className="text-lg text-[#3e4850]/60 hover:text-[#00628c] transition-colors font-bold">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-bold text-[#3e4850]/40 uppercase tracking-widest">
              © 2024 Corrente do Bem. Todos os direitos reservados.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="text-[#3e4850]/40 hover:text-[#00628c] transition-all"><span className="sr-only">Instagram</span><Instagram className="w-6 h-6" /></Link>
              <Link href="#" className="text-[#3e4850]/40 hover:text-[#00628c] transition-all"><span className="sr-only">LinkedIn</span><Linkedin className="w-6 h-6" /></Link>
              <Link href="#" className="text-[#3e4850]/40 hover:text-[#00628c] transition-all"><span className="sr-only">Twitter</span><Twitter className="w-6 h-6" /></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

