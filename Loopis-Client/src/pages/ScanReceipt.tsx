import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  ArrowLeft, 
  Receipt, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  CreditCard,
  Utensils,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScannedItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export const ScanReceipt: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'upload' | 'scanning' | 'result'>('upload');

  const scannedData = {
    orderCode: 'LOOP-8821',
    restaurantName: 'Marisqueira Sintra',
    mesa: 'Mesa 04 (Salão Principal)',
    items: [
      { name: 'Camarão na Moranga Especial', quantity: 1, price: 145.00, notes: 'Arroz de coco e farofa crocante' },
      { name: 'Chopp Artesanal Eisenbahn 500ml', quantity: 2, price: 36.00, notes: '2x R$ 18,00' },
      { name: 'Petit Gâteau Belga', quantity: 1, price: 38.00, notes: 'Com sorvete artesanal' },
      { name: 'Taxa de Serviço Sugerida (10%)', quantity: 1, price: 22.20 },
    ] as ScannedItem[],
    subtotal: 261.20,
    discount: 20.00,
    totalAmount: 241.20,
    loopsToEarn: 241,
  };

  const handleSimulateUpload = () => {
    setStep('scanning');
    setTimeout(() => {
      setStep('result');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-brand-off-white dark:bg-brand-graphite pb-28 animate-in fade-in duration-500">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-brand-graphite/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between px-4 max-w-2xl mx-auto h-16">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/15 border border-gray-200/60 dark:border-white/10 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={20} className="text-brand-graphite dark:text-white" />
          </button>
          
          <div className="text-center">
            <h1 className="text-base font-bold text-brand-graphite dark:text-white">
              Leitura de Nota Fiscal
            </h1>
            <p className="text-xs text-gray-400">
              {step === 'result' ? 'Itens e valor identificados' : 'Envio de cupom para pagamento no app'}
            </p>
          </div>

          <div className="w-10 h-10 flex items-center justify-center text-brand-violet">
            <Receipt size={22} />
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Upload / Capture NFC-e */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-loopis text-white rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-violet/20">
                  <Receipt size={32} />
                </div>
                <h2 className="text-2xl font-extrabold text-brand-graphite dark:text-white">
                  Envie sua Nota Fiscal
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Tire uma foto do cupom fiscal entregue na sua mesa. Nosso sistema identifica os itens e calcula a conta para você pagar pelo app e acumular Loops.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button 
                  type="button"
                  onClick={handleSimulateUpload}
                  className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#1a1a1c] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl hover:border-brand-violet dark:hover:border-brand-violet transition-all group shadow-sm cursor-pointer hover:scale-[1.02]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mb-3 group-hover:bg-brand-violet group-hover:text-white transition-colors">
                    <Camera size={28} />
                  </div>
                  <span className="text-sm font-bold text-brand-graphite dark:text-white">Tirar Foto</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Câmera do celular</span>
                </button>

                <button 
                  type="button"
                  onClick={handleSimulateUpload}
                  className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#1a1a1c] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl hover:border-brand-violet dark:hover:border-brand-violet transition-all group shadow-sm cursor-pointer hover:scale-[1.02]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mb-3 group-hover:bg-brand-violet group-hover:text-white transition-colors">
                    <Upload size={28} />
                  </div>
                  <span className="text-sm font-bold text-brand-graphite dark:text-white">Enviar da Galeria</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG ou PDF</span>
                </button>
              </div>

              <div className="bg-brand-violet/5 border border-brand-violet/15 p-4 rounded-2xl flex items-start space-x-3 text-xs text-gray-600 dark:text-gray-300">
                <ShieldCheck size={20} className="text-brand-violet shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  O sistema valida a chave da nota junto à SEFAZ. Você poderá pagar o total ou dividir a conta entre amigos via Pix ou cartão.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: OCR Scanner Processing Animation */}
          {step === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-16 text-center space-y-6"
            >
              <div className="relative w-40 h-48 bg-gray-900 rounded-3xl border-2 border-dashed border-brand-violet/50 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                <motion.div
                  animate={{ y: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', repeatType: 'reverse' }}
                  className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-brand-violet to-transparent shadow-[0_0_15px_#7c3aed] z-20"
                />
                <Receipt size={64} className="text-brand-lilac/30" />
                <span className="text-[10px] font-bold text-brand-lilac mt-2 bg-black/60 px-2.5 py-1 rounded-full z-10">
                  OCR SEFAZ
                </span>
              </div>

              <div className="space-y-1.5 max-w-xs">
                <h3 className="text-lg font-extrabold text-brand-graphite dark:text-white">
                  Lendo Itens da Nota Fiscal...
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Extraindo cada prato, bebida e valor para processar o pagamento no app.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Extrato Lido da Nota Fiscal & Pagamento Obrigatório pelo App */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Validation Success Chip */}
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-2xl">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 size={18} />
                  <span>Nota Fiscal Lida com Sucesso!</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white dark:bg-black/40 px-2 py-0.5 rounded-md text-gray-600 dark:text-gray-300">
                  {scannedData.orderCode}
                </span>
              </div>

              {/* Restaurant & Table Headline */}
              <div>
                <h2 className="text-xl font-extrabold text-brand-graphite dark:text-white">
                  {scannedData.restaurantName}
                </h2>
                <p className="text-xs text-gray-500">
                  {scannedData.mesa} • Itens extraídos da NFC-e
                </p>
              </div>

              {/* List of Consumed Items */}
              <div className="bg-white dark:bg-[#1a1a1c] rounded-3xl p-5 border border-gray-100 dark:border-white/10 shadow-sm space-y-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Itens Consumidos:
                </span>
                
                <div className="space-y-2.5">
                  {scannedData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start text-xs pb-2 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0">
                      <div>
                        <p className="font-bold text-brand-graphite dark:text-white">
                          {item.quantity}x {item.name}
                        </p>
                        {item.notes && (
                          <p className="text-[10px] text-gray-400">{item.notes}</p>
                        )}
                      </div>
                      <span className="font-semibold text-brand-graphite dark:text-white shrink-0">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Total Box */}
              <div className="bg-gradient-to-r from-purple-50 via-brand-lilac/10 to-purple-50 dark:from-brand-violet/10 dark:via-purple-950/20 dark:to-brand-violet/10 p-5 rounded-3xl border border-brand-violet/20 space-y-2.5">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                  <span>Subtotal:</span>
                  <span>R$ {scannedData.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {scannedData.discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Desconto de Reserva Aplicado:</span>
                    <span>- R$ {scannedData.discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-brand-violet/20 font-extrabold text-sm text-brand-graphite dark:text-white">
                  <span>Valor Total da Conta:</span>
                  <span className="text-2xl text-brand-violet dark:text-brand-lilac">
                    R$ {scannedData.totalAmount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-300 pt-1 font-bold">
                  <span className="flex items-center space-x-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Cashback Liberado Após Pagamento:</span>
                  </span>
                  <span className="bg-amber-400/20 px-2.5 py-0.5 rounded-full font-extrabold">
                    +{scannedData.loopsToEarn} Loops
                  </span>
                </div>
              </div>

              {/* Mandatory In-App Payment Action Options */}
              <div className="space-y-3 pt-2">
                {/* Option 1: Direct Full Payment Inside App */}
                <button
                  type="button"
                  onClick={() => navigate(`/checkout/split?orderCode=${scannedData.orderCode}&netTotal=${scannedData.totalAmount}&tab=full`)}
                  className="w-full py-4 px-5 bg-gradient-loopis hover:opacity-95 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-brand-violet/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CreditCard size={18} />
                  <span>Pagar Conta pelo App (Pix / Cartão)</span>
                </button>

                {/* Option 2: Split Payment Inside App */}
                <button
                  type="button"
                  onClick={() => navigate(`/checkout/split?orderCode=${scannedData.orderCode}&netTotal=${scannedData.totalAmount}&tab=split`)}
                  className="w-full py-3.5 px-5 bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/15 text-brand-graphite dark:text-white font-bold text-xs sm:text-sm rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Users size={16} className="text-brand-violet" />
                  <span>Dividir Conta com Amigos (Split Payment)</span>
                </button>

                {/* Option 3: Details */}
                <button
                  type="button"
                  onClick={() => navigate(`/order-summary?code=${scannedData.orderCode}`)}
                  className="w-full py-2 text-xs text-gray-500 hover:text-brand-violet font-semibold transition-colors flex items-center justify-center space-x-1"
                >
                  <Utensils size={13} />
                  <span>Ver Resumo Completo e Aplicar Cupons</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
