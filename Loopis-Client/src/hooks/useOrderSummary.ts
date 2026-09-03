import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Order, Coupon } from '../types';
import { mockApi } from '../services/mockApi';

interface UseOrderSummaryOptions {
  initialCode?: string;
}

export const useOrderSummary = ({ initialCode }: UseOrderSummaryOptions = {}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const codeParam = searchParams.get('code') || initialCode || 'LOOP-8821';

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const loadOrder = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mockApi.fetchOrderReceipt(code);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Não foi possível carregar os detalhes da comanda.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (codeParam) {
      loadOrder(codeParam);
    }
  }, [codeParam, loadOrder]);

  // Apply extra coupon
  const handleApplyCoupon = async (codeToApply: string) => {
    if (!codeToApply.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await mockApi.validateCoupon(codeToApply, order?.restaurantId);
      if (res.valid && res.coupon) {
        setAppliedCoupon(res.coupon);
        setCouponCodeInput('');
      } else {
        setCouponError(res.error || 'Cupom inválido.');
      }
    } catch (err: any) {
      setCouponError(err.message || 'Erro ao validar cupom.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Financial calculations
  const calculation = useMemo(() => {
    if (!order) {
      return {
        subtotal: 0,
        baseDiscount: 0,
        couponDiscount: 0,
        serviceFee: 0,
        netPayable: 0,
        earnedLoops: 0,
      };
    }

    const subtotal = order.subtotal;
    const baseDiscount = order.appliedDiscount?.amount || 0;

    let couponDiscount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        couponDiscount = Number(((subtotal * appliedCoupon.discountValue) / 100).toFixed(2));
      } else {
        couponDiscount = Math.min(subtotal, appliedCoupon.discountValue);
      }
    }

    const serviceFee = order.serviceChargeAmount || 0;
    const netPayable = Math.max(0, Number((subtotal - baseDiscount - couponDiscount + serviceFee).toFixed(2)));
    const earnedLoops = Math.round(netPayable * 1.0); // 1 Loop por R$ 1 gasto

    return {
      subtotal,
      baseDiscount,
      couponDiscount,
      serviceFee,
      netPayable,
      earnedLoops,
    };
  }, [order, appliedCoupon]);

  const proceedToCheckout = () => {
    if (!order) return;
    navigate(`/checkout/split?orderCode=${order.code}&netTotal=${calculation.netPayable}&subtotal=${calculation.subtotal}&discount=${calculation.baseDiscount + calculation.couponDiscount}&tab=full`);
  };

  return {
    order,
    isLoading,
    error,
    reload: () => loadOrder(codeParam),
    appliedCoupon,
    couponCodeInput,
    setCouponCodeInput,
    couponLoading,
    couponError,
    handleApplyCoupon,
    handleRemoveCoupon,
    calculation,
    proceedToCheckout,
  };
};
