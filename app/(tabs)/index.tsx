import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FlowErrorDialog } from '@/components/flow/FlowErrorDialog';
import { FlowHeader } from '@/components/flow/FlowHeader';
import { FlowHistoryView } from '@/components/flow/FlowHistoryView';
import { FlowHomeView, FlowTransaction } from '@/components/flow/FlowHomeView';
import { FlowLoader } from '@/components/flow/FlowLoader';
import { FlowTabBar, FlowTabKey } from '@/components/flow/FlowTabBar';
import { FlowTransferView } from '@/components/flow/FlowTransferView';
import { useTotalBalanceFromSms } from '@/hooks/useTotalBalance';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<FlowTabKey>('home');
  const [loaderMessage, setLoaderMessage] = useState('');
  const { balance, loading, error, lastResult, refresh, updateBalance } = useTotalBalanceFromSms(1250.5);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('No se pudo actualizar tu saldo en este momento.');
  const [transactions, setTransactions] = useState<FlowTransaction[]>([
    {
      id: 1,
      type: 'received',
      amount: 500,
      description: 'Transferencia de Pedro',
      date: '21 Nov, 10:30 AM',
    },
    {
      id: 2,
      type: 'sent',
      amount: 120,
      description: 'Pago Electricidad',
      date: '20 Nov, 04:15 PM',
    },
    {
      id: 3,
      type: 'sent',
      amount: 50,
      description: 'Recarga Móvil',
      date: '19 Nov, 09:00 AM',
    },
  ]);

  const handleCheckBalance = () => {
    setLoaderMessage('Hablando con tu banco...\nActualizando tu saldo disponible');
    refresh({ cardPrefix: '9234' });
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
    const newTx: FlowTransaction = {
      id: Date.now(),
      type: 'sent',
      amount: amountNumber,
      description: `Transf. a ${payload.mobile}`,
      date: 'Hoy, Ahora',
    };
    setTransactions((prev) => [newTx, ...prev]);
    setActiveTab('history');
    Alert.alert('Transferencia exitosa', `Transferencia de ${amountNumber} CUP a ${payload.mobile}.`);
  };

  useEffect(() => {
    if (!lastResult) {
      return;
    }
    Alert.alert('Saldo actualizado', `Tu saldo disponible es ${lastResult.balance.toFixed(2)} CUP.`);
  }, [lastResult]);

  useEffect(() => {
    if (!error) {
      return;
    }
    setErrorMessage(error);
    setErrorVisible(true);
  }, [error]);

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['bottom']}>
      <FlowHeader balance={balance ?? 0} onRefresh={handleCheckBalance} />
      <View className="flex-1 -mt-10 rounded-t-[32px] bg-gray-50 overflow-hidden">
        {activeTab === 'home' && (
          <FlowHomeView
            transactions={transactions}
            onPressTransfer={() => setActiveTab('transfer')}
            onPressHistory={() => setActiveTab('history')}
          />
        )}
        {activeTab === 'transfer' && <FlowTransferView onSubmit={handleTransferSubmit} />}
        {activeTab === 'history' && <FlowHistoryView transactions={transactions} />}
        <FlowTabBar activeTab={activeTab} onChangeTab={setActiveTab} />
      </View>
      {loading && <FlowLoader message={loaderMessage} />}
      <FlowErrorDialog
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  );
}
