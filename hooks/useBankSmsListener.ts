import { useAuthStore } from '@/Flow/authStore';
import { parseAuthSms } from '@/Flow/smsAuthParser';
import { parseBalanceFromSms } from '@/Flow/smsBalanceParser';
import { useEffect } from 'react';
import { NativeEventEmitter, Platform } from 'react-native';

import { useTotalBalanceFromSms } from './useTotalBalance';

type BankSmsEvent = { address?: string; body: string; date: number };

export function useBankSmsListener(onNewSms?: (event: BankSmsEvent) => void) {

  const { updateBalance } = useTotalBalanceFromSms();
  const authStore = useAuthStore();

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const emitter = new NativeEventEmitter();

    const sub = emitter.addListener('bankSms', (event: BankSmsEvent) => {
      const { address, body, date } = event;
      console.log('[bankSms]', address ?? '', body.slice(0, 60));

      const receivedAt = new Date(date);
      authStore.setLastBankSmsAt(receivedAt);

      const auth = parseAuthSms(body);
      if (auth) {
        authStore.setLastAuthAt(receivedAt);

        const prefix = auth.cardNumber.slice(0, 4) || null;
        if (prefix) authStore.setCardPrefix(prefix);
      }

      const cardPrefix = authStore.cardPrefix ?? undefined;
      const parsed = parseBalanceFromSms(body, cardPrefix);
      if (parsed) {
        updateBalance(() => parsed.balance);
      }

      if (onNewSms) {
        onNewSms(event);
      }
    });

    return () => {
      sub.remove();
    };
  }, [authStore, updateBalance, onNewSms]);
}