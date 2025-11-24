import { Feather } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { FlowTransaction } from './FlowHomeView';

type Props = {
  transactions: FlowTransaction[];
};

export function FlowHistoryView({ transactions }: Props) {
  return (
    <ScrollView
      className="px-6 pt-8"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <Text className="text-xl font-bold text-gray-800 mb-6">Historial</Text>
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="gap-4"
      >
        {transactions.map((tx) => {
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
                  <Text className="text-[11px] text-gray-400 font-medium">{tx.date}</Text>
                </View>
              </View>
              <Text className={`font-bold ${sent ? 'text-gray-800' : 'text-green-600'}`}>
                {sent ? '-' : '+'}
                {tx.amount}
              </Text>
            </View>
          );
        })}
        <View className="items-center mt-8">
          <View className="w-2 h-2 bg-gray-200 rounded-full" />
        </View>
      </Animated.View>
    </ScrollView>
  );
}
