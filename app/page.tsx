'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Heart, 
  Utensils, 
  Brush, 
  Truck, 
  ArrowRight, 
  MapPin, 
  DollarSign, 
  Quote, 
  Share2, 
  Globe, 
  Handshake,
  ChevronRight,
  Menu,
  X,
  Briefcase,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
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
  created_at?: string;
}

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

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'candidatos' | 'empresas'>('candidatos');
  const [searchValue, setSearchValue] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [featuredCandidates, setFeaturedCandidates] = useState<Candidate[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    async function fetchFeaturedData() {
      setIsLoadingJobs(true);
      setIsLoadingCandidates(true);
      
      const [jobsRes, candidatesRes] = await Promise.all([
        supabase
          .from('jobs')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('candidates')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      if (jobsRes.error) {
        console.error('Erro ao buscar destaques de vagas:', jobsRes.error);
      } else if (jobsRes.data) {
        setFeaturedJobs(jobsRes.data);
      }

      if (candidatesRes.error) {
        console.error('Erro ao buscar destaques de talentos:', candidatesRes.error);
      } else if (candidatesRes.data) {
        setFeaturedCandidates(candidatesRes.data);
      }
      
      setIsLoadingJobs(false);
      setIsLoadingCandidates(false);
    }
    fetchFeaturedData();
  }, []);

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/vagas?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push('/vagas');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c] font-body selection:bg-[#00628c]/20 selection:text-[#00628c]">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[600px] lg:min-h-[800px] flex items-center overflow-hidden bg-[#fcf9f8] pt-10 lg:pt-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:space-y-8 text-center lg:text-left"
            >
              <span className="inline-block px-4 py-1.5 bg-[#bff444] text-[#141f00] font-bold text-[10px] md:text-xs rounded-full tracking-wider uppercase">
                Dignidade e Conexão
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#1b1c1c] leading-[1.1] tracking-tight font-headline">
                Encontre sua próxima <span className="text-[#bff444]">vaga</span> ou ofereça ajuda
              </h1>
              <p className="text-lg md:text-xl text-[#3e4850] max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Unindo talentos invisíveis a empresas que valorizam o impacto social. Construa carreiras, transforme realidades.
              </p>
              <div className="bg-white p-2 rounded-2xl shadow-xl shadow-[#00628c]/5 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto lg:mx-0 border border-[#bec8d1]/20">
                <div className="flex-1 flex items-center px-4 gap-3 bg-[#f6f3f2] rounded-xl">
                  <Search className="w-5 h-5 text-[#6f7881]" />
                  <input 
                    className="w-full bg-transparent border-none focus:ring-0 outline-none py-4 text-[#1b1c1c] placeholder-[#6f7881] text-sm md:text-base" 
                    placeholder="Procure por 'vagas' ou 'talentos'..." 
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="bg-[#00628c] hover:bg-[#004c6d] text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Pesquisar</span>
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 border-8 border-white">
                <Image 
                  alt="Equipe Profissional" 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                  fill
                  referrerPolicy="no-referrer"
                />
              </div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-12 bg-white p-6 rounded-2xl shadow-xl border border-[#bec8d1]/10 max-w-xs -rotate-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#ffdcc6] flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#964900] fill-current" />
                  </div>
                  <div>
                    <div className="font-bold text-[#1b1c1c]">Impacto Real</div>
                    <div className="text-sm text-[#3e4850]">+500 contratações este mês</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#c8e6ff]/20 -skew-x-12 translate-x-1/4 pointer-events-none"></div>
        </section>

        {/* Destaques do Dia */}
        <section className="py-16 lg:py-24 bg-[#f6f3f2]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#1b1c1c] tracking-tight mb-4 font-headline">Destaques do Dia</h2>
                <p className="text-[#3e4850] text-base lg:text-lg max-w-2xl">Vagas que precisam do seu talento hoje. Aplique agora e mude sua trajetória.</p>
              </div>
              <Link className="group flex items-center gap-2 text-[#00628c] font-bold hover:gap-4 transition-all" href="/vagas">
                Ver todas as vagas <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingJobs ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl animate-pulse border border-[#bec8d1]/10 h-64"></div>
                ))
              ) : featuredJobs.length > 0 ? (
                featuredJobs.map((job, idx) => (
                  <motion.div 
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "bg-white p-8 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 border border-[#bec8d1]/10 flex flex-col h-full",
                      idx === 0 && featuredJobs.length === 3 ? "lg:col-span-1" : ""
                    )}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-[#c8e6ff] flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-[#00628c]" />
                      </div>
                      {idx === 0 && <span className="px-3 py-1 bg-[#bff444] text-[#141f00] text-xs font-bold rounded-full uppercase tracking-wider">Novo</span>}
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-[#1b1c1c] mb-2 font-headline line-clamp-1">{job.title}</h3>
                    <p className="text-[#964900] font-bold text-sm mb-4">{job.company}</p>
                    <p className="text-[#3e4850] mb-6 leading-relaxed line-clamp-3 text-sm flex-grow">{job.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[#3e4850] font-medium mb-8">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#00628c]" /> {job.location}</span>
                      {job.salary && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-[#00628c]" /> {job.salary}</span>}
                    </div>
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="block w-full py-4 bg-[#f0eded] text-[#1b1c1c] font-bold rounded-xl hover:bg-[#00628c] hover:text-white transition-colors text-center"
                    >
                      Detalhes
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-[#bec8d1]/30">
                  <p className="text-[#3e4850]">Nenhuma vaga disponível no momento.</p>
                </div>
              )}
            </div>
          </div>
        </section>

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
                        <DollarSign className="w-3.5 h-3.5 text-[#00628c]" /> {selectedJob.salary || 'A combinar'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#00628c] mb-4">Descrição da Vaga</h3>
                      <p className="text-[#3e4850] leading-relaxed whitespace-pre-wrap text-sm md:text-base">{selectedJob.description}</p>
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

        {/* Talentos que Inspiram */}
        <section id="comunidade" className="py-16 lg:py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-[#bec8d1]/30"></div>
              <span className="text-[#964900] font-bold tracking-widest uppercase text-[10px] md:text-xs">Comunidade</span>
              <div className="h-px flex-1 bg-[#bec8d1]/30"></div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1b1c1c] text-center mb-12 lg:mb-16 tracking-tight font-headline">Talentos que Inspiram</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {isLoadingCandidates ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-[#f6f3f2] animate-pulse"></div>
                ))
              ) : featuredCandidates.length > 0 ? (
                featuredCandidates.map((cand, idx) => (
                  <motion.div 
                    key={cand.id}
                    whileHover={{ y: -10 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "relative group h-full",
                      idx === 1 ? "lg:mt-12" : "",
                      idx === 2 ? "lg:mt-24" : ""
                    )}
                  >
                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-lg relative">
                      <Image 
                        alt={cand.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        src={cand.image || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=600"} 
                        fill
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="bg-white/90 backdrop-blur-md absolute bottom-10 left-6 right-6 p-6 rounded-2xl shadow-lg border border-[#bec8d1]/10">
                      <h3 className="text-xl font-bold text-[#1b1c1c] font-headline">{cand.name}</h3>
                      <p className="text-[#00628c] font-semibold mb-2 line-clamp-1">{cand.role}</p>
                      <div className="flex flex-wrap gap-2">
                        {cand.skills.slice(0, 2).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-[#f0eded] text-[10px] font-bold rounded uppercase">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-[#f6f3f2] rounded-3xl border border-dashed border-[#bec8d1]/30">
                  <p className="text-[#3e4850]">Nenhum talento em destaque no momento.</p>
                </div>
              )}
            </div>
            <div className="mt-16 flex justify-center">
              <Link className="inline-flex items-center gap-2 px-8 py-4 bg-[#00628c] hover:bg-[#004c6d] text-white font-bold rounded-lg transition-all hover:scale-105 shadow-sm group" href="/talentos">
                Ver todos os currículos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section id="como-funciona" className="py-16 lg:py-24 bg-[#f0eded]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1b1c1c] tracking-tight mb-8 font-headline">Como Funciona</h2>
                {/* Tabs */}
                <div className="flex gap-4 md:gap-6 mb-8 lg:mb-12 border-b border-[#bec8d1]/30">
                  <button 
                    onClick={() => setActiveTab('candidatos')}
                    className={`pb-4 font-bold transition-all text-sm md:text-base ${activeTab === 'candidatos' ? 'text-[#00628c] border-b-2 border-[#00628c]' : 'text-[#3e4850] hover:text-[#1b1c1c]'}`}
                  >
                    Para Candidatos
                  </button>
                  <button 
                    onClick={() => setActiveTab('empresas')}
                    className={`pb-4 font-bold transition-all text-sm md:text-base ${activeTab === 'empresas' ? 'text-[#00628c] border-b-2 border-[#00628c]' : 'text-[#3e4850] hover:text-[#1b1c1c]'}`}
                  >
                    Para Empresas
                  </button>
                </div>
                <div className="space-y-12">
                  <AnimatePresence mode="wait">
                    {activeTab === 'candidatos' ? (
                      <motion.div 
                        key="candidatos"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-12"
                      >
                        <div className="flex gap-6">
                          <div className="flex-shrink-0 w-12 h-12 bg-[#00628c] text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
                          <div>
                            <h3 className="text-xl font-bold mb-2 font-headline">Crie seu Perfil</h3>
                            <p className="text-[#3e4850] leading-relaxed">Destaque suas habilidades e experiências, mesmo as informais. Nossa IA ajuda a traduzir seu valor para o mercado.</p>
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <div className="flex-shrink-0 w-12 h-12 bg-[#00628c] text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
                          <div>
                            <h3 className="text-xl font-bold mb-2 font-headline">Busque Oportunidades</h3>
                            <p className="text-[#3e4850] leading-relaxed">Filtre vagas por localização e afinidade. Receba notificações de empresas que valorizam sua história.</p>
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <div className="flex-shrink-0 w-12 h-12 bg-[#00628c] text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
                          <div>
                            <h3 className="text-xl font-bold mb-2 font-headline">Conecte-se e Trabalhe</h3>
                            <p className="text-[#3e4850] leading-relaxed">Agende entrevistas diretamente pela plataforma e receba suporte para sua integração no novo emprego.</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="empresas"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-12"
                      >
                        <div className="flex gap-6">
                          <div className="flex-shrink-0 w-12 h-12 bg-[#964900] text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
                          <div>
                            <h3 className="text-xl font-bold mb-2 font-headline">Anuncie sua Vaga</h3>
                            <p className="text-[#3e4850] leading-relaxed">Publique oportunidades focadas em impacto social. Defina o perfil desejado e alcance talentos qualificados.</p>
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <div className="flex-shrink-0 w-12 h-12 bg-[#964900] text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
                          <div>
                            <h3 className="text-xl font-bold mb-2 font-headline">Analise Currículos</h3>
                            <p className="text-[#3e4850] leading-relaxed">Acesse perfis detalhados e validados. Utilize nossos filtros inteligentes para encontrar o match perfeito.</p>
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <div className="flex-shrink-0 w-12 h-12 bg-[#964900] text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
                          <div>
                            <h3 className="text-xl font-bold mb-2 font-headline">Contrate com Propósito</h3>
                            <p className="text-[#3e4850] leading-relaxed">Transforme sua cultura organizacional através da diversidade e inclusão social real.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-[3rem] p-4 shadow-2xl relative z-10 border border-[#bec8d1]/10">
                  <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden">
                    <Image 
                      alt="Ambiente Colaborativo" 
                      className="object-cover" 
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000" 
                      fill
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#fc820c] rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#007cb0] rounded-full opacity-20 blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section id="comunidade" className="py-16 lg:py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1b1c1c] text-center mb-12 lg:mb-20 tracking-tight font-headline">Depoimentos da Comunidade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Testimonial 1 */}
              <div className="bg-[#f6f3f2] p-10 rounded-[2rem] relative border border-[#bec8d1]/10">
                <Quote className="w-16 h-16 text-[#fc820c] absolute -top-6 left-10 opacity-20 fill-current" />
                <p className="text-xl text-[#1b1c1c] leading-relaxed mb-8 italic relative z-10">
                  &quot;A Corrente do Bem não me deu apenas um emprego, me deu a chance de recomeçar com dignidade. Hoje sou supervisor de manutenção e ajudo outros que estão na mesma situação.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#fc820c]">
                    <Image 
                      alt="Ricardo S." 
                      className="w-full h-full object-cover" 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" 
                      width={56}
                      height={56}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-[#1b1c1c]">Ricardo Souza</div>
                    <div className="text-sm text-[#964900] font-semibold">Ex-candidato, hoje Líder de Equipe</div>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="bg-[#00628c] p-10 rounded-[2rem] relative text-white shadow-xl shadow-[#00628c]/20">
                <Quote className="w-16 h-16 text-white absolute -top-6 left-10 opacity-20 fill-current" />
                <p className="text-xl leading-relaxed mb-8 italic relative z-10">
                  &quot;Como empresa, encontramos talentos com uma garra e vontade de crescer que não víamos em outras plataformas. É um modelo de contratação mais humano e eficiente.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/40">
                    <Image 
                      alt="Helena M." 
                      className="w-full h-full object-cover" 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
                      width={56}
                      height={56}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="font-bold">Helena Machado</div>
                    <div className="text-sm opacity-80 font-semibold">RH da Construtora Aliança</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="bg-gradient-to-r from-[#00628c] to-[#007cb0] rounded-[2rem] lg:rounded-[3.5rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-[#00628c]/30">
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 font-headline">Pronto para fazer parte desta corrente?</h2>
                <p className="text-base lg:text-lg opacity-90 mb-8 lg:mb-10 leading-relaxed">Seja você um profissional em busca de espaço ou uma empresa querendo transformar vidas, seu lugar é aqui.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/talentos/cadastrar" className="bg-white text-[#00628c] px-8 lg:px-10 py-3 lg:py-4 rounded-2xl font-bold text-base lg:text-lg hover:scale-105 transition-transform shadow-lg">
                    Cadastrar Currículo
                  </Link>
                  <Link href="/vagas/cadastrar" className="bg-[#bff444] text-[#141f00] px-8 lg:px-10 py-3 lg:py-4 rounded-2xl font-bold text-base lg:text-lg hover:scale-105 transition-transform shadow-lg">
                    Anunciar uma Vaga
                  </Link>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#fc820c]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f6f3f2] border-t border-[#bec8d1]/20 py-12 lg:py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 max-w-7xl mx-auto">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="text-xl font-bold text-[#00628c] mb-6 font-headline">Corrente do Bem</div>
            <p className="text-sm leading-relaxed text-[#3e4850]">
              Nossa missão é conectar pessoas em situação de vulnerabilidade a oportunidades reais de trabalho, promovendo autonomia e dignidade através do emprego.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#00628c] mb-6 uppercase text-xs tracking-widest">Navegação</h4>
            <ul className="space-y-4 text-sm">
              <li><Link className="text-[#3e4850] hover:text-[#00628c] transition-colors" href="/vagas">Sobre Nós</Link></li>
              <li><Link className="text-[#3e4850] hover:text-[#00628c] transition-colors" href="/talentos">Histórias de Sucesso</Link></li>
              <li><Link className="text-[#3e4850] hover:text-[#00628c] transition-colors" href="/vagas">Relatório de Impacto 2024</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#00628c] mb-6 uppercase text-xs tracking-widest">Suporte</h4>
            <ul className="space-y-4 text-sm">
              <li><Link className="text-[#3e4850] hover:text-[#00628c] transition-colors" href="/vagas">Central de Ajuda</Link></li>
              <li><Link className="text-[#3e4850] hover:text-[#00628c] transition-colors" href="/vagas">Termos de Uso</Link></li>
              <li><Link className="text-[#3e4850] hover:text-[#00628c] transition-colors" href="/vagas">Privacidade</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#00628c] mb-6 uppercase text-xs tracking-widest">Social</h4>
            <div className="flex gap-4">
              <Link className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00628c] hover:bg-[#00628c] hover:text-white transition-all shadow-sm" href="#">
                <Share2 className="w-5 h-5" />
              </Link>
              <Link className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00628c] hover:bg-[#00628c] hover:text-white transition-all shadow-sm" href="#">
                <Globe className="w-5 h-5" />
              </Link>
            </div>
            <div className="mt-8">
              <div className="text-xs text-[#6f7881] mb-2 italic">Assine nossa newsletter</div>
              <div className="flex gap-2">
                <input className="bg-white border border-[#bec8d1]/30 rounded-lg text-xs px-3 py-2 w-full focus:ring-1 focus:ring-[#00628c] outline-none" placeholder="Seu e-mail" type="email"/>
                <button className="bg-[#00628c] text-white px-4 py-2 rounded-lg text-xs font-bold">Ok</button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#bec8d1]/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#3e4850]">© 2026 Corrente do Bem. Dignidade e Conexão Humana.</p>
          <div className="flex items-center gap-2 text-xs font-bold text-[#964900]">
            <Handshake className="w-4 h-4" />
            Feito com propósito social
          </div>
        </div>
      </footer>
    </div>
  );
}
