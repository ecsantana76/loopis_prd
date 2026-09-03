import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, CalendarCheck, MapPin, Share2 } from 'lucide-react';

export const Rules: React.FC = () => {
  const navigate = useNavigate();

  const howToEarn = [
    {
      title: 'Cadastro Completo',
      description: 'Preencha todos os seus dados no perfil (telefone, cidade) para ganhar seu primeiro bônus.',
      loops: 50,
      icon: <UserPlus size={24} className="text-brand-violet" />,
      color: 'bg-brand-violet/10'
    },
    {
      title: 'Fazer Reserva',
      description: 'Agende sua visita pelo app. Ao concluir a experiência no restaurante, você é recompensado.',
      loops: 10,
      icon: <CalendarCheck size={24} className="text-green-500" />,
      color: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Check-in e Consumo',
      description: 'Ao fazer o check-in no restaurante, você ganha 1 Loop a cada R$ 1,00 gasto na conta.',
      loops: '1 por R$ 1',
      icon: <MapPin size={24} className="text-blue-500" />,
      color: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Indicar Amigos',
      description: 'Compartilhe o Loopis. Quando seu amigo fizer o primeiro consumo, ambos ganham Loops.',
      loops: 100,
      icon: <Share2 size={24} className="text-orange-500" />,
      color: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  return (
    <div className="mx-auto w-full max-w-2xl pb-24 animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-brand-graphite/80 backdrop-blur-md py-4 mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-brand-graphite dark:text-white" />
          </button>
          <h1 className="ml-2 text-xl font-bold text-brand-graphite dark:text-white">
            Regulamento Loopis
          </h1>
        </div>
      </header>

      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-loopis mb-4">
          Como ganhar Loops?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          O Loopis recompensa você por explorar a cidade. Veja abaixo as formas de acumular pontos e trocar por descontos imperdíveis!
        </p>
      </div>

      <div className="space-y-4">
        {howToEarn.map((item, index) => (
          <div key={index} className="bg-white dark:bg-[#1a1a1c] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-start gap-4">
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shrink-0`}>
              {item.icon}
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-brand-graphite dark:text-white mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{item.description}</p>
              <div className="inline-flex items-center space-x-1 bg-brand-violet/10 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-semibold text-brand-deep-purple dark:text-brand-lilac uppercase tracking-wider">Recompensa:</span>
                <span className="font-bold text-brand-violet">+{item.loops} Loops</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-brand-graphite dark:bg-[#111] rounded-3xl text-center">
        <h3 className="text-white font-bold mb-2">Dúvidas?</h3>
        <p className="text-gray-400 text-sm mb-4">
          Acesse nossa central de ajuda ou entre em contato com o suporte do Loopis.
        </p>
        <button className="bg-white text-brand-graphite font-bold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors text-sm">
          Falar com Suporte
        </button>
      </div>
    </div>
  );
};
