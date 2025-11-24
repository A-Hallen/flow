import { Feather } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export type FlowTransaction = {
  id: number;
  type: 'sent' | 'received';
  amount: number;
  description: string;
  date: string;
};

type Props = {
  transactions: FlowTransaction[];
  onPressTransfer: () => void;
  onPressHistory: () => void;
};

export function FlowHomeView({ transactions, onPressTransfer, onPressHistory }: Props) {
  return (
    <ScrollView
      className="px-6 pt-8"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="flex flex-row flex-wrap gap-3 mb-6"
      >
        <TouchableOpacity
          onPress={onPressTransfer}
          activeOpacity={0.9}
          className="bg-white p-4 flex-1 min-w-[150px] rounded-[22px] shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-gray-100 gap-3"
        >
          <View className="bg-orange-50 p-2.5 rounded-2xl mb-1">
            <Feather name="arrow-up-right" size={24} color="#F97316" />
          </View>
          <Text className="font-bold text-gray-700 text-sm">Transferir</Text>
        </TouchableOpacity>

        <View className="bg-white p-4 flex-1 min-w-[150px] rounded-[22px] shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-gray-100 gap-3">
          <View className="bg-fuchsia-50 p-2.5 rounded-2xl mb-1">
            <Feather name="smartphone" size={24} color="#C026D3" />
          </View>
          <Text className="font-bold text-gray-700 text-sm">Recargar</Text>
        </View>

        <View className="bg-white flex-1 p-4 min-w-[150px] rounded-[22px] shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-gray-100 gap-3">
          <View className="bg-yellow-50 p-2.5 rounded-2xl mb-1">
            <Feather name="zap" size={24} color="#FACC15" />
          </View>
          <Text className="font-bold text-gray-700 text-sm">Electricidad</Text>
        </View>

        <View className="bg-violet-900 flex-1 p-4 min-w-[150px] rounded-[22px] shadow-[0_18px_45px_rgba(15,23,42,0.45)] border border-violet-800 overflow-hidden">
          <View className="absolute right-0 top-0 w-20 h-20 bg-white/5 rounded-full -mr-5 -mt-5" />
          <View className="bg-white/10 p-3 rounded-2xl mb-1">
            <Feather name="credit-card" size={24} color="#F9A8D4" />
          </View>
          <Text className="font-bold text-white text-sm">Mi Tarjeta</Text>
        </View>
      </Animated.View>

      <View className="flex-row items-end justify-between mb-5">
        <Text className="font-bold text-lg text-gray-800">Actividad Reciente</Text>
        <TouchableOpacity onPress={onPressHistory} activeOpacity={0.8}>
          <Text className="text-fuchsia-600 text-xs font-bold">VER TODO</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        entering={FadeInDown.delay(150).duration(400).springify()}
        className="gap-4"
      >
        {transactions.slice(0, 3).map((tx) => {
          const sent = tx.type === 'sent';
          return (
            <View
              key={tx.id}
              className="bg-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.04)] border border-gray-50 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-4">
                <View className={`p-3 rounded-full ${sent ? 'bg-orange-50' : 'bg-green-50'}`}>
                  <Feather
                    name={sent ? 'arrow-up-right' : 'arrow-down-left'}
                    size={20}
                    color={sent ? '#F97316' : '#16A34A'}
                  />
                </View>
                <View>
                  <Text className="font-bold text-gray-700 text-sm">{tx.description}</Text>
                  <Text className="text-[11px] text-gray-400 font-medium mt-0.5">{tx.date}</Text>
                </View>
              </View>
              <Text className={`font-bold ${sent ? 'text-gray-800' : 'text-green-600'}`}>
                {sent ? '-' : '+'}
                {tx.amount}
              </Text>
            </View>
          );
        })}
      </Animated.View>
    </ScrollView>
  );
}
