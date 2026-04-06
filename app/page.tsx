'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  FileText, 
  History, 
  Settings, 
  Search, 
  Bell, 
  HelpCircle, 
  Briefcase, 
  Palette, 
  Megaphone, 
  DollarSign,
  CheckCircle2,
  XCircle,
  X,
  Mail,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Verified,
  ExternalLink,
  Share2,
  Bookmark,
  MapPin,
  Clock,
  Zap,
  HeartHandshake,
  Loader2,
  Edit,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

// --- Types ---

type View = 'vagas' | 'curriculos' | 'historico' | 'configuracoes' | 'galeria' | 'galeria_vagas' | 'recusados';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  status: 'pending' | 'active' | 'rejected' | 'closed';
  date?: string;
  time?: string;
  salary: string;
  description: string;
  requirements: string[];
  verified?: boolean;
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

interface HistoryItem {
  id: string;
  action: string;
  details: string;
  created_at: string;
}

// --- Mock Data ---

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Desenvolvedor Frontend Sênior',
    company: 'Tech Solutions Inc.',
    location: 'Remoto / Brasil',
    type: 'Tempo Integral',
    status: 'pending',
    date: '12 Out, 2023',
    time: '14:30',
    salary: 'R$ 12k - 16k',
    description: 'Buscamos uma pessoa apaixonada por interfaces modernas e performance. Você será responsável por liderar o desenvolvimento de nossos novos dashboards administrativos utilizando React, Tailwind CSS e integração com APIs RESTful.',
    requirements: ['5+ anos de experiência com React.', 'Domínio de TypeScript e Tailwind CSS.', 'Experiência com testes unitários (Jest/Cypress).'],
    verified: true
  },
  {
    id: '2',
    title: 'UI/UX Designer Pleno',
    company: 'Creative Minds Studio',
    location: 'São Paulo, SP • Híbrido',
    type: 'Híbrido',
    status: 'pending',
    date: '11 Out, 2023',
    time: '09:15',
    salary: 'R$ 8k - 11k',
    description: 'Responsável por criar experiências incríveis para nossos usuários mobile e web.',
    requirements: ['3+ anos de experiência.', 'Figma expert.', 'Conhecimento em Design Systems.']
  },
  {
    id: '3',
    title: 'Analista de Marketing Digital',
    company: 'Varejo Global S.A.',
    location: 'Rio de Janeiro, RJ • Presencial',
    type: 'Presencial',
    status: 'pending',
    date: '10 Out, 2023',
    time: '17:45',
    salary: 'R$ 5k - 7k',
    description: 'Foco em performance e crescimento orgânico.',
    requirements: ['Experiência com SEO/SEM.', 'Análise de dados.', 'Gestão de redes sociais.']
  },
  {
    id: '4',
    title: 'Gerente de Contas',
    company: 'Fintech Inovadora',
    location: 'Remoto • PJ',
    type: 'PJ',
    status: 'pending',
    date: '10 Out, 2023',
    time: '11:20',
    salary: 'R$ 10k + comissão',
    description: 'Gestão de carteira de clientes B2B.',
    requirements: ['Experiência em vendas consultivas.', 'Networking no setor financeiro.']
  }
];

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Ana Paula Castro',
    location: 'São Paulo, SP',
    area: 'Desenvolvimento Web',
    date: '12 Out, 2023',
    status: 'pending',
    role: 'Desenvolvedora Full Stack Pleno',
    summary: 'Desenvolvedora com mais de 5 anos de experiência em tecnologias JavaScript (React, Node.js). Especialista em criar arquiteturas escaláveis e foco total em experiência do usuário e acessibilidade.',
    skills: ['React & Next.js', 'TypeScript', 'Node.js (API Rest)', 'PostgreSQL', 'UI Design Systems', 'CI/CD Pipeline'],
    image: 'https://picsum.photos/seed/ana/200/200',
    verified: true
  },
  {
    id: '2',
    name: 'Bruno Lima',
    location: 'Rio de Janeiro, RJ',
    area: 'UI/UX Design',
    date: '11 Out, 2023',
    status: 'pending',
    role: 'Product Designer',
    summary: 'Especialista em interfaces intuitivas e centradas no usuário.',
    skills: ['Figma', 'Prototipagem', 'User Research'],
    image: 'https://picsum.photos/seed/bruno/200/200'
  },
  {
    id: '3',
    name: 'Carla Mendes',
    location: 'Belo Horizonte, MG',
    area: 'Marketing Digital',
    date: '10 Out, 2023',
    status: 'pending',
    role: 'Growth Hacker',
    summary: 'Focada em métricas e escala de negócios digitais.',
    skills: ['SEO', 'Google Ads', 'Copywriting'],
    image: 'https://picsum.photos/seed/carla/200/200'
  }
];

// --- Components ---

