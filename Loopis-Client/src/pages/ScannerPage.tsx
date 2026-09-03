import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { CameraViewfinder } from '../components/scanner/CameraViewfinder';
import { ManualCodeModal } from '../components/scanner/ManualCodeModal';
import { mockApi } from '../services/mockApi';

export const ScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProcessCode = async (rawCode: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const order = await mockApi.fetchOrderReceipt(rawCode);
      setIsManualModalOpen(false);
      navigate(`/order-summary?code=${order.code}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Cupom ou comanda não localizada. Verifique o código e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-brand-off-white pb-24 pt-4 dark:bg-brand-graphite">
      <div className="max-w-md mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-2xl bg-white dark:bg-white/10 text-brand-graphite dark:text-white hover:bg-gray-100 dark:hover:bg-white/15 border border-gray-200/60 dark:border-white/10 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold text-brand-graphite dark:text-white">
              Scanner de Comanda
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Aproxime do QR Code da sua mesa
            </p>
          </div>

          <div className="w-10 h-10 flex items-center justify-center text-brand-violet">
            <Sparkles size={20} />
          </div>
        </div>

        <CameraViewfinder
          onScanSuccess={handleProcessCode}
          onOpenManualInput={() => setIsManualModalOpen(true)}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage(null)}
        />

        <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 shadow-sm flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
          <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
          <p className="leading-relaxed">
            Seus dados estão protegidos. A leitura identifica sua conta em tempo real com descontos e cashback aplicados.
          </p>
        </div>
      </div>

      <ManualCodeModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={handleProcessCode}
        isLoading={isLoading}
      />
    </div>
  );
};
