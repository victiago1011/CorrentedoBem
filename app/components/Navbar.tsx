'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Handshake, 
  ChevronDown, 
  Menu, 
  X,
  Briefcase,
  FileText,
  TrendingUp,
  Newspaper,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Vagas', href: '/vagas', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Currículos', href: '/talentos', icon: <FileText className="w-4 h-4" /> },
    { name: 'Negócios', href: '/negocios', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Notícias', href: '#', icon: <Newspaper className="w-4 h-4" /> },
    { name: 'Como Funciona', href: '/#como-funciona', icon: <Info className="w-4 h-4" /> },
  ];

  const registerOptions = [
    { 
      title: 'Vaga', 
      desc: 'Anuncie uma oportunidade de emprego', 
      icon: <Briefcase className="w-8 h-8" />, 
      href: '/vagas/cadastrar',
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      title: 'Currículo', 
      desc: 'Cadastre seu talento na nossa rede', 
      icon: <FileText className="w-8 h-8" />, 
      href: '/talentos/cadastrar',
      color: 'bg-green-50 text-green-600'
    },
    { 
      title: 'Negócio', 
      desc: 'Divulgue uma oportunidade de negócio', 
      icon: <TrendingUp className="w-8 h-8" />, 
      href: '/negocios/cadastrar',
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#bec8d1]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#00628c] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#00628c]/20 group-hover:scale-110 transition-transform">
              <Handshake className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-[#00628c] font-headline tracking-tighter">Corrente do Bem</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "text-sm font-bold transition-colors py-2",
                  pathname === link.href ? "text-[#00628c]" : "text-[#3e4850] hover:text-[#00628c]"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-6 py-2.5 bg-[#00628c] text-white font-bold rounded-full shadow-lg shadow-[#00628c]/20 hover:scale-95 transition-transform text-sm"
            >
              Cadastrar-se
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-[#3e4850]">
              <X className={cn("w-6 h-6", !isMenuOpen && "hidden")} />
              <Menu className={cn("w-6 h-6", isMenuOpen && "hidden")} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-20 w-full bg-white border-b border-[#bec8d1]/20 overflow-hidden z-[60]"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  onClick={() => setIsMenuOpen(false)} 
                  href={link.href} 
                  className={cn("flex items-center gap-3 font-bold py-2", pathname === link.href ? "text-[#00628c]" : "text-[#3e4850]")}
                >
                  <span className={pathname === link.href ? "text-[#00628c]" : "text-[#6f7881]"}>
                    {link.icon}
                  </span>
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#bec8d1]/10">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsRegisterModalOpen(true);
                  }} 
                  className="w-full py-4 text-center bg-[#00628c] text-white font-bold rounded-2xl"
                >
                  Cadastrar-se Agora
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Choice Modal */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute inset-0 bg-[#3e4850]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12"
            >
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-[#f6f3f2] rounded-full text-[#3e4850] hover:bg-[#00628c] hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-[#00628c] font-headline mb-4">O que você gostaria de cadastrar?</h2>
                <p className="text-[#3e4850] font-medium">Escolha uma categoria para começar sua jornada na Corrente do Bem.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {registerOptions.map((opt) => (
                  <Link
                    key={opt.title}
                    href={opt.href}
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="flex flex-col items-center text-center p-6 rounded-[2rem] border-2 border-transparent hover:border-[#00628c]/20 hover:bg-[#f6f3f2] transition-all group active:scale-95"
                  >
                    <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", opt.color)}>
                      {opt.icon}
                    </div>
                    <h3 className="text-lg font-black text-[#00628c] mb-2">{opt.title}</h3>
                    <p className="text-xs text-[#6f7881] font-medium leading-relaxed">{opt.desc}</p>
                  </Link>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-[#bec8d1]/10 text-center">
                <p className="text-xs text-[#6f7881] font-medium italic">
                  Todos os cadastros passam por uma breve revisão da nossa equipe para garantir a segurança da comunidade.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
