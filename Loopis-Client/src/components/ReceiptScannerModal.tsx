import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  QrCode, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Receipt, 
  Camera, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  CreditCard,
  Utensils,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScannedFiscalData {
  orderCode: string;
  restaurantName: string;
  restaurantCategory: string;
  mesa: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
  }>;
  subtotal: number;
  discount: number;
  serviceFee: number;
  totalAmount: number;
  cashbackLoops: number;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { restaurants, isLoggedIn, openLoginModal } = useStore();
  const [activeTab, setActiveTab] = useState<'qr' | 'manual'>('qr');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedReceipt, setScannedReceipt] = useState<ScannedFiscalData | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(restaurants[0]?.id || 'marisqueira-sintra');
  const [manualAmount, setManualAmount] = useState('');

  if (!isOpen) return null;

  const handleSimulateScan = (overrideCode?: string) => {
    if (!isLoggedIn) {
      onClose();
      openLoginModal();
      return;
    }

    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      const targetRestaurant = restaurants.find(r => r.id === selectedRestaurantId) || restaurants[0] || {
        id: 'marisqueira-sintra',
        nome: 'Marisqueira Sintra',
        categoria: 'Frutos do Mar'
      };

      const parsedTotal = manualAmount ? parseFloat(manualAmount.replace(',', '.')) : 241.20;
      const finalTotal = isNaN(parsedTotal) || parsedTotal <= 0 ? 241.20 : parsedTotal;
      const loopsGanhos = Math.round(finalTotal);

      // Leitura da nota fiscal -> Lançamento da comanda no app (sem creditar loops até que o pagamento ocorra)
      const mockData: ScannedFiscalData = {
        orderCode: overrideCode || 'LOOP-8821',
        restaurantName: targetRestaurant.nome,
        restaurantCategory: targetRestaurant.categoria,
        mesa: 'Mesa 04 (Salão Principal)',
        items: [
          {
            id: 'item_1',
            name: 'Camarão na Moranga Especial',
            quantity: 1,
            unitPrice: 145.00,
            totalPrice: 145.00,
            notes: 'Acompanha arroz de coco e farofa crocante'
          },
          {
            id: 'item_2',
            name: 'Chopp Artesanal Eisenbahn 500ml',
            quantity: 2,
            unitPrice: 18.00,
            totalPrice: 36.00,
            notes: 'Temperatura ideal - colarinho cremoso'
          },
          {
            id: 'item_3',
            name: 'Petit Gâteau Belga com Sorvete',
            quantity: 1,
            unitPrice: 38.00,
            totalPrice: 38.00,
            notes: 'Calda de frutas vermelhas'
          },
          {
            id: 'item_4',
            name: 'Taxa de Serviço Sugerida (10%)',
            quantity: 1,
            unitPrice: 22.20,
            totalPrice: 22.20
          },
        ],
        subtotal: 261.20,
        discount: 20.00,
        serviceFee: 22.20,
        totalAmount: finalTotal,
        cashbackLoops: loopsGanhos,
      };

      setScannedReceipt(mockData);
    }, 1500);
  };

  const handleGoToCheckout = (tab: 'full' | 'split') => {
    if (!scannedReceipt) return;
    onClose();
    navigate(`/checkout/split?orderCode=${scannedReceipt.orderCode}&netTotal=${scannedReceipt.totalAmount}&tab=${tab}`);
  };

  const handleGoToOrderSummary = () => {
    if (!scannedReceipt) return;
    onClose();
    navigate(`/order-summary?code=${scannedReceipt.orderCode}`);
  };

  const handleReset = () => {
    setScannedReceipt(null);
    setIsScanning(false);
    setManualAmount('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="app-modal-backdrop fixed inset-0 z-[100] flex items-end justify-center overflow-hidden p-0 sm:items-center sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-graphite/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="app-modal-panel relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-gray-100 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a1c] sm:rounded-3xl"
        >
          {/* Top Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-white/10 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-violet/10 flex items-center justify-center text-brand-violet">
                <Receipt size={22} />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-graphite dark:text-white leading-tight">
                  Lançar Comanda por Nota Fiscal
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {scannedReceipt ? 'Comanda carregada para pagamento' : 'Escaneie a nota para ler os itens e pagar pelo app'}
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 text-gray-400 hover:text-brand-graphite dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {!scannedReceipt ? (
              <div className="space-y-5">
                {/* Tabs */}
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl">
                  <button
                    onClick={() => setActiveTab('qr')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all ${
                      activeTab === 'qr'
                        ? 'bg-white dark:bg-brand-graphite text-brand-violet shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <QrCode size={16} />
                    <span>Escanear QR Code da NFC-e</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('manual')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all ${
                      activeTab === 'manual'
                        ? 'bg-white dark:bg-brand-graphite text-brand-violet shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Upload size={16} />
                    <span>Enviar Foto / Código</span>
                  </button>
                </div>

                {activeTab === 'qr' ? (
                  <div className="space-y-4">
                    {/* Scanner Viewport */}
                    <div className="relative h-64 bg-gray-950 rounded-3xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-brand-violet/40">
                      {isScanning ? (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                          <motion.div
                            initial={{ y: -80 }}
                            animate={{ y: 80 }}
                            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.2, ease: 'easeInOut' }}
                            className="w-48 h-1 bg-gradient-to-r from-transparent via-brand-violet to-transparent shadow-[0_0_15px_#7c3aed]"
                          />
                          <div className="absolute inset-0 bg-brand-violet/10 flex items-center justify-center">
                            <span className="text-white text-xs font-bold bg-black/70 px-4 py-2 rounded-full backdrop-blur-md flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-brand-violet animate-ping" />
                              <span>Lançando itens da NFC-e no app...</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-6 space-y-3">
                          <div className="w-16 h-16 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 text-brand-violet flex items-center justify-center mx-auto animate-pulse">
                            <Camera size={32} />
                          </div>
                          <p className="text-xs text-gray-300 max-w-xs">
                            Aponte a câmera para o QR Code da NFC-e ou SAT impresso no cupom do parceiro.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-brand-violet/5 border border-brand-violet/15 p-3.5 rounded-2xl flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-300">
                      <ShieldCheck size={22} className="text-brand-violet shrink-0" />
                      <p>
                        A leitura do cupom lança os pratos e valores consumidos na sua comanda. O pagamento deve ser feito por dentro do app para liberação dos seus Loops de cashback.
                      </p>
                    </div>

                    {/* Quick Test Chips */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-gray-400 block">Comandas de Teste Rápido:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { code: 'LOOP-8821', label: 'Marisqueira Sintra (R$ 241,20)' },
                          { code: 'CMD-4091', label: 'Boteco ORI (R$ 168,00)' },
                          { code: 'TIM-1092', label: 'O Timoneiro (R$ 310,50)' },
                        ].map((test) => (
                          <button
                            key={test.code}
                            type="button"
                            onClick={() => handleSimulateScan(test.code)}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-brand-violet/10 hover:text-brand-violet text-[11px] font-semibold transition-colors"
                          >
                            {test.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSimulateScan('LOOP-8821')}
                      disabled={isScanning}
                      className="w-full bg-gradient-loopis text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-brand-violet/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Sparkles size={18} />
                      <span>{isScanning ? 'Lançando Comanda...' : 'Lançar Comanda via NFC-e'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                        Selecione o Parceiro
                      </label>
                      <select
                        value={selectedRestaurantId}
                        onChange={(e) => setSelectedRestaurantId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-semibold text-brand-graphite dark:text-white outline-none focus:ring-2 focus:ring-brand-violet"
                      >
                        {restaurants.map((r) => (
                          <option key={r.id} value={r.id} className="dark:bg-brand-graphite">
                            {r.nome} ({r.categoria})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                        Valor Total da Nota Fiscal (R$)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 241,20"
                        value={manualAmount}
                        onChange={(e) => setManualAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-semibold text-brand-graphite dark:text-white outline-none focus:ring-2 focus:ring-brand-violet"
                      />
                    </div>

                    <div 
                      onClick={() => handleSimulateScan('LOOP-8821')}
                      className="border-2 border-dashed border-gray-200 dark:border-white/10 p-5 rounded-2xl text-center hover:border-brand-violet/50 transition-colors cursor-pointer bg-gray-50/50 dark:bg-white/[0.02]"
                    >
                      <Upload size={26} className="text-brand-violet mx-auto mb-1" />
                      <p className="text-xs font-bold text-brand-graphite dark:text-white">Anexar Foto ou Cupom Digital</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Extração automática de itens e valores via OCR</p>
                    </div>

                    <button
                      onClick={() => handleSimulateScan('LOOP-8821')}
                      disabled={isScanning}
                      className="w-full bg-gradient-loopis text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-brand-violet/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <ArrowRight size={18} />
                      <span>{isScanning ? 'Processando Comanda...' : 'Lançar Comanda por Foto'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Scanned Fiscal Note Breakdown & Payment/Split Options */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle2 size={18} />
                    <span>Comanda Lançada com Sucesso</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white dark:bg-black/40 px-2 py-0.5 rounded-md text-gray-600 dark:text-gray-300">
                    {scannedReceipt.orderCode}
                  </span>
                </div>

                {/* Restaurant & Table Info */}
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-brand-graphite dark:text-white">
                    {scannedReceipt.restaurantName}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {scannedReceipt.restaurantCategory} • {scannedReceipt.mesa}
                  </p>
                </div>

                {/* Itemized List Extracted from Receipt */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Itens Lidos da Conta:
                  </span>
                  <div className="space-y-2 bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5 max-h-48 overflow-y-auto">
                    {scannedReceipt.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-xs py-1 border-b border-gray-100/60 dark:border-white/5 last:border-0">
                        <div>
                          <p className="font-bold text-brand-graphite dark:text-white">
                            {item.quantity}x {item.name}
                          </p>
                          {item.notes && (
                            <p className="text-[10px] text-gray-400">{item.notes}</p>
                          )}
                        </div>
                        <span className="font-semibold text-brand-graphite dark:text-white shrink-0">
                          R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-gradient-to-r from-purple-50 via-brand-lilac/10 to-purple-50 dark:from-brand-violet/10 dark:via-purple-950/20 dark:to-brand-violet/10 p-4 rounded-2xl border border-brand-violet/20 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal da Comanda:</span>
                    <span>R$ {scannedReceipt.subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {scannedReceipt.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Desconto Especial Aplicado:</span>
                      <span>- R$ {scannedReceipt.discount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-brand-violet/20 font-extrabold text-sm text-brand-graphite dark:text-white">
                    <span>Total da Conta a Pagar:</span>
                    <span className="text-xl text-brand-violet dark:text-brand-lilac">
                      R$ {scannedReceipt.totalAmount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-300 pt-1 font-bold">
                    <span className="flex items-center space-x-1">
                      <Sparkles size={13} className="text-amber-500" />
                      <span>Loops a Receber Após Pagamento no App:</span>
                    </span>
                    <span className="bg-amber-400/20 px-2 py-0.5 rounded-full font-extrabold">
                      +{scannedReceipt.cashbackLoops} Loops
                    </span>
                  </div>
                </div>

                {/* Mandatory In-App Payment Action Options */}
                <div className="space-y-2.5 pt-1">
                  {/* Option A: Direct Full Payment Inside App */}
                  <button
                    type="button"
                    onClick={() => handleGoToCheckout('full')}
                    className="w-full bg-gradient-loopis hover:opacity-95 text-white py-3.5 px-4 rounded-2xl font-bold text-sm shadow-xl shadow-brand-violet/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <CreditCard size={18} />
                    <span>Pagar Conta pelo App (Pix / Cartão)</span>
                  </button>

                  {/* Option B: Split Payment with Friends */}
                  <button
                    type="button"
                    onClick={() => handleGoToCheckout('split')}
                    className="w-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-brand-graphite dark:text-white py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 border border-gray-200/60 dark:border-white/10 cursor-pointer"
                  >
                    <Users size={16} className="text-brand-violet" />
                    <span>Dividir Conta com Amigos (Split Payment)</span>
                  </button>

                  {/* Option C: Order Summary Details */}
                  <button
                    type="button"
                    onClick={handleGoToOrderSummary}
                    className="w-full py-2 text-xs text-gray-500 hover:text-brand-violet font-semibold transition-colors flex items-center justify-center space-x-1"
                  >
                    <Utensils size={13} />
                    <span>Ver Resumo Completo e Aplicar Cupons</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
