'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Briefcase, 
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
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  area: string;
  status: 'pending' | 'active' | 'rejected' | 'closed';
  salary: string;
  description: string;
  requirements: string[];
  verified?: boolean;
  created_at?: string;
}

export default function VagasPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'Todas', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Finanças', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Tecnologia', icon: <Monitor className="w-5 h-5" /> },
    { name: 'Saúde', icon: <HeartPulse className="w-5 h-5" /> },
    { name: 'Educação', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Autônomos', icon: <Hammer className="w-5 h-5" /> },
    { name: 'Engenharia & Arquitetura', icon: <Building2 className="w-5 h-5" /> },
  ];

  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (data) setJobs(data);
      setIsLoading(false);
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || job.area === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fcf9f8] font-body">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#bec8d1]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#00628c] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#00628c]/20 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-[#00628c] font-headline">Corrente do Bem</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/vagas" className="text-[#00628c] font-bold border-b-2 border-[#00628c] pb-1">Vagas</Link>
            <Link href="/talentos" className="text-[#3e4850] hover:text-[#00628c] font-medium transition-colors">Talentos</Link>
            <Link href="/#comunidade" className="text-[#3e4850] hover:text-[#00628c] font-medium transition-colors">Comunidade</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block px-6 py-2 text-[#00628c] font-bold hover:bg-[#f6f3f2] rounded-full transition-all">Entrar</button>
            <button className="px-6 py-2 bg-[#00628c] text-white font-bold rounded-full shadow-sm hover:scale-95 transition-transform">Cadastrar</button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-[#3e4850]">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
        {/* Hero & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#00628c] font-headline leading-tight mb-6">
              Encontre sua <span className="text-[#964900]">Oportunidade</span>
            </h1>
            <p className="text-[#3e4850] text-lg mb-8 max-w-xl">
              Conectamos talentos dedicados a causas que transformam vidas. Busque por vagas que ressoam com seu propósito.
            </p>
            <div className="relative max-w-2xl bg-white p-2 rounded-2xl shadow-xl border border-[#bec8d1]/10 flex items-center gap-2">
              <Search className="ml-4 text-[#6f7881] w-5 h-5" />
              <input 
                type="text" 
                placeholder="Cargo, empresa ou palavra-chave..." 
                className="w-full border-none focus:ring-0 bg-transparent text-[#1b1c1c] py-3 placeholder:text-[#6f7881]/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-[#00628c] hover:bg-[#004c6d] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#00628c]/20">
                Buscar
              </button>
            </div>
          </div>
          <div className="hidden lg:block relative h-[450px]">
            <div className="absolute inset-0 bg-[#964900]/10 rounded-[3rem] transform rotate-3"></div>
            <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-2xl -rotate-2 border-8 border-white">
              <Image 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                alt="Equipe sorridente" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#3e4850] mb-6">Categorias</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedCategory === cat.name 
                        ? 'bg-[#00628c] text-white shadow-lg shadow-[#00628c]/20' 
                        : 'bg-[#f6f3f2] text-[#3e4850] hover:bg-[#f0eded]'
                    }`}
                  >
                    <span className={selectedCategory === cat.name ? 'text-white' : 'text-[#00628c]'}>{cat.icon}</span>
                    <span className="text-sm font-bold">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#3e4850] mb-6">Disponibilidade</h3>
              <div className="space-y-4">
                {['Remoto', 'Presencial', 'Híbrido'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-[#bec8d1] text-[#00628c] focus:ring-[#00628c]/20" />
                    <span className="text-sm font-medium text-[#3e4850] group-hover:text-[#00628c] transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#3e4850] mb-6">Nível de Experiência</h3>
              <div className="space-y-4">
                {['Estágio', 'Júnior', 'Pleno/Sênior'].map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="level" className="w-5 h-5 border-[#bec8d1] text-[#00628c] focus:ring-[#00628c]/20" />
                    <span className="text-sm font-medium text-[#3e4850] group-hover:text-[#00628c] transition-colors">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Jobs Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm font-bold text-[#3e4850]">{filteredJobs.length} Vagas encontradas</span>
              <div className="flex items-center gap-2 text-sm text-[#6f7881]">
                Ordenar por: 
                <select className="bg-transparent border-none font-bold text-[#00628c] focus:ring-0 cursor-pointer">
                  <option>Mais recentes</option>
                  <option>Relevância</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-[#00628c]/20 border-t-[#00628c] rounded-full animate-spin"></div>
                <p className="text-[#3e4850] font-medium">Carregando vagas...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <motion.div 
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl border border-[#bec8d1]/10 hover:border-[#00628c]/20 transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-[#f6f3f2] rounded-2xl flex items-center justify-center text-[#00628c] group-hover:bg-[#00628c] group-hover:text-white transition-colors">
                        <Briefcase className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 bg-[#bff444] text-[#141f00] text-[10px] font-black uppercase tracking-wider rounded-full">
                        {job.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1b1c1c] group-hover:text-[#00628c] transition-colors mb-1 font-headline">
                      {job.title}
                    </h3>
                    <p className="text-[#964900] font-bold text-sm mb-4">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[#3e4850] text-xs mb-6">
                      <span className="flex items-center gap-1.5 bg-[#f6f3f2] px-3 py-1.5 rounded-full">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5 text-[#00628c] font-bold">
                        <Clock className="w-3.5 h-3.5" /> Publicada recentemente
                      </span>
                    </div>
                    <button className="w-full py-3.5 bg-[#f6f3f2] hover:bg-[#00628c] hover:text-white text-[#00628c] font-bold rounded-2xl transition-all active:scale-95">
                      Ver Detalhes
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-[#bec8d1]">
                <Briefcase className="w-16 h-16 text-[#bec8d1] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1b1c1c] mb-2">Nenhuma vaga encontrada</h3>
                <p className="text-[#3e4850]">Tente ajustar seus filtros ou busca.</p>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#00628c] text-white font-bold shadow-lg shadow-[#00628c]/20">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#f6f3f2] text-[#3e4850] font-bold transition-all">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#f6f3f2] text-[#3e4850] font-bold transition-all">3</button>
              <span className="flex items-center px-2 text-[#bec8d1]">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#f6f3f2] text-[#3e4850] font-bold transition-all">12</button>
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
                  <HeartHandshake className="w-5 h-5" />
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
