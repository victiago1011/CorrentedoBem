'use client';

import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Calendar, 
  User, 
  ChevronRight, 
  Search,
  ArrowRight,
  Clock,
  Handshake,
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
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

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchNoticias() {
      // Use cached data if possible or just fetch once
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('status', 'active')
        .order('published_at', { ascending: false });

      if (data) setNoticias(data);
      setIsLoading(false);
    }
    fetchNoticias();
  }, []);

  const filteredNoticias = noticias.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.category && n.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const featuredNoticia = filteredNoticias[0];
  const regularNoticias = filteredNoticias.slice(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[#00628c]/[0.02] -skew-y-6 origin-top-right"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-[#00628c]/5 rounded-full border border-[#00628c]/10">
              <Megaphone className="w-4 h-4 text-[#00628c]" />
              <span className="text-[#00628c] font-black text-[10px] uppercase tracking-[0.2em]">Blog & Atualizações</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-[#1a2b3b] mb-8 leading-tight tracking-tighter">
              Acompanhe as histórias de <span className="text-[#00628c]">transformação</span>
            </h1>
            <p className="text-xl text-[#3e4850] mb-12 leading-relaxed opacity-80">
              Fique por dentro das novidades, histórias inspiradoras e eventos que movem a nossa comunidade.
            </p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3e4850]/30 w-5 h-5" />
              <input 
                type="text"
                placeholder="O que você deseja ler hoje?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-white border border-[#bec8d1]/20 rounded-[2rem] focus:border-[#00628c] focus:ring-4 focus:ring-[#00628c]/5 focus:outline-none transition-all shadow-2xl shadow-[#00628c]/5 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-[#00628c]/10 border-t-[#00628c] rounded-full animate-spin mb-6"></div>
            <p className="text-[#00628c] font-black uppercase tracking-widest text-xs animate-pulse">Buscando novidades...</p>
          </div>
        ) : filteredNoticias.length > 0 ? (
          <div className="space-y-24">
            {/* Featured Post */}
            {!searchTerm && featuredNoticia && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="grid lg:grid-cols-12 gap-0 bg-white rounded-[3rem] overflow-hidden border border-[#bec8d1]/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto h-full min-h-[400px] overflow-hidden">
                    <Image 
                      src={featuredNoticia.image_url || 'https://images.unsplash.com/photo-1504711432869-efd55734bd3c?auto=format&fit=crop&q=80&w=1200'} 
                      alt={featuredNoticia.title} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    <div className="absolute top-8 left-8">
                      <span className="px-6 py-2 bg-white text-[#00628c] font-black text-[10px] uppercase tracking-widest rounded-full shadow-xl">
                        Destaque do Mês
                      </span>
                    </div>
                  </div>
                  <div className="lg:col-span-5 p-10 lg:p-16 flex flex-col justify-center">
                    <div className="flex items-center gap-6 text-[#3e4850]/40 text-[10px] font-black uppercase tracking-widest mb-6">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#fc820c]" />
                        {new Date(featuredNoticia.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                      </span>
                      <span className="w-1 h-1 bg-[#fc820c] rounded-full"></span>
                      <span className="flex items-center gap-2 underline underline-offset-4 decoration-[#fc820c]/30">
                        {featuredNoticia.category || 'Geral'}
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-black text-[#1a2b3b] leading-tight mb-6">
                      <Link href={`/noticias/${featuredNoticia.slug}`} className="hover:text-[#00628c] transition-colors">
                        {featuredNoticia.title}
                      </Link>
                    </h2>
                    <p className="text-lg text-[#3e4850] leading-relaxed mb-10 opacity-70 line-clamp-3">
                      {featuredNoticia.excerpt || featuredNoticia.content.substring(0, 220) + '...'}
                    </p>
                    <div className="flex items-center gap-8">
                      <Link 
                        href={`/noticias/${featuredNoticia.slug}`}
                        className="inline-flex items-center gap-3 text-[#00628c] font-black text-xs uppercase tracking-[0.2em] group/btn"
                      >
                        Continuar Lendo
                        <div className="w-10 h-[2px] bg-[#00628c]/20 relative overflow-hidden">
                          <div className="absolute inset-0 bg-[#00628c] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                        </div>
                      </Link>
                      <div className="flex items-center gap-3 text-[#3e4850]/40 text-[10px] font-black uppercase tracking-widest">
                        <Clock className="w-4 h-4" />
                        5 min
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Content Divider */}
            <div className="flex items-center gap-8 px-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6f7881] whitespace-nowrap">Últimas Publicações</span>
              <div className="h-[1px] w-full bg-[#bec8d1]/20"></div>
            </div>

            {/* Desktop Bento Grid / Mobile List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {(searchTerm ? filteredNoticias : regularNoticias).map((news, index) => (
                <motion.article 
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col h-full"
                >
                  <Link href={`/noticias/${news.slug}`} className="flex flex-col h-full">
                    <div className="relative aspect-[16/11] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl group-hover:shadow-3xl transition-all duration-500 bg-white">
                      <Image 
                        src={news.image_url || 'https://images.unsplash.com/photo-1504711432869-efd55734bd3c?auto=format&fit=crop&q=80&w=800'} 
                        alt={news.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#00628c] font-black text-[9px] uppercase tracking-widest rounded-full shadow-lg">
                          {news.category || 'Geral'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                    </div>
                    <div className="flex-1 flex flex-col px-2">
                      <div className="flex items-center gap-4 text-[#3e4850]/40 text-[9px] font-black uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-[#bec8d1]/10 rounded-full">
                          <Calendar className="w-3 h-3 text-[#fc820c]" />
                          {new Date(news.published_at).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          3 min
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-[#1a2b3b] leading-tight mb-4 group-hover:text-[#00628c] transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-base text-[#3e4850]/60 line-clamp-3 leading-relaxed mb-6 flex-1">
                        {news.excerpt || news.content.substring(0, 110).trim() + '...'}
                      </p>
                      <div className="inline-flex items-center gap-2 text-[#00628c] font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all pb-1 border-b-2 border-transparent hover:border-[#00628c]/20 w-fit">
                        Ver Artigo
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {filteredNoticias.length === 0 && !isLoading && (
              <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-[#00628c]/10">
                <div className="w-20 h-20 bg-[#00628c]/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#00628c]">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#1a2b3b] mb-2">Nenhuma notícia encontrada</h3>
                <p className="text-[#3e4850]/60 max-w-md mx-auto mb-8">Não conseguimos encontrar resultados para sua busca. Tente buscar por outros termos.</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-8 py-3 bg-[#00628c] text-white font-black rounded-xl active:scale-95 transition-all shadow-lg shadow-[#00628c]/20"
                >
                  Ver todas as notícias
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-40">
             <h3 className="text-2xl font-black text-[#1a2b3b] mb-2">Ainda não há notícias disponíveis</h3>
             <p className="text-[#3e4850]/60">Volte em breve para conferir as novidades da nossa plataforma.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#1a2b3b] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00628c]/10 skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
              Tem uma novidade para compartilhar com a comunidade?
            </h2>
            <p className="text-xl text-white/70 mb-12">
              Envie sugestões de pautas, eventos ou histórias inspiradoras para o nosso time editorial.
            </p>
            <Link 
              href="mailto:contato@correntedobem.com.br"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#fc820c] text-white font-black rounded-2xl shadow-2xl shadow-[#fc820c]/30 hover:scale-105 active:scale-95 transition-all"
            >
              Entre em Contato
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[#f0eded] py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-left">
            <div className="col-span-1 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#00628c] rounded-lg flex items-center justify-center text-white">
                  <Handshake className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-[#00628c] font-headline">Corrente do Bem</span>
              </Link>
              <p className="text-[#3e4850] max-w-md leading-relaxed">
                Transformando a busca por emprego em uma jornada de respeito e conexões verdadeiras. Conectando carreiras com dignidade.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-[#00628c] mb-6 text-left">Empresa</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Sobre Nós</Link></li>
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Privacidade</Link></li>
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-[#00628c] mb-6 text-left">Suporte</h4>
              <ul className="space-y-4">
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
