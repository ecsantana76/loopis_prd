import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  User as UserIcon, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  QrCode
} from 'lucide-react';
import { useOrderSummary } from '../hooks/useOrderSummary';
import { OrderItemList } from '../components/order/OrderItemList';
import { FinancialBreakdown } from '../components/order/FinancialBreakdown';

export const OrderSummaryPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    order,
    isLoading,
    error,
    reload,
    userLoopsBalance,
    useLoopsBalance,
    setUseLoopsBalance,
    appliedCoupon,
    couponCodeInput,
    setCouponCodeInput,
    couponLoading,
    couponError,
    handleApplyCoupon,
    handleRemoveCoupon,
    calculation,
    proceedToCheckout,
  } = useOrderSummary({ userLoopsBalance: 240 });

  return (
    <div className="min-h-screen bg-brand-off-white dark:bg-brand-graphite pb-24 pt-4 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/scanner')}
            className="p-2.5 rounded-2xl bg-white dark:bg-white/10 text-brand-graphite dark:text-white hover:bg-gray-100 dark:hover:bg-white/15 border border-gray-200/60 dark:border-white/10 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold text-brand-graphite dark:text-white">
              Resumo da Comanda
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {order ? order.code : 'Carregando conta...'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/scanner')}
            className="p-2.5 rounded-2xl bg-white dark:bg-white/10 text-brand-violet hover:bg-brand-violet/10 border border-gray-200/60 dark:border-white/10 transition-all shadow-sm"
            title="Escanear outra comanda"
          >
            <QrCode size={20} />
          </button>
        </div>

        {isLoading && (
          <div className="space-y-4 py-8">
            <div className="h-28 bg-gray-200 dark:bg-white/5 rounded-3xl animate-pulse" />
            <div className="h-64 bg-gray-200 dark:bg-white/5 rounded-3xl animate-pulse" />
            <div className="h-48 bg-gray-200 dark:bg-white/5 rounded-3xl animate-pulse" />
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 dark:bg-red-950/30 rounded-3xl p-8 border border-red-500/20 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-red-900 dark:text-red-300">
                Não foi possível carregar a comanda
              </h3>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-sm mx-auto">
                {error}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={reload}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow"
              >
                <RefreshCw size={14} />
                <span>Tentar Novamente</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/scanner')}
                className="px-4 py-2.5 bg-white dark:bg-white/10 text-brand-graphite dark:text-white rounded-xl text-xs font-bold border border-gray-200 dark:border-white/10"
              >
                Voltar ao Scanner
              </button>
            </div>
          </div>
        )}

        {order && !isLoading && (
          <>
            <div className="bg-white dark:bg-brand-graphite rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-loopis text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0 overflow-hidden">
                  {order.restaurantLogo ? (
                    <img src={order.restaurantLogo} alt={order.restaurantName || 'Restaurante'} className="w-full h-full object-cover" />
                  ) : (
                    (order.restaurantName?.charAt(0) || 'R').toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-brand-graphite dark:text-white">
                      {order.restaurantName}
                    </h2>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                      Aberta
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin size={12} className="text-brand-violet" />
                      <span>{order.tableNumber || 'Mesa não atribuída'}</span>
                    </span>
                    {order.serverName && (
                      <>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <UserIcon size={12} />
                          <span>Atendente: {order.serverName}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-gray-400 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                <span className="font-mono bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg text-brand-graphite dark:text-white font-bold">
                  {order.code}
                </span>
                <span className="flex items-center space-x-1 mt-1 text-[11px]">
                  <Clock size={12} />
                  <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              </div>
            </div>

            <OrderItemList items={order.items} />

            <FinancialBreakdown
              subtotal={calculation.subtotal}
              baseDiscount={calculation.baseDiscount}
              baseDiscountDesc={order.appliedDiscount?.description}
              couponDiscount={calculation.couponDiscount}
              appliedCoupon={appliedCoupon}
              couponCodeInput={couponCodeInput}
              onCouponCodeChange={setCouponCodeInput}
              onApplyCoupon={() => handleApplyCoupon(couponCodeInput)}
              onRemoveCoupon={handleRemoveCoupon}
              couponLoading={couponLoading}
              couponError={couponError}
              serviceFee={calculation.serviceFee}
              userLoopsBalance={userLoopsBalance}
              useLoopsBalance={useLoopsBalance}
              onToggleLoops={setUseLoopsBalance}
              loopDiscountAmount={calculation.loopDiscountAmount}
              loopsApplied={calculation.loopsApplied}
              netPayable={calculation.netPayable}
              earnedLoops={calculation.earnedLoops}
              onProceedToCheckout={proceedToCheckout}
            />
          </>
        )}
      </div>
    </div>
  );
};
