import { useCallback, useState } from 'react';
import { getTotalBalanceFromSms, type GetTotalBalanceOptions, type SmsBalanceResult } from '../Flow/smsBalanceService';

type UseTotalBalanceState = {
  balance: number | null;
  loading: boolean;
  error: string | null;
  lastResult: SmsBalanceResult | null;
  refresh: (options?: GetTotalBalanceOptions) => Promise<void>;
  updateBalance: (updater: (prev: number | null) => number | null) => void;
};

export function useTotalBalanceFromSms(initialBalance: number | null = null): UseTotalBalanceState {
  const [balance, setBalance] = useState<number | null>(initialBalance);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SmsBalanceResult | null>(null);

  const refresh = useCallback(async (options?: GetTotalBalanceOptions) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTotalBalanceFromSms(options);
      if (!result) {
        return;
      }
      setBalance(result.balance);
      setLastResult(result);
    } catch (e) {
      console.log('[sms] hook error', e);
      setError('Ocurrió un problema al actualizar tu saldo.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBalance = useCallback((updater: (prev: number | null) => number | null) => {
    setBalance((prev) => updater(prev));
  }, []);

  return {
    balance,
    loading,
    error,
    lastResult,
    refresh,
    updateBalance,
  };
}
