'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Clock, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X,
  CreditCard,
  Monitor,
  HeartPulse,
  GraduationCap,
  Hammer,
  Building2,
  Menu,
  Handshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/app/components/Navbar';

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

function VagasContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const search = searchParams.get('search');
    if (search && search !== searchTerm) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchTerm(search);
    }
  }, [searchParams, searchTerm]);

  const categories = [
    { name: 'Todas', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Finanças', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Tecnologia', icon: <Monitor className="w-5 h-5" /> },
    { name: 'Saúde', icon: <HeartPulse className="w-5 h-5" /> },
    { name: 'Educação', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Autônomos', icon: <Hammer className="w-5 h-5" /> },
    { name: 'Engenharia & Arquitetura', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Serviços Gerais', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Outros', icon: <Filter className="w-5 h-5" /> },
  ];

  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar vagas:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
      }
      if (data) setJobs(data);
      setIsLoading(false);
    }
    fetchJobs();
  }, []);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const jobArea = job.area?.trim().toLowerCase() || '';
    const selectedCat = selectedCategory.trim().toLowerCase();
    const matchesCategory = selectedCategory === 'Todas' || jobArea === selectedCat;

    const matchesType = selectedTypes.length === 0 || selectedTypes.some(t => job.type.includes(t));
    
    // Level matching: level is not explicitly in the schema yet, but we'll prepare for it or map it if it exists in description/requirements
    // For now, if no job.level, we'll just allow it unless level is set and we want to try matching it.
    // Let's assume for this demo we'll just filter by type and category effectively first.
    const matchesLevel = !selectedLevel || true; // Placeholder for future level field

    return matchesSearch && matchesCategory && matchesType && matchesLevel;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTypes, selectedLevel]);

  return (
    <div className="min-h-screen bg-[#fcf9f8] font-body">
      <Navbar />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
        {/* Hero & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#00628c] font-headline leading-tight mb-6">
              Encontre sua <span className="text-[#bff444]">Vaga</span>
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
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-[#bec8d1] text-[#00628c] focus:ring-[#00628c]/20" 
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                    />
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
                    <input 
                      type="radio" 
                      name="level" 
                      className="w-5 h-5 border-[#bec8d1] text-[#00628c] focus:ring-[#00628c]/20" 
                      checked={selectedLevel === level}
                      onChange={() => setSelectedLevel(level)}
                    />
                    <span className="text-sm font-medium text-[#3e4850] group-hover:text-[#00628c] transition-colors">{level}</span>
                  </label>
                ))}
                {selectedLevel && (
                  <button 
                    onClick={() => setSelectedLevel(null)}
                    className="text-[10px] font-bold text-[#00628c] uppercase tracking-wider hover:underline"
                  >
                    Limpar Nível
                  </button>
                )}
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
            ) : paginatedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedJobs.map((job) => (
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
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="w-full py-3.5 bg-[#f6f3f2] hover:bg-[#00628c] hover:text-white text-[#00628c] font-bold rounded-2xl transition-all active:scale-95"
                    >
                      Ver Detalhes
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-[#bec8d1]">
                <Briefcase className="w-16 h-16 text-[#bec8d1] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1b1c1c] mb-2">
                  {searchTerm ? 'Vaga não encontrada' : 'Nenhuma vaga ativa'}
                </h3>
                <p className="text-[#3e4850]">
                  {searchTerm 
                    ? `Não encontramos nenhuma vaga que corresponda ao termo "${searchTerm}".` 
                    : 'Ainda não há vagas aprovadas disponíveis. Use o Painel Adm para aprovar vagas pendentes.'}
                </p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-6 px-8 py-3 bg-[#00628c] text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-[#00628c]/20"
                >
                  Ver todas as vagas
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#bec8d1]/30 text-[#3e4850] hover:bg-[#00628c] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm"
                >
                  <ChevronsLeft className="w-5 h-5 group-active:scale-90 transition-transform" />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#bec8d1]/30 text-[#3e4850] hover:bg-[#00628c] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5 group-active:scale-90 transition-transform" />
                </button>
                
                <div className="flex items-center gap-2 px-2">
                  <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#00628c] text-white font-bold shadow-lg shadow-[#00628c]/20">
                    {currentPage}
                  </span>
                  <span className="text-[#3e4850] font-medium text-sm">de {totalPages}</span>
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#bec8d1]/30 text-[#3e4850] hover:bg-[#00628c] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm"
                >
                  <ChevronRight className="w-5 h-5 group-active:scale-90 transition-transform" />
                </button>
                <button 
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#bec8d1]/30 text-[#3e4850] hover:bg-[#00628c] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm"
                >
                  <ChevronsRight className="w-5 h-5 group-active:scale-90 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Detalhes da Vaga */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-[#3e4850]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-6 right-6 p-2 bg-[#f6f3f2] rounded-full text-[#3e4850] hover:bg-[#00628c] hover:text-white transition-all z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-[#c8e6ff] rounded-2xl flex items-center justify-center text-[#00628c]">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#00628c] font-headline tracking-tight">{selectedJob.title}</h2>
                    <p className="text-[#964900] font-bold">{selectedJob.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                  <div className="p-4 bg-[#f6f3f2] rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#6f7881] mb-1">Localização</p>
                    <p className="text-sm font-bold text-[#3e4850] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00628c]" /> {selectedJob.location}
                    </p>
                  </div>
                  <div className="p-4 bg-[#f6f3f2] rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#6f7881] mb-1">Tipo</p>
                    <p className="text-sm font-bold text-[#3e4850] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#00628c]" /> {selectedJob.type}
                    </p>
                  </div>
                  <div className="p-4 bg-[#f6f3f2] rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#6f7881] mb-1">Salário</p>
                    <p className="text-sm font-bold text-[#3e4850] flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#00628c]" /> {selectedJob.salary || 'A combinar'}
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#00628c] mb-4">Descrição da Vaga</h3>
                    <p className="text-[#3e4850] leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
                  </div>

                  {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#00628c] mb-4">Requisitos</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedJob.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[#3e4850] text-sm group">
                            <div className="mt-1.5 w-1.5 h-1.5 bg-[#bff444] rounded-full group-hover:scale-125 transition-transform shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 md:p-8 bg-[#f6f3f2] border-t border-[#bec8d1]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-xs text-[#6f7881] font-medium italic">Vaga anunciada através do Corrente do Bem</p>
                <button 
                  className="w-full sm:w-auto px-10 py-4 bg-[#00628c] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-[#004c6d] transition-all shadow-lg shadow-[#00628c]/20 text-sm"
                  onClick={() => alert(`Para se candidatar, entre em contato através dos dados da empresa ou aguarde novas instruções.`)}
                >
                  Candidatar-se Agora
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

export default function VagasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00628c]/20 border-t-[#00628c] rounded-full animate-spin"></div>
      </div>
    }>
      <VagasContent />
    </Suspense>
  );
}
