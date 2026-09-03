import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  DollarSign, 
  CheckCircle, 
  User, 
  QrCode, 
  Camera, 
  Receipt, 
  Plus, 
  Minus, 
  Trash2, 
  UtensilsCrossed, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { ComandaItem, ComandaRecord, PartnerActivityRecord } from '../../types';

export const ManualEntry: React.FC = () => {
  const { menuItems, addComanda, addPartnerActivity } = useStore();
  
  const [activeTab, setActiveTab] = useState<'cardapio' | 'avulso' | 'nota'>('cardapio');
  const [step, setStep] = useState<'build' | 'qr_present' | 'processing' | 'success'>('build');
  
  // Cliente & Mesa
  const [clientName, setClientName] = useState('Carlos Souza');
  const [clientPhone, setClientPhone] = useState('(48) 97777-7777');
  const [tableRef, setTableRef] = useState('Mesa 04');
  
  // Itens Selecionados da Comanda
  const [selectedItems, setSelectedItems] = useState<{ item: typeof menuItems[0]; qty: number }[]>([
    { item: menuItems[0] || { id: 'm1', nome: 'Sequência de Camarão', preco: 148, imagemUrl: '' }, qty: 1 },
    { item: menuItems[1] || { id: 'm2', nome: 'Ostras Gratinadas', preco: 62, imagemUrl: '' }, qty: 1 }
  ]);

  // Valor Avulso
  const [customAmount, setCustomAmount] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  // Imagem do Cupom Fiscal / Nota
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isScanningOcr, setIsScanningOcr] = useState(false);

  // Link / QR Copiado
  const [generatedComanda, setGeneratedComanda] = useState<ComandaRecord | null>(null);

  // Cálculos
  const subtotal = activeTab === 'avulso'
    ? parseFloat(customAmount || '0')
    : selectedItems.reduce((acc, curr) => acc + (curr.item.preco * curr.qty), 0);
  
  const taxaServico = subtotal * 0.10;
  const total = subtotal + taxaServico;
  const loopsEstimados = Math.floor(total);

  const handleAddItem = (item: typeof menuItems[0]) => {
    const existing = selectedItems.find(i => i.item.id === item.id);
    if (existing) {
      setSelectedItems(selectedItems.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setSelectedItems([...selectedItems, { item, qty: 1 }]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const existing = selectedItems.find(i => i.item.id === itemId);
    if (existing && existing.qty > 1) {
      setSelectedItems(selectedItems.map(i => i.item.id === itemId ? { ...i, qty: i.qty - 1 } : i));
    } else {
      setSelectedItems(selectedItems.filter(i => i.item.id !== itemId));
    }
  };

  const handleSimulateOcrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
        setIsScanningOcr(true);
        setTimeout(() => {
          setIsScanningOcr(false);
          setCustomAmount('272.00');
          setCustomDescription('Cupom Fiscal #09281 - Leitura IA Automática');
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAndShowQr = () => {
    if (total <= 0) return;

    const comandaCode = `COM-${Math.floor(1000 + Math.random() * 9000)}`;
    const comandaItens: ComandaItem[] = activeTab === 'avulso'
      ? [{ id: 'custom', nome: customDescription || 'Consumo no Estabelecimento', precoUnitario: parseFloat(customAmount || '0'), quantidade: 1 }]
      : selectedItems.map(i => ({ id: i.item.id, nome: i.item.nome, precoUnitario: i.item.preco, quantidade: i.qty, imagemUrl: i.item.imagemUrl }));

    const newComanda: ComandaRecord = {
      id: `cmd-${Date.now()}`,
      comandaCode,
      clienteNome: clientName || 'Cliente Loopis',
      clienteTelefone: clientPhone,
      mesaOuReferencia: tableRef,
      data: new Date().toISOString().split('T')[0],
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      itens: comandaItens,
      subtotal,
      taxaServico,
      descontoLoops: 0,
      total,
      status: 'aguardando_pagamento',
      origemEmissao: 'restaurante',
      fotoCupomUrl: receiptImage || undefined,
      qrCodeData: `https://loopis.com.br/checkout/split?comanda=${comandaCode}&total=${total.toFixed(2)}`
    };

    setGeneratedComanda(newComanda);
    addComanda(newComanda);
    setStep('qr_present');
  };

  const handleConfirmDirectPayment = (method: 'pix' | 'cartao' | 'split') => {
    setStep('processing');
    setTimeout(() => {
      if (generatedComanda) {
        // Criar registro de atividade no histórico
        const newActivity: PartnerActivityRecord = {
          id: `act-${Date.now()}`,
          partnerId: '1',
          partnerNome: 'Ostraria do Córrego',
          tipoParceiro: 'restaurante',
          data: new Date().toISOString().split('T')[0],
          horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          clienteNome: generatedComanda.clienteNome,
          clienteTelefone: generatedComanda.clienteTelefone || '',
          statusPresenca: 'compareceu',
          horarioCheckin: 'Presença Confirmada',
          pessoasQtd: 2,
          totalGasto: generatedComanda.total,
          loopsGerados: Math.floor(generatedComanda.total),
          beneficioUtilizado: 'Pagamento de Comanda Emitida pelo Restaurante',
          comanda: { ...generatedComanda, status: 'paga', formaPagamento: method }
        };
        addPartnerActivity(newActivity);
      }
      setStep('success');
    }, 1500);
  };

  const handleReset = () => {
    setSelectedItems([]);
    setCustomAmount('');
    setReceiptImage(null);
    setGeneratedComanda(null);
    setStep('build');
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-graphite dark:text-white">
          Emissor de Comanda & Cobrança (Caixa / Garçom)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Lance os pratos do cardápio ou cupom fiscal e gere o QR Code para o cliente pagar e dividir pelo App Loopis.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'build' && (
          <motion.div 
            key="build"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Coluna da Esquerda: Lançamento de Itens / Valores */}
            <div className="lg:col-span-2 space-y-6">
              {/* Identificação do Cliente e Mesa */}
              <div className="glassmorphism p-5 rounded-3xl border border-gray-100 dark:border-white/10 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-2">
                  <User size={16} className="text-brand-violet" />
                  <span>Identificação da Mesa / Cliente</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Mesa / Comanda #</label>
                    <input 
                      type="text" 
                      value={tableRef} 
                      onChange={(e) => setTableRef(e.target.value)}
                      placeholder="Mesa 04" 
                      className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xs font-bold text-brand-graphite dark:text-white focus:ring-2 focus:ring-brand-violet outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Nome do Cliente</label>
                    <input 
                      type="text" 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Nome do cliente" 
                      className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xs font-bold text-brand-graphite dark:text-white focus:ring-2 focus:ring-brand-violet outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">WhatsApp / Telefone</label>
                    <input 
                      type="text" 
                      value={clientPhone} 
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="(48) 99999-9999" 
                      className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xs font-bold text-brand-graphite dark:text-white focus:ring-2 focus:ring-brand-violet outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tabs de Modo de Lançamento */}
              <div className="flex space-x-2 bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('cardapio')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    activeTab === 'cardapio' ? 'bg-white dark:bg-black/40 text-brand-violet shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <UtensilsCrossed size={16} />
                  <span>Cardápio Cadastrado</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('avulso')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    activeTab === 'avulso' ? 'bg-white dark:bg-black/40 text-brand-violet shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <DollarSign size={16} />
                  <span>Valor Avulso</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('nota')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    activeTab === 'nota' ? 'bg-white dark:bg-black/40 text-brand-violet shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Receipt size={16} />
                  <span>Cupom Fiscal / IA</span>
                </button>
              </div>

              {/* Conteúdo Tab: Cardápio */}
              {activeTab === 'cardapio' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Selecione os Pratos Consumidos:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                    {menuItems.map((item) => {
                      const count = selectedItems.find(i => i.item.id === item.id)?.qty || 0;
                      return (
                        <div 
                          key={item.id} 
                          className={`p-3 rounded-2xl border transition-all flex items-center space-x-3 ${
                            count > 0 ? 'bg-brand-violet/5 border-brand-violet/40' : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10'
                          }`}
                        >
                          <img src={item.imagemUrl} alt={item.nome} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-brand-graphite dark:text-white truncate">{item.nome}</h5>
                            <span className="text-xs font-bold text-brand-violet">R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            {count > 0 && (
                              <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500 cursor-pointer"
                              >
                                <Minus size={14} />
                              </button>
                            )}
                            {count > 0 && <span className="text-xs font-bold w-4 text-center">{count}</span>}
                            <button 
                              onClick={() => handleAddItem(item)}
                              className="w-7 h-7 rounded-lg bg-brand-violet text-white flex items-center justify-center hover:opacity-90 cursor-pointer shadow-sm"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Conteúdo Tab: Avulso */}
              {activeTab === 'avulso' && (
                <div className="glassmorphism p-5 rounded-3xl border border-gray-100 dark:border-white/10 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Valor Total do Consumo (R$)</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xl font-black text-brand-graphite dark:text-white focus:ring-2 focus:ring-brand-violet outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição / Detalhamento (Opcional)</label>
                    <input 
                      type="text"
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Ex: Jantar executivo 2 pessoas + bebidas"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xs text-brand-graphite dark:text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Conteúdo Tab: Nota Fiscal */}
              {activeTab === 'nota' && (
                <div className="glassmorphism p-5 rounded-3xl border border-gray-100 dark:border-white/10 space-y-4 text-center">
                  <div className="border-2 border-dashed border-brand-violet/30 rounded-2xl p-6 flex flex-col items-center justify-center">
                    {receiptImage ? (
                      <div className="relative max-h-48 rounded-xl overflow-hidden mb-3">
                        <img src={receiptImage} alt="Cupom" className="h-44 object-contain" />
                        <button 
                          onClick={() => { setReceiptImage(null); setCustomAmount(''); }}
                          className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <Camera size={36} className="text-brand-violet mb-2" />
                        <span className="text-xs font-bold text-brand-graphite dark:text-white">Fotografar ou Enviar Foto do Cupom Fiscal</span>
                        <span className="text-[10px] text-gray-400 mt-1">Leitura automática de valor e itens com IA</span>
                        <input type="file" accept="image/*" onChange={handleSimulateOcrUpload} className="hidden" />
                      </label>
                    )}

                    {isScanningOcr && (
                      <div className="flex items-center space-x-2 text-xs text-brand-violet font-bold mt-3 animate-pulse">
                        <RefreshCw size={14} className="animate-spin" />
                        <span>IA processando cupom e identificando valor...</span>
                      </div>
                    )}
                  </div>
                  {customAmount && (
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 text-xs font-bold">
                      Valor Identificado com Sucesso: R$ {customAmount}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Coluna da Direita: Resumo da Comanda & Ação */}
            <div className="space-y-4">
              <div className="glassmorphism p-5 rounded-3xl border border-gray-100 dark:border-white/10 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Resumo da Comanda</h3>
                
                {/* Lista de itens selecionados */}
                <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5 text-xs">
                  {activeTab === 'cardapio' ? (
                    selectedItems.map(i => (
                      <div key={i.item.id} className="pt-2 flex justify-between items-center">
                        <span className="truncate pr-2">{i.qty}x {i.item.nome}</span>
                        <span className="font-bold shrink-0">R$ {(i.item.preco * i.qty).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 flex justify-between items-center">
                      <span className="truncate">{customDescription || 'Consumo Avulso'}</span>
                      <span className="font-bold">R$ {parseFloat(customAmount || '0').toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Subtotais */}
                <div className="pt-3 border-t border-gray-200 dark:border-white/10 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Taxa de Serviço (10%):</span>
                    <span>R$ {taxaServico.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-brand-graphite dark:text-white pt-2 border-t border-gray-100 dark:border-white/5">
                    <span>Total a Pagar:</span>
                    <span className="text-brand-violet text-base">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Estimativa de Cashback em Loops */}
                <div className="bg-brand-violet/10 p-3 rounded-2xl flex items-center space-x-2 border border-brand-violet/20">
                  <Sparkles size={18} className="text-brand-violet shrink-0" />
                  <span className="text-[11px] font-bold text-brand-deep-purple dark:text-brand-lilac">
                    Cliente receberá aprox. {loopsEstimados} Loops de Cashback!
                  </span>
                </div>

                {/* Botão de Emissão de QR */}
                <button
                  type="button"
                  onClick={handleCreateAndShowQr}
                  disabled={total <= 0}
                  className="w-full bg-gradient-loopis text-white py-3.5 rounded-2xl text-xs font-bold shadow-lg hover:shadow-brand-violet/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <QrCode size={18} />
                  <span>Gerar QR Code para o Cliente Pagar</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP QR PRESENT: MOSTRA QR CODE PARA O CLIENTE ESCANEAR OU PAGAR */}
        {step === 'qr_present' && generatedComanda && (
          <motion.div
            key="qr_present"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto glassmorphism p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-white/10 text-center space-y-6"
          >
            <div>
              <span className="px-3 py-1 bg-brand-violet/10 text-brand-violet text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                {generatedComanda.comandaCode} • {generatedComanda.mesaOuReferencia}
              </span>
              <h2 className="text-xl font-black text-brand-graphite dark:text-white mt-2">
                Apresente o QR Code ao Cliente
              </h2>
              <p className="text-xs text-gray-500">
                O cliente pode escanear com a câmera do app Loopis para pagar ou dividir a conta.
              </p>
            </div>

            {/* QR Code Canvas */}
            <div className="p-4 bg-white rounded-3xl shadow-xl border border-gray-200 inline-block">
              <QRCodeSVG 
                value={generatedComanda.qrCodeData || 'https://loopis.com.br'} 
                size={210} 
                level="H"
                includeMargin
              />
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Cliente:</span>
                <span className="font-bold text-brand-graphite dark:text-white">{generatedComanda.clienteNome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total da Conta:</span>
                <span className="font-black text-brand-violet text-sm">R$ {generatedComanda.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Opções Rápidas de Finalização no Balcão */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Ou confirme o pagamento direto no caixa:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleConfirmDirectPayment('pix')}
                  className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
                >
                  Pago via PIX
                </button>
                <button
                  onClick={() => handleConfirmDirectPayment('cartao')}
                  className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-xs font-bold transition-all cursor-pointer"
                >
                  Pago no Cartão
                </button>
                <button
                  onClick={() => handleConfirmDirectPayment('split')}
                  className="p-2.5 rounded-xl bg-brand-violet/10 text-brand-violet hover:bg-brand-violet/20 text-xs font-bold transition-all cursor-pointer"
                >
                  Pago via Split App
                </button>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold block mx-auto pt-2 cursor-pointer"
            >
              Cancelar e Voltar
            </button>
          </motion.div>
        )}

        {/* STEP PROCESSING */}
        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center space-y-4"
          >
            <div className="w-16 h-16 border-4 border-brand-violet border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-bold text-brand-graphite dark:text-white">Computando Pagamento e Loops...</h3>
            <p className="text-xs text-gray-500">Registrando no histórico de atividades e creditando cashback.</p>
          </motion.div>
        )}

        {/* STEP SUCCESS */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto glassmorphism p-8 rounded-3xl border border-gray-100 dark:border-white/10 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle size={44} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-brand-graphite dark:text-white">
                Comanda Finalizada com Sucesso!
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                A comanda foi registrada no histórico de atividades e o cliente já recebeu os Loops correspondentes.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-gradient-loopis text-white py-3.5 rounded-2xl text-xs font-bold shadow-md cursor-pointer"
              >
                Lançar Nova Comanda
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
