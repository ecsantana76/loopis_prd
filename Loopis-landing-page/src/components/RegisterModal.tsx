import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Utensils, MapPin, Phone, Mail, User, Building2, Store } from 'lucide-react';
import { Logo } from './Logo';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nomeRestaurante: '',
    categoria: 'Hambuergueria / Bar',
    nomeResponsavel: '',
    email: '',
    whatsapp: '',
    cidade: 'São Paulo - SP',
    mediaMesas: '10 a 20 mesas'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#06040a]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#130f1e] border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/80 overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <Logo size="sm" />
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Cadastro Solicitado com Sucesso!</h3>
                  <p className="text-gray-300 text-sm max-w-md mx-auto">
                    Obrigado pelo interesse! Nossa equipe comercial entrará em contato com o responsável <strong>{formData.nomeResponsavel}</strong> via WhatsApp em breve.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all"
                  >
                    Voltar para a Página Principal
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 space-y-1">
                  <h2 className="text-2xl font-bold text-white">Cadastre seu Restaurante no Loopis</h2>
                  <p className="text-sm text-gray-300">Preencha os dados abaixo. Leva menos de 2 minutos!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Nome Restaurante */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300 flex items-center space-x-1">
                        <Store size={14} className="text-purple-400" />
                        <span>Nome do Estabelecimento *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Cantina Di Maria"
                        value={formData.nomeRestaurante}
                        onChange={(e) => setFormData({ ...formData, nomeRestaurante: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    </div>

                    {/* Categoria */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300 flex items-center space-x-1">
                        <Utensils size={14} className="text-purple-400" />
                        <span>Categoria *</span>
                      </label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1e172e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
                      >
                        <option value="Hambuergueria / Bar">Hambuergueria / Pub</option>
                        <option value="Pizzaria">Pizzaria</option>
                        <option value="Japonesa / Asiática">Japonesa / Asiática</option>
                        <option value="Italiana / Massas">Italiana / Massas</option>
                        <option value="Brasileira / Barbecues">Churrascaria / Brasileira</option>
                        <option value="Cafeteira / Doceria">Cafeteria / Doceria</option>
                        <option value="Outro">Outro segmento</option>
                      </select>
                    </div>

                    {/* Responsavel */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300 flex items-center space-x-1">
                        <User size={14} className="text-purple-400" />
                        <span>Nome do Responsável *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Seu nome completo"
                        value={formData.nomeResponsavel}
                        onChange={(e) => setFormData({ ...formData, nomeResponsavel: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    </div>

                    {/* E-mail */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300 flex items-center space-x-1">
                        <Mail size={14} className="text-purple-400" />
                        <span>E-mail Corporativo *</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="contato@restaurante.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300 flex items-center space-x-1">
                        <Phone size={14} className="text-purple-400" />
                        <span>WhatsApp para Contato *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    </div>

                    {/* Cidade/Estado */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300 flex items-center space-x-1">
                        <MapPin size={14} className="text-purple-400" />
                        <span>Cidade / Estado *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Campinas - SP"
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    </div>

                  </div>

                  {/* Média de Atendimento */}
                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-semibold text-gray-300 flex items-center space-x-1">
                      <Building2 size={14} className="text-purple-400" />
                      <span>Capacidade / Estrutura Aproximada</span>
                    </label>
                    <select
                      value={formData.mediaMesas}
                      onChange={(e) => setFormData({ ...formData, mediaMesas: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1e172e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
                    >
                      <option value="Até 10 mesas">Até 10 mesas (Porte Pequeno)</option>
                      <option value="10 a 30 mesas">10 a 30 mesas (Porte Médio)</option>
                      <option value="Mais de 30 mesas">Mais de 30 mesas (Porte Grande)</option>
                      <option value="Apenas Delivery / Dark Kitchen">Apenas Delivery / Dark Kitchen</option>
                    </select>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all text-base active:scale-95"
                    >
                      Enviar Solicitação de Parceria
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 text-center">
                    Ao enviar, você autoriza o contato da equipe Loopis para ativação da sua conta.
                  </p>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
