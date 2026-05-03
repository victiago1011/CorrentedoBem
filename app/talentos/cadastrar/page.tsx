'use client';

import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Briefcase, 
  AlignLeft, 
  Plus, 
  X, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Star,
  Mail,
  Phone,
  FileText,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export default function CadastrarTalentoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    area: 'Tecnologia',
    role: '',
    summary: '',
    skills: [] as string[],
    image: `https://picsum.photos/seed/${Math.random()}/200/200`,
    resume_url: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [resumeName, setResumeName] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const resumeInputRef = React.useRef<HTMLInputElement>(null);

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, resume_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Log for debugging
      console.log('Enviando dados:', { ...formData, status: 'pending' });

      const { error } = await supabase
        .from('candidates')
        .insert([{
          ...formData,
          status: 'pending'
        }]);

      if (error) {
        console.error('Supabase error detailed:', error.message, error.details, error.hint, error.code);
        throw error;
      }
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Erro ao cadastrar talento:', error);
      alert(`Ocorreu um erro ao cadastrar seu perfil: ${error.message || 'Tente novamente.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center border border-[#bec8d1]/20"
        >
          <div className="w-20 h-20 bg-[#bff444] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#bff444]/20">
            <CheckCircle2 className="w-10 h-10 text-[#141f00]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#00628c] mb-4 font-headline">Perfil Enviado!</h2>
          <p className="text-[#3e4850] mb-10 leading-relaxed">
            Seu currículo foi enviado e está aguardando aprovação dos nossos administradores. Em breve ele estará visível na Galeria de Talentos.
          </p>
          <Link 
            href="/" 
            className="inline-block w-full py-4 bg-[#00628c] text-white font-bold rounded-2xl hover:bg-[#004c6d] transition-all shadow-lg shadow-[#00628c]/20"
          >
            Voltar para o início
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#3e4850] hover:text-[#00628c] font-bold mb-10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Voltar para o início
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-[#bec8d1]/10">
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold text-[#00628c] font-headline mb-4">Cadastrar Currículo</h1>
            <p className="text-[#3e4850]">Crie seu perfil profissional e conecte-se com empresas com propósito.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center mb-10">
               <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-[#f6f3f2] overflow-hidden border-2 border-dashed border-[#bec8d1] flex items-center justify-center group-hover:border-[#00628c] transition-colors relative shadow-inner">
                    <Image 
                      src={formData.image} 
                      alt="Avatar" 
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-[#00628c] hover:scale-110 active:scale-95 transition-all border border-[#bec8d1]/20"
                    title="Mudar foto"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6f7881]" />
                  <input 
                    required
                    type="text" 
                    placeholder="Como você gostaria de ser chamado?" 
                    className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all text-[#1b1c1c]"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">E-mail de Contato</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6f7881]" />
                  <input 
                    required
                    type="email" 
                    placeholder="exemplo@email.com" 
                    className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all text-[#1b1c1c]"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Telefone / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6f7881]" />
                  <input 
                    required
                    type="tel" 
                    placeholder="(00) 00000-0000" 
                    className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all text-[#1b1c1c]"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Cidade / Estado</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6f7881]" />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Rio de Janeiro, RJ" 
                    className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all text-[#1b1c1c]"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Cargo / Especialidade</label>
                <div className="relative">
                  <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6f7881]" />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Designer Gráfico" 
                    className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all text-[#1b1c1c]"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Área Principal</label>
                <select 
                  className="w-full px-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 font-bold text-[#1b1c1c] transition-all"
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                >
                  <option>Tecnologia</option>
                  <option>Saúde</option>
                  <option>Finanças</option>
                  <option>Engenharia & Arquitetura</option>
                  <option>Autônomos</option>
                  <option>Educação</option>
                  <option>Serviços Gerais</option>
                  <option>Outros</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Resumo Profissional</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-[#6f7881]" />
                <textarea 
                  required
                  rows={4}
                  placeholder="Conte um pouco sobre sua trajetória e o que você busca..." 
                  className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all resize-none text-[#1b1c1c]"
                  value={formData.summary}
                  onChange={e => setFormData({...formData, summary: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Currículo (PDF/DOCX)</label>
              <div 
                onClick={() => resumeInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[#bec8d1] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-[#f6f3f2]/30 hover:bg-[#00628c]/5 hover:border-[#00628c] transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-[#00628c]" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#3e4850] truncate max-w-xs md:max-w-md">
                    {resumeName || 'Clique para anexar seu currículo'}
                  </p>
                  <p className="text-xs text-[#6f7881] mt-1">Formatos aceitos: PDF, DOCX (Máx. 5MB)</p>
                </div>
                <input 
                  type="file"
                  ref={resumeInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850]">Habilidades / Competências</label>
                <span className="text-[10px] text-[#6f7881] font-bold">Pressione Enter para adicionar</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ex: Photoshop, Atendimento ao Cliente..." 
                  className="flex-1 px-6 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all text-[#1b1c1c]"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button 
                  type="button"
                  onClick={addSkill}
                  className="p-4 bg-[#00628c] text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="flex items-center gap-2 px-4 py-2 bg-[#00628c]/5 text-[#00628c] font-black uppercase text-[10px] tracking-widest rounded-xl border border-[#00628c]/10">
                    {skill}
                    <button type="button" onClick={() => removeSkill(idx)}>
                      <X className="w-3 h-3 hover:text-red-500 transition-colors" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-5 bg-[#00628c] text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#004c6d] transition-all shadow-xl shadow-[#00628c]/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                'Salvar Perfil Profissional'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
