import { useEffect, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { syncAuthStatus } from '@/Flow/authService';
import { hasRecentBankSms, useAuthStore } from '@/Flow/authStore';
import { useCardConfigStore } from '@/Flow/cardConfigStore';
import { getCardMetaFromNumber } from '@/Flow/cardMeta';
import type { SmsTransaction } from '@/Flow/smsTransactionTypes';
import { sendBalanceUssd, sendLoginUssd } from '@/Flow/ussdService';
import { FlowCardConfigView } from '@/components/flow/FlowCardConfigView';
import { FlowErrorDialog } from '@/components/flow/FlowErrorDialog';
import { FlowHeader } from '@/components/flow/FlowHeader';
import { FlowHistoryView } from '@/components/flow/FlowHistoryView';
import { FlowHomeView, FlowTransaction, FlowTransactionCategory } from '@/components/flow/FlowHomeView';
import { FlowTabBar, FlowTabKey } from '@/components/flow/FlowTabBar';
import { FlowTransferView } from '@/components/flow/FlowTransferView';
import { useBankSmsListener } from '@/hooks/useBankSmsListener';
import { useContactsByPhone } from '@/hooks/useContactsByPhone';
import { useSmsTransactions } from '@/hooks/useSmsTransactions';
import { useTotalBalanceFromSms } from '@/hooks/useTotalBalance';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<FlowTabKey>('home');
  const { balance, loading, error, lastResult, refresh, updateBalance } = useTotalBalanceFromSms(1250.5);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('No se pudo actualizar tu saldo en este momento.');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCardConfig, setShowCardConfig] = useState(false);
  const authState = useAuthStore();
  const { getContactByPhone } = useContactsByPhone();
  const [historyFilter, setHistoryFilter] = useState<'all' | 'in' | 'out'>('all');
  const {
    transactions: smsTransactions,
    loading: loadingTx,
    loadingMore: loadingMoreTx,
    error: txError,
    loadMore,
    refresh: refreshHistory,
  } = useSmsTransactions();
  const cardConfig = useCardConfigStore();

  useBankSmsListener(() => {
    refreshHistory();
  });

  const transactions: FlowTransaction[] = useMemo(() => {
    const formatDate = (date: Date) => {
      const d = date;
      const now = new Date();

      const isSameDay =
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();

      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const isYesterday =
        d.getFullYear() === yesterday.getFullYear() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getDate() === yesterday.getDate();

      const day = d.getDate().toString().padStart(2, '0');
      const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const monthName = monthNames[d.getMonth()] ?? '';
      const year = d.getFullYear().toString();

      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
      if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours -= 12;
      }
      const hoursStr = hours.toString();
      const timePart = `${hoursStr}:${minutes} ${ampm}`;

      if (isSameDay) {
        return `Hoy, ${timePart}`;
      }

      if (isYesterday) {
        return `Ayer, ${timePart}`;
      }

      const sameYear = year === now.getFullYear().toString();
      if (sameYear) {
        return `${day} ${monthName}, ${timePart}`;
      }

      return `${day} ${monthName} ${year}, ${timePart}`;
    };

    const buildCategory = (tx: SmsTransaction): FlowTransactionCategory => {
      if (tx.type === 'TRANSFER_IN_CARD') return 'transfer_in';
      if (tx.type === 'TRANSFER_OUT_CARD') return 'transfer_out';
      if (tx.type === 'TRANSFER_OUT_WALLET') return 'wallet';
      if (tx.type === 'MOBILE_TOPUP') return 'topup';
      if (tx.type === 'ONLINE_PAYMENT') return 'online_payment';
      if (tx.type === 'UTILITY_PAYMENT_ELECTRICITY') return 'electricity';
      return 'transfer_out';
    };

    const buildDescription = (tx: SmsTransaction): string => {
      if (tx.type === 'TRANSFER_IN_CARD') {
        const phone = tx.counterparty?.kind === 'phone' ? tx.counterparty.label : '';
        if (phone) return 'Transferencia recibida';
        return 'Transferencia recibida';
      }
      if (tx.type === 'TRANSFER_OUT_CARD') {
        const card = tx.counterparty?.kind === 'card' ? tx.counterparty.label : '';
        if (card) return 'Transferencia enviada';
        return 'Transferencia enviada';
      }
      if (tx.type === 'TRANSFER_OUT_WALLET') {
        return 'Recarga monedero';
      }
      if (tx.type === 'MOBILE_TOPUP') {
        return 'Recarga móvil';
      }
      if (tx.type === 'ONLINE_PAYMENT') {
        return 'Pago en línea';
      }
      if (tx.type === 'UTILITY_PAYMENT_ELECTRICITY') {
        return 'Pago Electricidad';
      }
      return 'Movimiento';
    };

    const buildMeta = (tx: SmsTransaction): string | undefined => {
      if (tx.type === 'TRANSFER_IN_CARD') {
        const phone = tx.counterparty?.kind === 'phone' ? tx.counterparty.label : '';
        if (phone) {
          const contact = getContactByPhone(phone);
          if (contact) return `De ${contact.name} (${phone})`;
          return `De ${phone}`;
        }
        return undefined;
      }
      if (tx.type === 'TRANSFER_OUT_CARD') {
        const card = tx.counterparty?.kind === 'card' ? tx.counterparty.label : '';
        if (card) return `A ${card}`;
        return undefined;
      }
      if (tx.type === 'TRANSFER_OUT_WALLET') {
        const phone = tx.counterparty?.kind === 'phone' ? tx.counterparty.label : '';
        if (phone) {
          const contact = getContactByPhone(phone);
          if (contact) return `A monedero ${contact.name} (${phone})`;
          return `A monedero ${phone}`;
        }
        return undefined;
      }
      if (tx.type === 'MOBILE_TOPUP') {
        const phone = tx.counterparty?.kind === 'phone' ? tx.counterparty.label : '';
        if (phone) {
          const contact = getContactByPhone(phone);
          if (contact) return `${contact.name} (${phone})`;
          return `Teléfono ${phone}`;
        }
        return undefined;
      }
      if (tx.type === 'ONLINE_PAYMENT') {
        const name = tx.counterparty?.kind === 'merchant' ? tx.counterparty.label : '';
        if (name) return name;
        return undefined;
      }
      if (tx.type === 'UTILITY_PAYMENT_ELECTRICITY') {
        const invoice = tx.extra?.invoiceNumber;
        const period = tx.extra?.period;
        if (invoice && period) return `Factura ${invoice} · ${period}`;
        if (invoice) return `Factura ${invoice}`;
        if (period) return period;
        return undefined;
      }
      return undefined;
    };

    const resolveAvatarUri = (tx: SmsTransaction): string | null => {
      const phone = tx.counterparty?.kind === 'phone' ? tx.counterparty.label : '';
      if (!phone) return null;
      const contact = getContactByPhone(phone);
      if (!contact) {
        console.log('[avatar] no contact for phone', phone);
        return null;
      }
      console.log('[avatar] contact found', phone, 'imageUri:', contact.imageUri ?? 'null');
      return contact.imageUri ?? null;
    };

    const resolveContactName = (tx: SmsTransaction): string | null => {
      const phone = tx.counterparty?.kind === 'phone' ? tx.counterparty.label : '';
      if (!phone) return null;
      const contact = getContactByPhone(phone);
      return contact?.name ?? null;
    };

    const mapped = smsTransactions.map<FlowTransaction>((tx) => ({
      id: tx.id,
      type: tx.direction === 'out' ? 'sent' : 'received',
      amount: tx.amount,
      description: buildDescription(tx),
      date: formatDate(tx.date),
      category: buildCategory(tx),
      meta: buildMeta(tx),
      avatarUri: resolveAvatarUri(tx),
      contactName: resolveContactName(tx),
    }));

    if (historyFilter === 'all') {
      return mapped;
    }

    if (historyFilter === 'in') {
      return mapped.filter((tx) => tx.type === 'received');
    }

    return mapped.filter((tx) => tx.type === 'sent');
  }, [historyFilter, smsTransactions]);

  const handleCheckBalance = async () => {
    setIsSuccess(false);
    const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    try {
      await syncAuthStatus();
      const current = useAuthStore.getState();
      const authed = hasRecentBankSms(current.lastBankSmsAt);
      const meta = cardConfig.fullCardNumber
        ? getCardMetaFromNumber(cardConfig.fullCardNumber)
        : null;
      const prefix = meta?.cardPrefix4 ?? current.cardPrefix ?? '9234';
      console.log('[balance] check start', { authed, prefix });
      if (!authed) {
        await sendLoginUssd();
        await delay(10000);
      }

      await sendBalanceUssd();
      await delay(60000);
      await refresh({ cardPrefix: prefix });
      console.log('[balance] refresh completed');
    } catch {
      setErrorMessage('Ocurrió un problema al hablar con tu banco. Inténtalo de nuevo.');
      setErrorVisible(true);
    }
  };

  const handleTransferSubmit = (payload: { card: string; mobile: string; amount: string }) => {
    const amountNumber = parseFloat(payload.amount);
    if (!amountNumber || amountNumber <= 0) {
      return;
    }

    const currentBalance = balance ?? 0;
    if (amountNumber > currentBalance) {
      Alert.alert('Error', 'Saldo insuficiente.');
      return;
    }

    updateBalance((prev) => {
      const base = prev ?? 0;
      return base - amountNumber;
    });
    setActiveTab('history');
    Alert.alert('Transferencia exitosa', `Transferencia de ${amountNumber} CUP a ${payload.mobile}.`);
  };

  useEffect(() => {
    if (!lastResult) {
      return;
    }
    console.log('[balance] updated from sms', lastResult.balance, lastResult.date);
    setIsSuccess(true);
    const timeout = setTimeout(() => setIsSuccess(false), 1500);
    return () => clearTimeout(timeout);
  }, [lastResult]);

  useEffect(() => {
    if (!error) {
      return;
    }
    setErrorMessage(error);
    setErrorVisible(true);
  }, [error]);

  useEffect(() => {
    const run = async () => {
      await syncAuthStatus();
      const latest = useAuthStore.getState();
      const meta = cardConfig.fullCardNumber
        ? getCardMetaFromNumber(cardConfig.fullCardNumber)
        : null;
      const prefix = meta?.cardPrefix4 ?? latest.cardPrefix ?? '9234';
      await refresh({ cardPrefix: prefix });
    };
    run();
  }, [cardConfig.fullCardNumber, refresh]);

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['bottom']}>
      <FlowHeader
        balance={balance ?? 0}
        onRefresh={handleCheckBalance}
        refreshing={loading}
        success={isSuccess}
        bank={cardConfig.fullCardNumber ? getCardMetaFromNumber(cardConfig.fullCardNumber).bank : undefined}
      />
      <View className="flex-1 -mt-10 rounded-t-[32px] bg-gray-50 overflow-hidden">
        {showCardConfig ? (
          <Animated.View
            className="flex-1"
            entering={FadeInRight.duration(220)}
            exiting={FadeOutRight.duration(180)}
          >
            <FlowCardConfigView onClose={() => setShowCardConfig(false)} />
          </Animated.View>
        ) : (
          <>
            {activeTab === 'home' && (
              <FlowHomeView
                transactions={transactions}
                onPressTransfer={() => setActiveTab('transfer')}
                onPressHistory={() => setActiveTab('history')}
                onPressCard={() => setShowCardConfig(true)}
              />
            )}
            {activeTab === 'transfer' && <FlowTransferView onSubmit={handleTransferSubmit} />}
            {activeTab === 'history' && (
              <FlowHistoryView
                transactions={transactions}
                loadingMore={loadingMoreTx}
                onEndReached={loadMore}
                filter={historyFilter}
                onChangeFilter={setHistoryFilter}
              />
            )}
          </>
        )}
        <FlowTabBar
          activeTab={activeTab}
          onChangeTab={(key) => {
            setShowCardConfig(false);
            setActiveTab(key);
          }}
        />
      </View>
      <FlowErrorDialog
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  );
}
