import React from 'react';
import { Logo } from './Logo';
import { Globe, ShieldCheck, Heart } from 'lucide-react';


interface FooterProps {
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRegister }) => {
  return (
    <footer className="bg-[#08060d] text-gray-400 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Banner CTA inside Footer */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-950/80 to-purple-950/60 border border-purple-500/30 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Pronto para aumentar suas vendas?</h3>
            <p className="text-gray-300 text-sm max-w-xl">
              Junte-se aos melhores restaurantes da sua cidade e comece a fidelizar mais clientes hoje mesmo.
            </p>
          </div>
          <button
            onClick={onOpenRegister}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all shrink-0 active:scale-95 text-base"
          >
            Cadastrar Gratuitamente
          </button>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Loopis é a plataforma inovadora que conecta amantes da boa gastronomia aos melhores estabelecimentos através de cashback inteligente e recompensas.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all text-gray-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all text-gray-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all text-gray-300">
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#beneficios" className="hover:text-purple-400 transition-colors">Benefícios para Parceiros</a></li>
              <li><a href="#como-funciona" className="hover:text-purple-400 transition-colors">Como Funciona</a></li>
              <li><a href="#calculadora" className="hover:text-purple-400 transition-colors">Calculadora de Faturamento</a></li>
              <li><a href="#faq" className="hover:text-purple-400 transition-colors">Perguntas Frequentes</a></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contato & Suporte</h4>
            <p className="text-sm text-gray-400">Atendimento a Parceiros: comercial@loopis.app</p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck size={16} />
              <span>Ambiente Seguro & Dados Protegidos (LGPD)</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Loopis Tecnologias para Gastronomia Ltda. Todos os direitos reservados.</p>
          <div className="flex items-center space-x-1">
            <span>Desenvolvido com</span>
            <Heart size={14} className="text-red-500 fill-red-500 inline" />
            <span>para restaurantes.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
