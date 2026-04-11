'use client';

import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'candidatos' | 'empresas'>('candidatos');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c] font-body selection:bg-[#00628c]/20 selection:text-[#00628c]">
      {/* TopNavBar */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#bec8d1]/20">
        <nav className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">
          <Link href="/" className="text-xl md:text-2xl font-bold text-[#00628c] tracking-tighter font-headline">
            Corrente do Bem
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-tight">
            <Link href="/vagas" className="text-[#3e4850] hover:text-[#00628c] transition-colors duration-200">Buscar Vagas</Link>
            <Link href="/talentos" className="text-[#3e4850] hover:text-[#00628c] transition-colors duration-200">Encontrar Talentos</Link>
            <Link href="#como-funciona" className="text-[#3e4850] hover:text-[#00628c] transition-colors duration-200">Como Funciona</Link>
            <Link href="#comunidade" className="text-[#3e4850] hover:text-[#00628c] transition-colors duration-200">Comunidade</Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
              <Link href="/vagas" className="px-3 md:px-5 py-2 text-sm font-semibold text-[#00628c] hover:bg-[#f6f3f2] rounded-full transition-all">
                Entrar
              </Link>
              <Link href="/vagas" className="px-3 md:px-5 py-2 text-sm font-semibold bg-[#00628c] text-white rounded-full shadow-sm hover:scale-95 transition-transform duration-150">
                Cadastrar-se
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#3e4850] hover:text-[#00628c] transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
          <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-[#bec8d1]/20 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-4 font-semibold">
                <Link onClick={() => setIsMenuOpen(false)} href="/vagas" className="text-[#3e4850] hover:text-[#00628c]">Buscar Vagas</Link>
                <Link onClick={() => setIsMenuOpen(false)} href="/talentos" className="text-[#3e4850] hover:text-[#00628c]">Encontrar Talentos</Link>
                <Link onClick={() => setIsMenuOpen(false)} href="#como-funciona" className="text-[#3e4850] hover:text-[#00628c]">Como Funciona</Link>
                <Link onClick={() => setIsMenuOpen(false)} href="#comunidade" className="text-[#3e4850] hover:text-[#00628c]">Comunidade</Link>
                <div className="pt-4 border-t border-[#bec8d1]/10 flex flex-col space-y-3">
                  <Link onClick={() => setIsMenuOpen(false)} href="/vagas" className="w-full py-3 text-center text-[#00628c] font-bold border border-[#00628c] rounded-xl">
                    Entrar
                  </Link>
                  <Link onClick={() => setIsMenuOpen(false)} href="/vagas" className="w-full py-3 text-center bg-[#00628c] text-white font-bold rounded-xl">
                    Cadastrar-se
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

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
                Encontre sua próxima <span className="text-[#00628c]">oportunidade</span> ou ofereça ajuda
              </h1>
              <p className="text-lg md:text-xl text-[#3e4850] max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Unindo talentos invisíveis a empresas que valorizam o impacto social. Construa carreiras, transforme realidades.
              </p>
              <div className="bg-white p-2 rounded-2xl shadow-xl shadow-[#00628c]/5 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto lg:mx-0 border border-[#bec8d1]/20">
                <div className="flex-1 flex items-center px-4 gap-3 bg-[#f6f3f2] rounded-xl">
                  <Search className="w-5 h-5 text-[#6f7881]" />
                  <input 
                    className="w-full bg-transparent border-none focus:ring-0 py-4 text-[#1b1c1c] placeholder-[#6f7881] text-sm md:text-base" 
                    placeholder="Procure por 'vagas' ou 'talentos'..." 
                    type="text"
                  />
                </div>
                <button className="bg-[#00628c] hover:bg-[#004c6d] text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
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
                <p className="text-[#3e4850] text-base lg:text-lg max-w-2xl">Oportunidades que precisam do seu talento hoje. Aplique agora e mude sua trajetória.</p>
              </div>
              <Link className="group flex items-center gap-2 text-[#00628c] font-bold hover:gap-4 transition-all" href="/vagas">
                Ver todas as vagas <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Job Card 1 */}
              <div className="md:col-span-2 lg:col-span-2 bg-white p-8 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 border border-[#bec8d1]/10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#c8e6ff] flex items-center justify-center">
                    <Utensils className="w-8 h-8 text-[#00628c]" />
                  </div>
                  <span className="px-3 py-1 bg-[#bff444] text-[#141f00] text-xs font-bold rounded-full">URGENTE</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1b1c1c] mb-2 font-headline">Auxiliar de Cozinha Pleno</h3>
                <p className="text-[#3e4850] mb-6 leading-relaxed">Rede de hotéis busca profissional dedicado para suporte na produção de eventos corporativos e buffet.</p>
                <div className="flex items-center gap-4 text-sm text-[#3e4850] font-medium mb-8">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> São Paulo, SP</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> R$ 2.400,00</span>
                </div>
                <Link href="/vagas" className="block w-full py-4 bg-[#f0eded] text-[#1b1c1c] font-bold rounded-xl hover:bg-[#00628c] hover:text-white transition-colors text-center">
                  Candidatar-se
                </Link>
              </div>
              {/* Job Card 2 */}
              <div className="bg-white p-8 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 border border-[#bec8d1]/10">
                <div className="w-14 h-14 rounded-2xl bg-[#ffdcc6] flex items-center justify-center mb-6">
                  <Brush className="w-7 h-7 text-[#964900]" />
                </div>
                <h3 className="text-xl font-bold text-[#1b1c1c] mb-2 font-headline">Serviços Gerais</h3>
                <p className="text-[#3e4850] text-sm mb-6">Manutenção de espaços comerciais em condomínio de luxo.</p>
                <div className="flex flex-col gap-2 text-sm text-[#3e4850] font-medium mb-8">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Rio de Janeiro, RJ</span>
                </div>
                <Link href="/vagas" className="block w-full py-3 bg-[#f0eded] text-[#1b1c1c] font-bold rounded-xl hover:bg-[#00628c] hover:text-white transition-colors text-center">
                  Detalhes
                </Link>
              </div>
              {/* Job Card 3 */}
              <div className="bg-white p-8 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 border border-[#bec8d1]/10">
                <div className="w-14 h-14 rounded-2xl bg-[#bff444] flex items-center justify-center mb-6">
                  <Truck className="w-7 h-7 text-[#4a6500]" />
                </div>
                <h3 className="text-xl font-bold text-[#1b1c1c] mb-2 font-headline">Motorista Categoria D</h3>
                <p className="text-[#3e4850] text-sm mb-6">Transporte de materiais hospitalares com rota fixa estadual.</p>
                <div className="flex flex-col gap-2 text-sm text-[#3e4850] font-medium mb-8">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Curitiba, PR</span>
                </div>
                <Link href="/vagas" className="block w-full py-3 bg-[#f0eded] text-[#1b1c1c] font-bold rounded-xl hover:bg-[#00628c] hover:text-white transition-colors text-center">
                  Detalhes
                </Link>
              </div>
            </div>
          </div>
        </section>

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
              {/* Profile Card 1 */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-lg relative">
                  <Image 
                    alt="Mariana Silva" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=600" 
                    fill
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-white/90 backdrop-blur-md absolute bottom-10 left-6 right-6 p-6 rounded-2xl shadow-lg border border-[#bec8d1]/10">
                  <h3 className="text-xl font-bold text-[#1b1c1c] font-headline">Mariana Silva</h3>
                  <p className="text-[#00628c] font-semibold mb-2">Gestão de Logística</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-[#f0eded] text-[10px] font-bold rounded uppercase">Eficiência</span>
                    <span className="px-2 py-1 bg-[#f0eded] text-[10px] font-bold rounded uppercase">Liderança</span>
                  </div>
                </div>
              </motion.div>
              {/* Profile Card 2 */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="relative group lg:mt-12"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-lg relative">
                  <Image 
                    alt="Roberto Almeida" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" 
                    fill
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-white/90 backdrop-blur-md absolute bottom-10 left-6 right-6 p-6 rounded-2xl shadow-lg border border-[#bec8d1]/10">
                  <h3 className="text-xl font-bold text-[#1b1c1c] font-headline">Roberto Almeida</h3>
                  <p className="text-[#00628c] font-semibold mb-2">Mestre de Obras</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-[#f0eded] text-[10px] font-bold rounded uppercase">20 Anos Exp.</span>
                    <span className="px-2 py-1 bg-[#f0eded] text-[10px] font-bold rounded uppercase">Técnico</span>
                  </div>
                </div>
              </motion.div>
              {/* Profile Card 3 */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="relative group lg:mt-24"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-lg relative">
                  <Image 
                    alt="Clara Mendes" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" 
                    fill
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-white/90 backdrop-blur-md absolute bottom-10 left-6 right-6 p-6 rounded-2xl shadow-lg border border-[#bec8d1]/10">
                  <h3 className="text-xl font-bold text-[#1b1c1c] font-headline">Clara Mendes</h3>
                  <p className="text-[#00628c] font-semibold mb-2">Assistente Administrativa</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-[#f0eded] text-[10px] font-bold rounded uppercase">Bilíngue</span>
                    <span className="px-2 py-1 bg-[#f0eded] text-[10px] font-bold rounded uppercase">Organizadora</span>
                  </div>
                </div>
              </motion.div>
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
                  <Link href="/talentos" className="bg-white text-[#00628c] px-8 lg:px-10 py-3 lg:py-4 rounded-2xl font-bold text-base lg:text-lg hover:scale-105 transition-transform shadow-lg">
                    Cadastrar Currículo
                  </Link>
                  <Link href="/vagas" className="bg-[#bff444] text-[#141f00] px-8 lg:px-10 py-3 lg:py-4 rounded-2xl font-bold text-base lg:text-lg hover:scale-105 transition-transform shadow-lg">
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
