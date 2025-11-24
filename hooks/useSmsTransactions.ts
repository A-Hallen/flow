import { useCallback, useEffect, useRef, useState } from 'react';

import { getTransactionsFromSms, type GetTransactionsOptions } from '../Flow/smsTransactionService';
import type { SmsTransaction } from '../Flow/smsTransactionTypes';

export type UseSmsTransactionsState = {
  transactions: SmsTransaction[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
};

const PAGE_SIZE = 30;

export function useSmsTransactions(initialOptions: GetTransactionsOptions = {}): UseSmsTransactionsState {
  const [transactions, setTransactions] = useState<SmsTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const optionsRef = useRef<GetTransactionsOptions>(initialOptions);

  const loadPage = useCallback(async (pageNumber: number) => {
    const maxMessages = pageNumber * PAGE_SIZE;
    const opts: GetTransactionsOptions = {
      ...optionsRef.current,
      maxMessages,
    };
    const data = await getTransactionsFromSms(opts);
    setTransactions(data);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPage(1);
      await loadPage(1);
    } catch {
      setError('Ocurrió un problema al cargar tu historial.');
    } finally {
      setLoading(false);
    }
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      setPage(nextPage);
      await loadPage(nextPage);
    } catch {
      setError('Ocurrió un problema al cargar más transacciones.');
    } finally {
      setLoadingMore(false);
    }
  }, [loadPage, loading, loadingMore, page]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    transactions,
    loading,
    loadingMore,
    error,
    refresh,
    loadMore,
  };
}
