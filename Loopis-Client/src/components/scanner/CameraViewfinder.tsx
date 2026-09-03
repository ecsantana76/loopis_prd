import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, RefreshCw, Upload, AlertCircle, Sparkles, QrCode } from 'lucide-react';

interface CameraViewfinderProps {
  onScanSuccess: (code: string) => void;
  onOpenManualInput: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  onScanSuccess,
  onOpenManualInput,
  isLoading = false,
  errorMessage = null,
  onClearError,
}) => {
  const [torchActive, setTorchActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const handleSimulateScan = (code: string) => {
    if (isLoading) return;
    if (onClearError) onClearError();
    onScanSuccess(code);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSimulateScan('LOOP-8821');
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-4/5 rounded-3xl overflow-hidden bg-brand-graphite shadow-2xl border border-white/10 flex flex-col justify-between p-4 select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-950/40 to-black/90 pointer-events-none" />
      
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex items-center justify-between px-2 pt-2">
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Leitor Loopis IA</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setTorchActive(!torchActive)}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
              torchActive
                ? 'bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/30'
                : 'bg-black/40 text-white border-white/10 hover:bg-white/10'
            }`}
            title="Alternar Lanterna"
          >
            <Zap size={18} />
          </button>

          <button
            type="button"
            onClick={() => setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all"
            title="Inverter Câmera"
          >
            <RefreshCw size={18} className={facingMode === 'user' ? 'rotate-180 transition-transform' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-violet rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-violet rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-violet rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-violet rounded-br-xl" />

          {!isLoading && !errorMessage && (
            <motion.div
              className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-brand-lilac to-transparent shadow-[0_0_15px_#C4A1F5]"
              animate={{
                top: ['5%', '95%', '5%'],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 pointer-events-none">
            <QrCode size={48} className="opacity-40 mb-2" />
            <p className="text-[11px] font-semibold tracking-wider uppercase text-center px-4 text-white/60">
              Aponte para o QR Code da mesa ou comanda
            </p>
          </div>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20 border border-brand-violet/40"
            >
              <div className="relative mb-4">
                <div className="w-14 h-14 rounded-full border-4 border-brand-violet/20 border-t-brand-lilac animate-spin" />
                <Sparkles size={20} className="absolute inset-0 m-auto text-brand-lilac animate-pulse" />
              </div>
              <h4 className="text-white font-bold text-sm mb-1">Processando Leitura</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Consultando dados da comanda no restaurante...
              </p>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-red-950/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-5 text-center z-20 border border-red-500/40"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
                <AlertCircle size={28} />
              </div>
              <h4 className="text-white font-bold text-sm mb-1">Falha na Leitura</h4>
              <p className="text-red-200 text-xs mb-4 leading-relaxed line-clamp-3">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={onClearError}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Tentar Novamente
              </button>
            </motion.div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-xs">
          <span className="text-[10px] text-gray-400 w-full text-center mb-0.5">Testes rápidos de leitura:</span>
          <button
            type="button"
            onClick={() => handleSimulateScan('LOOP-8821')}
            className="px-2.5 py-1 bg-white/10 hover:bg-brand-violet/40 text-white rounded-lg text-[11px] font-mono transition-colors border border-white/10"
          >
            LOOP-8821
          </button>
          <button
            type="button"
            onClick={() => handleSimulateScan('CMD-4091')}
            className="px-2.5 py-1 bg-white/10 hover:bg-brand-violet/40 text-white rounded-lg text-[11px] font-mono transition-colors border border-white/10"
          >
            CMD-4091
          </button>
          <button
            type="button"
            onClick={() => handleSimulateScan('CMD-PAGA')}
            className="px-2 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg text-[10px] font-mono transition-colors border border-red-500/20"
            title="Simular erro de comanda liquidada"
          >
            Erro: Paga
          </button>
          <button
            type="button"
            onClick={() => handleSimulateScan('CUPOM-EXP')}
            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded-lg text-[10px] font-mono transition-colors border border-amber-500/20"
            title="Simular erro de cupom expirado"
          >
            Erro: Expirado
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-3 pt-2">
        <label className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/10 text-white text-xs font-semibold cursor-pointer transition-all">
          <Upload size={16} className="text-brand-lilac" />
          <span>Enviar Foto</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>

        <button
          type="button"
          onClick={onOpenManualInput}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-gradient-loopis hover:opacity-95 active:scale-98 text-white text-xs font-bold transition-all shadow-lg shadow-brand-violet/30 cursor-pointer"
        >
          <Camera size={16} />
          <span>Digitar Código</span>
        </button>
      </div>
    </div>
  );
};