const Sidebar = ({ activeView, setView }: { activeView: View, setView: (v: View) => void }) => (
  <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-outline-variant/20 flex flex-col py-6 z-50">
    <div className="px-6 mb-10 flex items-center gap-3">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
        <HeartHandshake className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-primary leading-none font-headline">Corrente do Bem</h2>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">Painel Administrativo</p>
      </div>
    </div>

    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
      {[
        { id: 'vagas', label: 'Vagas Pendentes', icon: <Clock className="w-5 h-5" /> },
        { id: 'curriculos', label: 'Currículos Pendentes', icon: <FileText className="w-5 h-5" /> },
        { id: 'galeria_vagas', label: 'Galeria de Vagas', icon: <Briefcase className="w-5 h-5" /> },
        { id: 'galeria', label: 'Galeria de Talentos', icon: <LayoutGrid className="w-5 h-5" /> },
        { id: 'recusados', label: 'Recusados', icon: <XCircle className="w-5 h-5" /> },
        { id: 'historico', label: 'Histórico', icon: <History className="w-5 h-5" /> },
        { id: 'configuracoes', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id as View)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            activeView === item.id 
              ? "bg-primary/5 text-primary font-bold border-r-4 border-primary" 
              : "text-on-surface-variant hover:bg-surface-container-low"
          )}
        >
          <span className={cn("transition-transform group-hover:scale-110", activeView === item.id && "text-primary")}>
            {item.icon}
          </span>
          <span className="text-sm">{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="px-6 mt-auto">
      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center">
        <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Sistema Ativo</p>
      </div>
    </div>
  </aside>
);

const Header = () => (
  <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-white/80 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center px-8">
    <div className="flex items-center w-full max-w-md">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
        <input 
          type="text" 
          placeholder="Buscar vagas ou empresas..." 
          className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
    </div>
    <div className="flex items-center gap-6">
      <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low">
        <Bell className="w-5 h-5" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
      </button>
      <div className="h-8 w-[1px] bg-outline-variant/30"></div>
      <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-container-low transition-all group">
        <span className="text-sm font-semibold text-primary">Painel Geral</span>
        <LayoutGrid className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  </header>
);

export default function Dashboard() {
  const [activeView, setView] = useState<View>('vagas');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  
  const [talentSearch, setTalentSearch] = useState('');
  const [talentCategory, setTalentCategory] = useState('Todos os Talentos');
  const [jobSearch, setJobSearch] = useState('');
  const [jobCategory, setJobCategory] = useState('Todas as Vagas');

  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject' | 'delete' | 'edit';
    target: 'job' | 'candidate';
    id: string;
    payload?: any;
  } | null>(null);

  // Fetch Data
  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [jobsRes, candidatesRes, historyRes] = await Promise.all([
        supabase.from('jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('candidates').select('*').order('created_at', { ascending: false }),
        supabase.from('history').select('*').order('created_at', { ascending: false })
      ]);

      if (jobsRes.data) setJobs(jobsRes.data);
      if (candidatesRes.data) setCandidates(candidatesRes.data);
      if (historyRes.data) setHistory(historyRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CRUD Actions
  const approveJob = React.useCallback(async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    const { error } = await supabase
      .from('jobs')
      .update({ status: 'active' })
      .eq('id', id);

    if (!error) {
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'active' } : j));
      
      const historyEntry = {
        action: 'Vaga Aprovada',
        details: `Vaga "${job.title}" da empresa "${job.company}" foi aprovada.`
      };
      
      const { data: hData } = await supabase.from('history').insert(historyEntry).select().single();
      if (hData) setHistory(prev => [hData, ...prev]);
      
      setSelectedJob(null);
      setConfirmAction(null);
    }
  }, [jobs]);

  const rejectJob = React.useCallback(async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    const { error } = await supabase
      .from('jobs')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (!error) {
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'rejected' } : j));
      
      const historyEntry = {
        action: 'Vaga Recusada',
        details: `Vaga "${job.title}" da empresa "${job.company}" foi recusada.`
      };
      
      const { data: hData } = await supabase.from('history').insert(historyEntry).select().single();
      if (hData) setHistory(prev => [hData, ...prev]);
      
      setSelectedJob(null);
      setConfirmAction(null);
    }
  }, [jobs]);

  const deleteJob = React.useCallback(async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (!error) {
      setJobs(prev => prev.filter(j => j.id !== id));
      
      const historyEntry = {
        action: 'Vaga Removida',
        details: `Vaga "${job.title}" foi removida manualmente.`
      };
      
      const { data: hData } = await supabase.from('history').insert(historyEntry).select().single();
      if (hData) setHistory(prev => [hData, ...prev]);
    }
  }, [jobs]);

  const approveCandidate = React.useCallback(async (id: string) => {
    const cand = candidates.find(c => c.id === id);
    if (!cand) return;

    const { error } = await supabase
      .from('candidates')
      .update({ status: 'approved' })
      .eq('id', id);

    if (!error) {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
      
      const historyEntry = {
        action: 'Currículo Aprovado',
        details: `Currículo de "${cand.name}" foi aprovado.`
      };
      
      const { data: hData } = await supabase.from('history').insert(historyEntry).select().single();
      if (hData) setHistory(prev => [hData, ...prev]);
      
      setSelectedCandidate(null);
      setConfirmAction(null);
    }
  }, [candidates]);

  const rejectCandidate = React.useCallback(async (id: string) => {
    const cand = candidates.find(c => c.id === id);
    if (!cand) return;

    const { error } = await supabase
      .from('candidates')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (!error) {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
      
      const historyEntry = {
        action: 'Currículo Recusado',
        details: `Currículo de "${cand.name}" foi recusado.`
      };
      
      const { data: hData } = await supabase.from('history').insert(historyEntry).select().single();
      if (hData) setHistory(prev => [hData, ...prev]);
      
      setSelectedCandidate(null);
      setConfirmAction(null);
    }
  }, [candidates]);

  const addJob = React.useCallback(async (newJob: Partial<Job>) => {
    const jobData = {
      title: newJob.title || 'Nova Vaga',
      company: newJob.company || 'Empresa',
      location: newJob.location || 'Remoto',
      type: newJob.type || 'Tempo Integral',
      status: 'active',
      salary: newJob.salary || 'A combinar',
      description: newJob.description || '',
      requirements: newJob.requirements || [],
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    if (data && !error) {
      setJobs(prev => [data, ...prev]);
      setIsAddingJob(false);
      
      const historyEntry = {
        action: 'Vaga Criada',
        details: `Vaga "${data.title}" foi criada manualmente.`
      };
      const { data: hData } = await supabase.from('history').insert(historyEntry).select().single();
      if (hData) setHistory(prev => [hData, ...prev]);
    }
  }, []);

  const updateJob = React.useCallback(async (updatedJob: Job) => {
    const { data, error } = await supabase
      .from('jobs')
      .update({
        title: updatedJob.title,
        company: updatedJob.company,
        location: updatedJob.location,
        type: updatedJob.type,
        salary: updatedJob.salary,
        description: updatedJob.description,
        requirements: updatedJob.requirements,
      })
      .eq('id', updatedJob.id)
      .select()
      .single();

    if (data && !error) {
      setJobs(prev => prev.map(j => j.id === data.id ? data : j));
      setEditingJob(null);
      setConfirmAction(null);
      
      const historyEntry = {
        action: 'Vaga Editada',
        details: `Vaga "${data.title}" foi editada manualmente.`
      };
      const { data: hData } = await supabase.from('history').insert(historyEntry).select().single();
      if (hData) setHistory(prev => [hData, ...prev]);
    }
  }, []);

  const deleteCandidate = React.useCallback(async (id: string) => {
    const cand = candidates.find(c => c.id === id);
    if (!cand) return;

    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);

    if (!error) {
      setCandidates(prev => prev.filter(c => c.id !== id));
      setConfirmAction(null);
      
      const historyEntry = {
        action: 'Candidato Removido',
        details: `Currículo de "${cand.name}" foi removido manualmente.`
      };
      const { data: hData } = await supabase.from('history').insert(historyEntry).select().single();
      if (hData) setHistory(prev => [hData, ...prev]);
    }
  }, [candidates]);

  const updateCandidate = React.useCallback(async (updatedCand: Candidate) => {
    const { data, error } = await supabase
      .from('candidates')
      .update({
        name: updatedCand.name,
        location: updatedCand.location,
        area: updatedCand.area,
        role: updatedCand.role,
        summary: updatedCand.summary,
        skills: updatedCand.skills,
      })
      .eq('id', updatedCand.id)
      .select()
      .single();

    if (data && !error) {
      setCandidates(prev => prev.map(c => c.id === data.id ? data : c));
      setEditingCandidate(null);
      setConfirmAction(null);
      
      const historyEntry = {
        action: 'Candidato Editado',
        details: `Currículo de "${data.name}" foi editado manualmente.`
      };
      const { data: hData } = await supabase.from('history').insert(historyEntry).select().single();
      if (hData) setHistory(prev => [hData, ...prev]);
    }
  }, []);

  return (
    <div className="min-h-screen flex">
      <Sidebar activeView={activeView} setView={setView} />
      
      <main className="ml-64 pt-16 flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-40 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm font-bold text-primary animate-pulse uppercase tracking-widest">Sincronizando Dados...</p>
                </div>
              </div>
            )}
            {activeView === 'vagas' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <header className="flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Vagas Pendentes</h1>
                    <p className="text-on-surface-variant mt-1">Gerencie e analise as solicitações de novas vagas na plataforma.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="px-4 py-2 bg-tertiary-fixed text-on-tertiary-fixed font-bold rounded-full text-xs flex items-center gap-2 shadow-sm">
                      <Zap className="w-4 h-4 fill-current" />
                      {jobs.filter(j => j.status === 'pending').length} Pendentes Hoje
                    </span>
                  </div>
                </header>

                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low border-b border-outline-variant/10">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Vaga / Cargo</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Empresa</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Data de Envio</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {jobs.filter(j => j.status === 'pending').map((job) => (
                        <tr 
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className={cn(
                            "hover:bg-primary/5 transition-all cursor-pointer group",
                            selectedJob?.id === job.id ? "bg-primary/5 border-l-4 border-primary" : "border-l-4 border-transparent"
                          )}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                selectedJob?.id === job.id ? "bg-primary text-on-primary" : "bg-surface-container text-outline group-hover:bg-primary/20 group-hover:text-primary"
                              )}>
                                <Briefcase className="w-5 h-5" />
                              </div>
                              <div>
                                <p className={cn("font-bold", selectedJob?.id === job.id ? "text-primary" : "text-on-surface")}>{job.title}</p>
                                <p className="text-xs text-on-surface-variant">{job.location} • {job.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{job.company}</span>
                              {job.verified && <Verified className="w-4 h-4 text-tertiary fill-current" />}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-on-surface-variant">
                            {job.date || 'Hoje'} • {job.time || 'Agora'}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button className={cn(
                              "px-4 py-2 text-xs font-bold rounded-xl transition-all active:scale-95",
                              selectedJob?.id === job.id 
                                ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                                : "bg-surface-container-high text-on-surface hover:bg-primary/10 hover:text-primary"
                            )}>
                              Analisar
                            </button>
                          </td>
                        </tr>
                      ))}
                      {jobs.filter(j => j.status === 'pending').length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-on-surface-variant">
                            Nenhuma vaga pendente no momento.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeView === 'curriculos' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <header className="flex justify-between items-end">
                  <div>
                    <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Central de Talentos</span>
                    <h1 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">
                      Currículos <span className="text-primary italic">Pendentes</span>
                    </h1>
                    <p className="text-on-surface-variant mt-2 max-w-xl">Analise e aprove novos candidatos para a rede. Cada currículo é uma oportunidade de transformar uma carreira.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-tertiary-fixed flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-tertiary-fixed/20 flex items-center justify-center text-tertiary">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-on-surface leading-tight">{candidates.filter(c => c.status === 'pending').length}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Aguardando Revisão</p>
                    </div>
                  </div>
                </header>

                <div className="bg-white rounded-2xl p-2 shadow-sm border border-outline-variant/10">
                  <table className="w-full text-left border-separate border-spacing-y-2 px-2">
                    <thead className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                      <tr>
                        <th className="px-4 py-4">Candidato</th>
                        <th className="px-4 py-4">Área</th>
                        <th className="px-4 py-4">Data</th>
                        <th className="px-4 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {candidates.filter(c => c.status === 'pending').map((c) => (
                        <tr 
                          key={c.id}
                          onClick={() => setSelectedCandidate(c)}
                          className={cn(
                            "group hover:bg-surface-container-low transition-all cursor-pointer rounded-xl",
                            selectedCandidate?.id === c.id ? "bg-surface-container-low" : "bg-surface-container-low/30"
                          )}
                        >
                          <td className="px-4 py-4 rounded-l-xl">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm">
                                <Image src={c.image} alt={c.name} fill className="object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <p className="font-bold text-on-surface">{c.name}</p>
                                <p className="text-[11px] text-on-surface-variant">{c.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">{c.area}</span>
                          </td>
                          <td className="px-4 py-4 text-on-surface-variant font-medium">{c.date || 'Hoje'}</td>
                          <td className="px-4 py-4 rounded-r-xl">
                            <div className="flex items-center gap-1 text-secondary font-bold text-xs italic uppercase">
                              <span className="w-2 h-2 rounded-full bg-secondary"></span>
                              Pendente
                            </div>
                          </td>
                        </tr>
                      ))}
                      {candidates.filter(c => c.status === 'pending').length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-on-surface-variant">
                            Nenhum currículo pendente no momento.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeView === 'galeria_vagas' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Galeria de Vagas</h1>
                    <p className="text-on-surface-variant mt-1">Gerencie as vagas ativas no site. Adicione novas ou remova as encerradas.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                      <input 
                        type="text" 
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                        placeholder="Buscar vaga..." 
                        className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant/20 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    <button 
                      onClick={() => setIsAddingJob(true)}
                      className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 text-sm"
                    >
                      <Briefcase className="w-4 h-4" />
                      Nova Vaga
                    </button>
                  </div>
                </header>

                <nav className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
                  {['Todas as Vagas', 'Tempo Integral', 'Meio Período', 'PJ / Freelance'].map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setJobCategory(cat)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                        jobCategory === cat ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {jobs
                    .filter(j => j.status === 'active')
                    .filter(j => jobCategory === 'Todas as Vagas' || j.type === jobCategory)
                    .filter(j => j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.company.toLowerCase().includes(jobSearch.toLowerCase()))
                    .map((job) => (
                    <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <button 
                          onClick={() => setConfirmAction({ type: 'delete', target: 'job', id: job.id })}
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{job.title}</h3>
                      <p className="text-primary font-semibold text-sm mb-3">{job.company}</p>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                          <Clock className="w-3 h-3" />
                          {job.type}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10">
                        <span className="text-xs font-bold text-tertiary uppercase">ATIVA</span>
                        <button 
                          onClick={() => setEditingJob(job)}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  ))}
                  {jobs.filter(j => j.status === 'active').length === 0 && (
                    <div className="col-span-full py-12 text-center text-on-surface-variant">
                      Nenhuma vaga ativa na galeria.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeView === 'recusados' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <header>
                  <h1 className="text-3xl font-extrabold text-error tracking-tight font-headline">Itens Recusados</h1>
                  <p className="text-on-surface-variant mt-1">Visualize vagas e candidatos que não foram aprovados.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <section className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Vagas Recusadas
                    </h2>
                    <div className="space-y-3">
                      {jobs.filter(j => j.status === 'rejected').map(job => (
                        <div key={job.id} className="p-4 bg-white rounded-2xl border border-outline-variant/10 shadow-sm flex justify-between items-center">
                          <div>
                            <p className="font-bold text-on-surface">{job.title}</p>
                            <p className="text-xs text-on-surface-variant">{job.company}</p>
                          </div>
                          <button 
                            onClick={() => setConfirmAction({ type: 'approve', target: 'job', id: job.id })}
                            className="text-xs font-bold text-primary hover:underline"
                          >
                            Reavaliar
                          </button>
                        </div>
                      ))}
                      {jobs.filter(j => j.status === 'rejected').length === 0 && (
                        <p className="text-sm text-on-surface-variant italic">Nenhuma vaga recusada.</p>
                      )}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Candidatos Recusados
                    </h2>
                    <div className="space-y-3">
                      {candidates.filter(c => c.status === 'rejected').map(cand => (
                        <div key={cand.id} className="p-4 bg-white rounded-2xl border border-outline-variant/10 shadow-sm flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                              <Image src={cand.image} alt={cand.name} fill className="object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <p className="font-bold text-on-surface">{cand.name}</p>
                              <p className="text-xs text-on-surface-variant">{cand.role}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setConfirmAction({ type: 'approve', target: 'candidate', id: cand.id })}
                            className="text-xs font-bold text-primary hover:underline"
                          >
                            Reavaliar
                          </button>
                        </div>
                      ))}
                      {candidates.filter(c => c.status === 'rejected').length === 0 && (
                        <p className="text-sm text-on-surface-variant italic">Nenhum candidato recusado.</p>
                      )}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}
            
            {activeView === 'historico' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <header>
                  <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Histórico de Ações</h1>
                  <p className="text-on-surface-variant mt-1">Acompanhe todas as atividades de moderação realizadas no painel.</p>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
                  <div className="divide-y divide-outline-variant/10">
                    {history.length > 0 ? history.map((item) => (
                      <div key={item.id} className="p-6 hover:bg-surface-container-low transition-colors flex gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          item.action.includes('Aprovada') || item.action.includes('Aprovado') ? "bg-tertiary/10 text-tertiary" : 
                          item.action.includes('Recusada') || item.action.includes('Recusado') ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
                        )}>
                          <History className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-bold text-on-surface">{item.action}</p>
                            <span className="text-xs text-on-surface-variant">{new Date(item.created_at).toLocaleString('pt-BR')}</span>
                          </div>
                          <p className="text-sm text-on-surface-variant">{item.details}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="p-12 text-center text-on-surface-variant">
                        Nenhuma ação registrada ainda.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'galeria' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="max-w-2xl">
                    <h1 className="text-5xl font-extrabold tracking-tight text-primary mb-4 font-headline">Galeria de Talentos</h1>
                    <p className="text-on-surface-variant text-lg">Conecte-se com profissionais excepcionais prontos para transformar sua empresa com dignidade e competência.</p>
                  </div>
                  <div className="w-full md:w-96">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                      <input 
                        type="text" 
                        value={talentSearch}
                        onChange={(e) => setTalentSearch(e.target.value)}
                        placeholder="Buscar por nome ou competência..." 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-surface-container-highest focus:bg-white focus:ring-2 focus:ring-primary/40 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </header>

                <nav className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                  {['Todos os Talentos', 'Tecnologia', 'Saúde', 'Finanças', 'Engenharia & Arquitetura', 'Autônomos'].map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setTalentCategory(cat)}
                      className={cn(
                        "px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all",
                        talentCategory === cat ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>

                <div className="flex flex-col lg:flex-row gap-12">
                  <aside className="w-full lg:w-72 space-y-10">
                    <div>
                      <h3 className="font-headline font-bold text-lg mb-6">Disponibilidade</h3>
                      <div className="space-y-4">
                        {['Imediata', 'Em 15 dias', 'Em 30 dias'].map(d => (
                          <label key={d} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5" />
                            <span className="text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">{d}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-lg mb-6">Localização</h3>
                      <div className="space-y-4">
                        {['Remoto', 'Híbrido', 'Presencial'].map(l => (
                          <label key={l} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" defaultChecked={l === 'Remoto'} className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5" />
                            <span className="text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">{l}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </aside>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {candidates
                      .filter(c => c.status === 'approved')
                      .filter(c => talentCategory === 'Todos os Talentos' || c.area.includes(talentCategory) || (talentCategory === 'Tecnologia' && c.area.includes('Desenvolvimento')))
                      .filter(c => c.name.toLowerCase().includes(talentSearch.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(talentSearch.toLowerCase())))
                      .map((cand) => (
                      <div key={cand.id} className="bg-surface-container-low rounded-3xl p-6 hover:bg-white transition-all duration-300 border border-outline-variant/10 group relative">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingCandidate(cand)}
                            className="p-2 bg-white rounded-full shadow-sm text-primary hover:bg-primary hover:text-white transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setConfirmAction({ type: 'delete', target: 'candidate', id: cand.id })}
                            className="p-2 bg-white rounded-full shadow-sm text-error hover:bg-error hover:text-white transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-4 mb-6">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-md">
                            <Image src={cand.image} alt={cand.name} fill className="object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-widest">{cand.area}</span>
                            <h4 className="text-xl font-bold mt-1 font-headline">{cand.name}</h4>
                            <p className="text-primary text-sm font-medium">{cand.role}</p>
                          </div>
                        </div>
                        <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{cand.summary}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-on-surface-variant text-xs gap-1 font-medium">
                            <MapPin className="w-3 h-3" />
                            {cand.location}
                          </div>
                          <button 
                            onClick={() => setSelectedCandidate(cand)}
                            className="text-primary font-bold text-sm hover:underline decoration-2 underline-offset-4"
                          >
                            Ver Currículo
                          </button>
                        </div>
                      </div>
                    ))}
                    {candidates.filter(c => c.status === 'approved').length === 0 && (
                      <div className="col-span-2 p-12 text-center text-on-surface-variant">
                        Nenhum talento aprovado na galeria ainda.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'configuracoes' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 max-w-4xl"
              >
                <header>
                  <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Configurações do Sistema</h1>
                  <p className="text-on-surface-variant mt-1">Gerencie as preferências globais da plataforma HumanConnect.</p>
                </header>

                <div className="grid grid-cols-1 gap-6">
                  <section className="bg-white p-8 rounded-3xl border border-outline-variant/10 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      Geral
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase">Nome da Plataforma</label>
                        <input defaultValue="HumanConnect" className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase">E-mail de Contato</label>
                        <input defaultValue="contato@humanconnect.com.br" className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" />
                      </div>
                    </div>
                  </section>

                  <section className="bg-white p-8 rounded-3xl border border-outline-variant/10 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      Segurança & Moderação
                    </h2>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5" />
                        <div>
                          <p className="font-bold text-on-surface">Aprovação Manual Obrigatória</p>
                          <p className="text-xs text-on-surface-variant">Novas vagas e currículos devem ser aprovados por um administrador.</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5" />
                        <div>
                          <p className="font-bold text-on-surface">Notificações Automáticas</p>
                          <p className="text-xs text-on-surface-variant">Enviar e-mails automáticos após aprovação ou recusa.</p>
                        </div>
                      </label>
                    </div>
                  </section>

                  <div className="flex justify-end">
                    <button className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                      Salvar Configurações
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {isAddingJob && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-outline-variant/10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary font-headline">Cadastrar Nova Vaga</h2>
                  <button onClick={() => setIsAddingJob(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                    <XCircle className="w-6 h-6 text-on-surface-variant" />
                  </button>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addJob({
                    title: formData.get('title') as string,
                    company: formData.get('company') as string,
                    location: formData.get('location') as string,
                    type: formData.get('type') as string,
                    salary: formData.get('salary') as string,
                    description: formData.get('description') as string,
                    requirements: (formData.get('requirements') as string).split('\n').filter(r => r.trim()),
                  });
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase">Título da Vaga</label>
                      <input name="title" required className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" placeholder="Ex: Desenvolvedor React" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase">Empresa</label>
                      <input name="company" required className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" placeholder="Nome da empresa" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase">Localização</label>
                      <input name="location" required className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" placeholder="Ex: Remoto" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase">Tipo</label>
                      <select name="type" className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none">
                        <option>Tempo Integral</option>
                        <option>Meio Período</option>
                        <option>PJ / Freelance</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase">Salário</label>
                      <input name="salary" className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" placeholder="Ex: R$ 5.000" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase">Descrição</label>
                    <textarea name="description" rows={3} className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" placeholder="Descreva a vaga..."></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase">Requisitos (um por linha)</label>
                    <textarea name="requirements" rows={3} className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" placeholder="Ex: React&#10;TypeScript&#10;Tailwind"></textarea>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsAddingJob(false)} className="flex-1 py-3 px-4 bg-surface-container-highest text-on-surface rounded-xl font-bold hover:bg-surface-container transition-all">Cancelar</button>
                    <button type="submit" className="flex-1 py-3 px-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Publicar Vaga</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Right Panel (Contextual Detail) */}
          <AnimatePresence mode="wait">
            {(activeView === 'vagas' && selectedJob) && (
              <motion.aside 
                key={`job-${selectedJob.id}`}
                initial={{ x: 450 }}
                animate={{ x: 0 }}
                exit={{ x: 450 }}
                className="w-[450px] bg-white border-l border-outline-variant/10 p-8 overflow-y-auto shadow-2xl relative z-30"
              >
                <div className="flex justify-between items-start mb-6">
                  <button 
                    onClick={() => setSelectedJob(null)}
                    className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <span className="px-3 py-1 bg-secondary-container/20 text-secondary font-bold text-[10px] uppercase tracking-wider rounded-full">Pendente</span>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-4 border-surface-container shadow-sm">
                      <Image src="https://picsum.photos/seed/company/200/200" alt="Logo" fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-on-surface leading-tight font-headline">{selectedJob.title}</h2>
                      <p className="text-primary font-bold">{selectedJob.company}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Localização</p>
                      <p className="text-sm font-bold">{selectedJob.location}</p>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Salário</p>
                      <p className="text-sm font-bold">{selectedJob.salary}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 mb-10">
                  <section>
                    <h3 className="text-xs uppercase font-bold text-primary mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Descrição da Vaga
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{selectedJob.description}</p>
                  </section>
                  <section>
                    <h3 className="text-xs uppercase font-bold text-primary mb-3 flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" />
                      Requisitos
                    </h3>
                    <ul className="text-sm text-on-surface-variant space-y-3">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20">
                  <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Ações de Moderação
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-extrabold text-on-surface-variant mb-2 block ml-1">Justificativa da Recusa</label>
                      <textarea 
                        className="w-full bg-white border-outline-variant/30 rounded-2xl text-sm p-4 focus:ring-primary focus:border-primary min-h-[120px] transition-all" 
                        placeholder="Explique o motivo para que a empresa possa corrigir a vaga..."
                      />
                    </div>
                    <div className="flex items-center gap-3 px-1">
                      <input type="checkbox" id="notify" defaultChecked className="rounded text-primary focus:ring-primary w-5 h-5" />
                      <label htmlFor="notify" className="text-xs font-bold text-on-surface">Notificar por e-mail</label>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <button 
                        onClick={() => setConfirmAction({ type: 'reject', target: 'job', id: selectedJob.id })}
                        className="py-4 px-4 bg-error text-on-error rounded-2xl font-bold text-sm hover:brightness-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-error/20"
                      >
                        <XCircle className="w-5 h-5" />
                        Recusar
                      </button>
                      <button 
                        onClick={() => setConfirmAction({ type: 'approve', target: 'job', id: selectedJob.id })}
                        className="py-4 px-4 bg-primary text-on-primary rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-v from-primary to-primary-container"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Aprovar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}

            {(activeView === 'curriculos' && selectedCandidate) && (
              <motion.aside 
                key={`candidate-${selectedCandidate.id}`}
                initial={{ x: 450 }}
                animate={{ x: 0 }}
                exit={{ x: 450 }}
                className="w-[450px] bg-white border-l border-outline-variant/10 p-8 overflow-y-auto shadow-2xl relative z-30"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-xl">
                      <Image src={selectedCandidate.image} alt={selectedCandidate.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      {selectedCandidate.verified && (
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-tertiary-fixed flex items-center justify-center border-4 border-white">
                          <Verified className="w-4 h-4 text-on-tertiary-fixed fill-current" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold text-on-surface leading-tight font-headline">{selectedCandidate.name}</h3>
                      <p className="text-on-surface-variant font-medium text-sm">{selectedCandidate.role}</p>
                      <div className="flex gap-3 mt-3">
                        <ExternalLink className="w-4 h-4 text-primary cursor-pointer hover:scale-110 transition-transform" />
                        <Share2 className="w-4 h-4 text-primary cursor-pointer hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCandidate(null)} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8 mb-10">
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Resumo do Perfil</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{selectedCandidate.summary}</p>
                  </section>
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Competências Principais</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-surface-container rounded-xl text-xs font-bold text-on-surface border border-outline-variant/10">{s}</span>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="bg-surface-container-low rounded-3xl p-6 space-y-6 border border-outline-variant/10">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 ml-1">Justificativa da Decisão</label>
                    <textarea 
                      className="w-full bg-white border-outline-variant/30 rounded-2xl text-sm p-4 focus:ring-primary focus:border-primary min-h-[100px] transition-all" 
                      placeholder="Insira uma observação ou motivo da recusa/aprovação..."
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-1">
                      <input type="checkbox" id="notify-cand" defaultChecked className="rounded text-primary focus:ring-primary w-5 h-5" />
                      <label htmlFor="notify-cand" className="text-xs font-bold text-on-surface-variant">Enviar e-mail de notificação para a candidata</label>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setConfirmAction({ type: 'reject', target: 'candidate', id: selectedCandidate.id })}
                        className="flex-1 py-4 px-4 bg-error-container text-on-error-container hover:bg-error/10 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Recusar
                      </button>
                      <button 
                        onClick={() => setConfirmAction({ type: 'approve', target: 'candidate', id: selectedCandidate.id })}
                        className="flex-1 py-4 px-4 bg-primary text-on-primary hover:shadow-lg hover:shadow-primary/30 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 bg-gradient-to-v from-primary to-primary-container"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Aprovar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </main>

      {editingJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-outline-variant/10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary font-headline">Editar Vaga</h2>
              <button onClick={() => setEditingJob(null)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                <XCircle className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updatedJob = {
                ...editingJob,
                title: formData.get('title') as string,
                company: formData.get('company') as string,
                location: formData.get('location') as string,
                type: formData.get('type') as string,
                salary: formData.get('salary') as string,
                description: formData.get('description') as string,
                requirements: (formData.get('requirements') as string).split('\n').filter(r => r.trim()),
              };
              setConfirmAction({ type: 'edit', target: 'job', id: editingJob.id, payload: updatedJob });
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Título da Vaga</label>
                  <input name="title" defaultValue={editingJob.title} required className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Empresa</label>
                  <input name="company" defaultValue={editingJob.company} required className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Localização</label>
                  <input name="location" defaultValue={editingJob.location} required className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Tipo</label>
                  <select name="type" defaultValue={editingJob.type} className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none">
                    <option>Tempo Integral</option>
                    <option>Meio Período</option>
                    <option>PJ / Freelance</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Salário</label>
                  <input name="salary" defaultValue={editingJob.salary} className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase">Descrição</label>
                <textarea name="description" defaultValue={editingJob.description} rows={3} className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none"></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase">Requisitos (um por linha)</label>
                <textarea name="requirements" defaultValue={editingJob.requirements.join('\n')} rows={3} className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none"></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingJob(null)} className="flex-1 py-3 px-4 bg-surface-container-highest text-on-surface rounded-xl font-bold hover:bg-surface-container transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Salvar Alterações</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {editingCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-outline-variant/10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary font-headline">Editar Talento</h2>
              <button onClick={() => setEditingCandidate(null)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                <XCircle className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updatedCand = {
                ...editingCandidate,
                name: formData.get('name') as string,
                location: formData.get('location') as string,
                area: formData.get('area') as string,
                role: formData.get('role') as string,
                summary: formData.get('summary') as string,
                skills: (formData.get('skills') as string).split(',').map(s => s.trim()).filter(s => s),
              };
              setConfirmAction({ type: 'edit', target: 'candidate', id: editingCandidate.id, payload: updatedCand });
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Nome Completo</label>
                  <input name="name" defaultValue={editingCandidate.name} required className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Localização</label>
                  <input name="location" defaultValue={editingCandidate.location} required className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Área</label>
                  <input name="area" defaultValue={editingCandidate.area} required className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Cargo</label>
                  <input name="role" defaultValue={editingCandidate.role} required className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase">Resumo Profissional</label>
                <textarea name="summary" defaultValue={editingCandidate.summary} rows={3} className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none"></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase">Competências (separadas por vírgula)</label>
                <textarea name="skills" defaultValue={editingCandidate.skills.join(', ')} rows={2} className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none"></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingCandidate(null)} className="flex-1 py-3 px-4 bg-surface-container-highest text-on-surface rounded-xl font-bold hover:bg-surface-container transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Salvar Alterações</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center border border-outline-variant/10"
          >
            <div className={cn(
              "w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl",
              confirmAction.type === 'approve' ? "bg-tertiary/10 text-tertiary" : 
              confirmAction.type === 'reject' ? "bg-error/10 text-error" :
              confirmAction.type === 'delete' ? "bg-error text-white" : "bg-primary/10 text-primary"
            )}>
              {confirmAction.type === 'approve' ? <CheckCircle2 className="w-10 h-10" /> : 
               confirmAction.type === 'reject' ? <XCircle className="w-10 h-10" /> :
               confirmAction.type === 'delete' ? <Trash2 className="w-10 h-10" /> : <Edit className="w-10 h-10" />}
            </div>
            <h2 className="text-2xl font-extrabold text-on-surface mb-3 font-headline">
              {confirmAction.type === 'approve' ? 'Confirmar Aprovação?' : 
               confirmAction.type === 'reject' ? 'Confirmar Recusa?' :
               confirmAction.type === 'delete' ? 'Confirmar Exclusão?' : 'Confirmar Alteração?'}
            </h2>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              Você tem certeza que deseja {
                confirmAction.type === 'approve' ? 'aprovar' : 
                confirmAction.type === 'reject' ? 'recusar' :
                confirmAction.type === 'delete' ? 'excluir permanentemente' : 'salvar as alterações deste'
              } {confirmAction.target === 'job' ? 'vaga' : 'candidato'}? 
              Esta ação será registrada no histórico do sistema.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setConfirmAction(null)}
                className="py-4 px-6 bg-surface-container-highest text-on-surface rounded-2xl font-bold text-sm hover:bg-surface-container transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (confirmAction.target === 'job') {
                    if (confirmAction.type === 'approve') approveJob(confirmAction.id);
                    else if (confirmAction.type === 'reject') rejectJob(confirmAction.id);
                    else if (confirmAction.type === 'delete') deleteJob(confirmAction.id);
                    else if (confirmAction.type === 'edit') updateJob(confirmAction.payload);
                  } else {
                    if (confirmAction.type === 'approve') approveCandidate(confirmAction.id);
                    else if (confirmAction.type === 'reject') rejectCandidate(confirmAction.id);
                    else if (confirmAction.type === 'delete') deleteCandidate(confirmAction.id);
                    else if (confirmAction.type === 'edit') updateCandidate(confirmAction.payload);
                  }
                }}
                className={cn(
                  "py-4 px-6 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg",
                  confirmAction.type === 'approve' ? "bg-primary text-on-primary shadow-primary/20" : 
                  confirmAction.type === 'delete' ? "bg-error text-on-error shadow-error/20" :
                  confirmAction.type === 'reject' ? "bg-error text-on-error shadow-error/20" : "bg-primary text-on-primary shadow-primary/20"
                )}
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Background Editorial Element */}
      <div className="fixed bottom-0 right-0 -z-10 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4 select-none">
        <span className="text-[25rem] font-black text-primary leading-none">CB</span>
      </div>
    </div>
  );
}
