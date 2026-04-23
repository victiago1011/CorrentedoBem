'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  LayoutGrid, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  X,
  CreditCard,
  Monitor,
  HeartPulse,
  GraduationCap,
  Hammer,
  Building2,
  Menu,
  Handshake,
  Bookmark,
  ExternalLink,
  Share2,
  Verified
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface Candidate {
  id: string;
  name: string;
  location: string;
  area: string;
  status: 'pending' | 'approved' | 'rejected';
  role: string;
  summary: string;
  skills: string[];
  image: string;
  verified?: boolean;
  created_at?: string;
}

export default function TalentosPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos os Talentos');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    'Todos os Talentos',
    'Tecnologia',
    'Saúde',
    'Finanças',
    'Engenharia & Arquitetura',
    'Autônomos',
  ];

  useEffect(() => {
    async function fetchCandidates() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar candidatos:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
      }
      if (data) setCandidates(data);
      setIsLoading(false);
    }
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cand.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cand.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Todos os Talentos' || cand.area === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fcf9f8] font-body">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#bec8d1]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#00628c] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#00628c]/20 group-hover:scale-110 transition-transform">
              <Handshake className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-[#00628c] font-headline tracking-tighter">Corrente do Bem</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/vagas" className="text-[#3e4850] hover:text-[#00628c] font-medium transition-colors">Vagas</Link>
            <Link href="/talentos" className="text-[#00628c] font-bold border-b-2 border-[#00628c] pb-1">Talentos</Link>
            <Link href="/#comunidade" className="text-[#3e4850] hover:text-[#00628c] font-medium transition-colors">Comunidade</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block px-6 py-2 text-[#00628c] font-bold hover:bg-[#f6f3f2] rounded-full transition-all">Entrar</button>
            <Link href="/talentos/cadastrar" className="px-6 py-2 bg-[#00628c] text-white font-bold rounded-full shadow-sm hover:scale-95 transition-transform text-center">Cadastrar</Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-[#3e4850]">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header & Search */}
        <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#00628c] mb-4 font-headline leading-tight">Galeria de Talentos</h1>
            <p className="text-[#3e4850] text-lg leading-relaxed">Conecte-se com profissionais excepcionais prontos para transformar sua empresa com dignidade e competência.</p>
          </div>
          <div className="w-full md:w-96">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f7881] w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar por nome ou competência..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-[#f0eded] focus:bg-white focus:ring-2 focus:ring-[#00628c]/40 transition-all text-[#1b1c1c] shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <nav className="flex overflow-x-auto gap-4 mb-12 pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-[#00628c] text-white shadow-lg shadow-[#00628c]/20' 
                  : 'bg-[#f0eded] text-[#3e4850] hover:bg-[#e5e2e1]'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#3e4850] mb-6">Disponibilidade</h3>
              <div className="space-y-4">
                {['Imediata', 'Em 15 dias', 'Em 30 dias'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-[#bec8d1] text-[#00628c] focus:ring-[#00628c]/20" />
                    <span className="text-sm font-medium text-[#3e4850] group-hover:text-[#00628c] transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#3e4850] mb-6">Localização</h3>
              <div className="space-y-4">
                {['Remoto', 'Híbrido', 'Presencial'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-[#bec8d1] text-[#00628c] focus:ring-[#00628c]/20" />
                    <span className="text-sm font-medium text-[#3e4850] group-hover:text-[#00628c] transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#3e4850] mb-6">Experiência</h3>
              <select className="w-full p-4 rounded-2xl border-none bg-[#f0eded] text-[#1b1c1c] font-bold focus:ring-2 focus:ring-[#00628c]/40 cursor-pointer">
                <option>Qualquer nível</option>
                <option>Júnior (0-2 anos)</option>
                <option>Pleno (3-5 anos)</option>
                <option>Sênior (6+ anos)</option>
                <option>Especialista / Gestor</option>
              </select>
            </div>

            <div className="pt-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl mb-4 group">
                <Image 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" 
                  alt="Destaque do Mês" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <p className="text-white font-bold text-sm">Destaque do Mês</p>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-[#fc820c]/10 border-l-4 border-[#fc820c]">
                <p className="text-[#964900] font-black text-[10px] uppercase tracking-widest mb-2">História de Sucesso</p>
                <p className="text-[#3e4850] text-sm italic leading-relaxed">&quot;Encontrei minha oportunidade ideal através da Corrente do Bem em menos de 2 semanas.&quot;</p>
              </div>
            </div>
          </aside>

          {/* Talent Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-[#00628c]/20 border-t-[#00628c] rounded-full animate-spin"></div>
                <p className="text-[#3e4850] font-medium">Carregando talentos...</p>
              </div>
            ) : filteredCandidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCandidates.map((cand, idx) => (
                  <motion.div 
                    key={cand.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "group bg-[#f6f3f2] rounded-[2.5rem] p-8 hover:bg-white transition-all duration-300 relative overflow-hidden flex flex-col gap-8 shadow-sm hover:shadow-2xl border border-[#bec8d1]/10",
                      idx === 0 && "md:col-span-2 md:flex-row"
                    )}
                  >
                    <div className={cn(
                      "relative rounded-3xl overflow-hidden shrink-0 shadow-xl",
                      idx === 0 ? "w-32 h-32 md:w-48 md:h-48" : "w-24 h-24"
                    )}>
                      <Image src={cand.image} alt={cand.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                      {cand.verified && (
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#bff444] flex items-center justify-center border-4 border-white">
                          <Verified className="w-4 h-4 text-[#141f00] fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-3 py-1 rounded-full bg-[#bff444] text-[#141f00] text-[10px] font-black uppercase tracking-widest">{cand.area}</span>
                        <Bookmark className="w-5 h-5 text-[#bec8d1] hover:text-[#964900] cursor-pointer transition-colors" />
                      </div>
                      <h3 className={cn("font-extrabold text-[#1b1c1c] mb-1 font-headline", idx === 0 ? "text-3xl" : "text-xl")}>{cand.name}</h3>
                      <p className="text-[#00628c] font-bold mb-4">{cand.role}</p>
                      <p className="text-[#3e4850] leading-relaxed mb-6 text-sm line-clamp-3">{cand.summary}</p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {cand.skills.slice(0, idx === 0 ? 6 : 3).map(skill => (
                          <span key={skill} className="px-3 py-1 bg-[#f0eded] rounded-lg text-[10px] font-bold text-[#3e4850] uppercase tracking-wider">{skill}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center text-[#3e4850] text-xs font-bold gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#00628c]" />
                          {cand.location}
                        </div>
                        <button className="text-[#00628c] font-black text-sm hover:underline flex items-center gap-2">
                          Ver Perfil Completo <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-[#bec8d1]">
                <LayoutGrid className="w-16 h-16 text-[#bec8d1] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1b1c1c] mb-2">
                  {searchTerm ? 'Talento não encontrado' : 'Nenhum talento aprovado'}
                </h3>
                <p className="text-[#3e4850]">
                  {searchTerm 
                    ? `Não encontramos talentos com o termo "${searchTerm}".` 
                    : 'Ainda não há talentos aprovados disponíveis. Use o Painel Adm para aprovar perfis pendentes.'}
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-6 px-8 py-3 bg-[#00628c] text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-[#00628c]/20"
                  >
                    Ver todos os talentos
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-16 flex justify-center gap-3">
              <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#f0eded] text-[#3e4850] hover:bg-[#00628c] hover:text-white transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#00628c] text-white font-bold shadow-lg shadow-[#00628c]/20">1</button>
              <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#f0eded] text-[#3e4850] hover:bg-[#00628c] hover:text-white transition-all font-bold">2</button>
              <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#f0eded] text-[#3e4850] hover:bg-[#00628c] hover:text-white transition-all font-bold">3</button>
              <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#f0eded] text-[#3e4850] hover:bg-[#00628c] hover:text-white transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f0eded] py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
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
              <h4 className="text-xs font-black uppercase tracking-widest text-[#00628c] mb-6">Empresa</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Sobre Nós</Link></li>
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Privacidade</Link></li>
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-[#00628c] mb-6">Suporte</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Contato</Link></li>
                <li><Link href="#" className="text-[#3e4850] hover:text-[#00628c] transition-colors">Ajuda</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#bec8d1]/30 text-center">
            <p className="text-xs font-bold text-[#6f7881] uppercase tracking-widest">
              © 2024 Corrente do Bem. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
