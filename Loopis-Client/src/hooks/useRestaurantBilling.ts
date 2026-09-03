import { useState, useEffect, useMemo } from 'react';
import type { RestaurantBillingSettings, CommercialSimulationResult } from '../types';
import { mockApi } from '../services/mockApi';

export interface FormErrors {
  monthlyFeeAmount?: string;
  commissionPercent?: string;
  loopConversionRate?: string;
  invoiceDueDay?: string;
}

export const useRestaurantBilling = (restaurantId: string = 'marisqueira-sintra') => {
  const [settings, setSettings] = useState<RestaurantBillingSettings>({
    restaurantId,
    restaurantName: 'Marisqueira Sintra',
    hasMonthlyFee: true,
    monthlyFeeAmount: 249.90,
    commissionPercent: 12.5,
    acceptsLoopCredits: true,
    loopConversionRate: 1.0,
    invoiceDueDay: 10,
    bankAccountInfo: {
      bank: 'Banco Itaú (341)',
      accountType: 'corrente',
      agency: '1420',
      accountNumber: '48201-9',
      pixKey: '12.345.678/0001-90',
    },
    updatedAt: new Date().toISOString(),
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Simulation GMV benchmark
  const [simulatedMonthlyGmv, setSimulatedMonthlyGmv] = useState<number>(35000.00);

  // Load initial settings
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const data = await mockApi.getRestaurantBillingSettings(restaurantId);
        if (isMounted) {
          setSettings(data);
        }
      } catch {
        // use fallback initial
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [restaurantId]);

  // Form field changes
  const setField = <K extends keyof RestaurantBillingSettings>(
    field: K,
    value: RestaurantBillingSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear field error on edit
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validation function
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (settings.hasMonthlyFee) {
      if (settings.monthlyFeeAmount === undefined || settings.monthlyFeeAmount === null || isNaN(settings.monthlyFeeAmount)) {
        newErrors.monthlyFeeAmount = 'Informe o valor da mensalidade.';
      } else if (settings.monthlyFeeAmount < 0) {
        newErrors.monthlyFeeAmount = 'A mensalidade não pode ser negativa.';
      }
    }

    if (settings.commissionPercent === undefined || settings.commissionPercent === null || isNaN(settings.commissionPercent)) {
      newErrors.commissionPercent = 'Informe a taxa de comissão Loopis.';
    } else if (settings.commissionPercent < 0 || settings.commissionPercent > 100) {
      newErrors.commissionPercent = 'A comissão deve estar entre 0% e 100%.';
    }

    if (settings.acceptsLoopCredits) {
      if (!settings.loopConversionRate || settings.loopConversionRate <= 0) {
        newErrors.loopConversionRate = 'A taxa de conversão deve ser superior a 0.';
      }
    }

    if (!settings.invoiceDueDay || settings.invoiceDueDay < 1 || settings.invoiceDueDay > 31) {
      newErrors.invoiceDueDay = 'Dia de vencimento deve ser entre 1 e 31.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save handler
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await mockApi.saveRestaurantBillingSettings(settings);
      setSettings(res.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  // Live commercial projection
  const projection: CommercialSimulationResult = useMemo(() => {
    return mockApi.calculateCommercialProjection(simulatedMonthlyGmv, settings);
  }, [simulatedMonthlyGmv, settings]);

  return {
    settings,
    setField,
    isLoading,
    isSaving,
    saveSuccess,
    errors,
    handleSave,
    simulatedMonthlyGmv,
    setSimulatedMonthlyGmv,
    projection,
  };
};
