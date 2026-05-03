'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  AlignLeft, 
  X, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  Users,
  Handshake,
  DollarSign,
  Trophy,
  Award,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CadastrarNegocioPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    owner_name: '',
    contact_email: '',
    contact_phone: '',
    location: '',
    type: 'Parceria',
    area: 'Serviços',
    description: '',
    attachment_url: ''
  });
  const [attachmentName, setAttachmentName] = useState('');
  const attachmentInputRef = React.useRef<HTMLInputElement>(null);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, attachment_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('negocios')
        .insert([{
          title: formData.title,
          owner_name: formData.owner_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          location: formData.location,
          type: formData.type,
          area: formData.area,
          description: formData.description,
          attachment_url: formData.attachment_url,
          status: 'pending'
        }]);

      if (error) throw error;
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Erro ao cadastrar negócio:', error);
      alert(`Erro ao cadastrar negócio: ${error.message}`);
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
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-orange-100/20">
            <CheckCircle2 className="w-10 h-10 text-orange-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#00628c] mb-4 font-headline">Oportunidade Enviada!</h2>
          <p className="text-[#3e4850] mb-10 leading-relaxed">
            Sua oportunidade de negócio foi enviada e está aguardando aprovação. Em breve ela estará disponível na galeria de negócios.
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
            <h1 className="text-4xl font-extrabold text-[#00628c] font-headline mb-4">Divulgar Negócio</h1>
            <p className="text-[#3e4850]">Compartilhe sua oportunidade de negócio, parceria ou investimento.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Título da Oportunidade</label>
                <div className="relative">
                  <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6f7881]" />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Expansão de Franquia" 
                    className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Nome do Negócio / Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6f7881]" />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Café Bela Vista" 
                    className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all"
                    value={formData.owner_name}
                    onChange={e => setFormData({...formData, owner_name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Email de Contato</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6f7881]" />
                  <input 
                    required
                    type="email" 
                    placeholder="contato@exemplo.com" 
                    className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all"
                    value={formData.contact_email}
                    onChange={e => setFormData({...formData, contact_email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">WhatsApp / Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6f7881]" />
                  <input 
                    required
                    type="tel" 
                    placeholder="(00) 00000-0000" 
                    className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all"
                    value={formData.contact_phone}
                    onChange={e => setFormData({...formData, contact_phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Localização</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6f7881]" />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Porto Alegre, RS" 
                    className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Tipo de Oportunidade</label>
                <select 
                  className="w-full px-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 font-bold text-[#1b1c1c] appearance-none"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option>Sócio</option>
                  <option>Investimento</option>
                  <option>Parceria</option>
                  <option>Patrocínio</option>
                  <option>Venda</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Área / Categoria</label>
                <select 
                  className="w-full px-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 font-bold text-[#1b1c1c] appearance-none"
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                >
                  <option>Comércio</option>
                  <option>Tecnologia</option>
                  <option>Serviços</option>
                  <option>Franquias</option>
                  <option>Esportes</option>
                  <option>Outros</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Descrição Detalhada</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-[#6f7881]" />
                <textarea 
                  required
                  rows={6}
                  placeholder="Descreva o que sua empresa faz, o que está buscando e quais os benefícios da parceria..." 
                  className="w-full pl-12 pr-4 py-4 bg-[#f6f3f2] border-none rounded-2xl focus:ring-2 focus:ring-[#00628c]/40 transition-all resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-[#3e4850] ml-1">Anexo / Arquivo (Opcional)</label>
              <div 
                onClick={() => attachmentInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[#bec8d1] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-[#f6f3f2]/30 hover:bg-[#00628c]/5 hover:border-[#00628c] transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-[#00628c]" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#3e4850] truncate max-w-xs md:max-w-md">
                    {attachmentName || 'Clique para anexar um documento ou imagem'}
                  </p>
                  <p className="text-xs text-[#6f7881] mt-1">Formatos aceitos: PDF, DOCX, Imagens (Máx. 5MB)</p>
                </div>
                <input 
                  type="file"
                  ref={attachmentInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleAttachmentChange}
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-5 bg-[#00628c] text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#004c6d] transition-all shadow-xl shadow-[#00628c]/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Divulgar Oportunidade'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
