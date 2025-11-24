import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { FlowTransaction } from './FlowHomeView';

type HistoryFilter = 'all' | 'in' | 'out';

type Props = {
  transactions: FlowTransaction[];
  loadingMore: boolean;
  onEndReached: () => void;
  filter: HistoryFilter;
  onChangeFilter: (value: HistoryFilter) => void;
};

function renderItem({ item }: { item: FlowTransaction }) {
  const sent = item.type === 'sent';

  let iconName: keyof typeof Feather.glyphMap = 'arrow-up-right';
  let iconColor = '#F97316';
  let iconBg = 'bg-orange-50';

  if (item.category === 'transfer_in') {
    iconName = 'arrow-down-left';
    iconColor = '#16A34A';
    iconBg = 'bg-green-50';
  } else if (item.category === 'wallet') {
    iconName = 'smartphone';
    iconColor = '#C026D3';
    iconBg = 'bg-fuchsia-50';
  } else if (item.category === 'topup') {
    iconName = 'smartphone';
    iconColor = '#2563EB';
    iconBg = 'bg-blue-50';
  } else if (item.category === 'online_payment') {
    iconName = 'shopping-bag';
    iconColor = '#0EA5E9';
    iconBg = 'bg-sky-50';
  } else if (item.category === 'electricity') {
    iconName = 'zap';
    iconColor = '#FACC15';
    iconBg = 'bg-yellow-50';
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      className="bg-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.04)] border border-gray-50 flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-4">
        {item.avatarUri ? (
          <View className="w-10 h-10 relative">
            <View className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 items-center justify-center">
              <Image source={{ uri: item.avatarUri }} className="w-full h-full" resizeMode="cover" />
            </View>
            <View className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white items-center justify-center border border-gray-200 shadow-[0_1px_2px_rgba(15,23,42,0.15)]">
              <Feather name={iconName} size={10} color={iconColor} />
            </View>
          </View>
        ) : item.contactName ? (
          <View className="w-10 h-10 relative">
            <View className="w-10 h-10 rounded-full bg-violet-100 items-center justify-center">
              <Text className="text-xs font-bold text-violet-700">
                {item.contactName
                  .split(' ')
                  .filter(Boolean)
                  .map((part) => part[0]?.toUpperCase() ?? '')
                  .slice(0, 2)
                  .join('')}
              </Text>
            </View>
            <View className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white items-center justify-center">
              <Feather name={iconName} size={10} color={iconColor} />
            </View>
          </View>
        ) : (
          <View className={`p-3 rounded-full ${iconBg}`}>
            <Feather name={iconName} size={20} color={iconColor} />
          </View>
        )}
        <View>
          <Text className="font-bold text-gray-700 text-sm">{item.description}</Text>
          {item.meta ? (
            <Text className="text-[11px] text-gray-400 font-medium mt-0.5">{item.meta}</Text>
          ) : null}
          <Text className="text-[11px] text-gray-400 font-medium mt-0.5">{item.date}</Text>
        </View>
      </View>
      <Text className={`font-bold ${sent ? 'text-gray-800' : 'text-green-600'}`}>
        {sent ? '-' : '+'}
        {item.amount}
      </Text>
    </Animated.View>
  );
}

export function FlowHistoryView({ transactions, loadingMore, onEndReached, filter, onChangeFilter }: Props) {
  return (
    <View className="flex-1 px-6 pt-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-gray-800">Historial</Text>
        <View className="flex-row gap-2">
          {(
            [
              { key: 'all', label: 'Todos' },
              { key: 'in', label: 'Entrantes' },
              { key: 'out', label: 'Salientes' },
            ] as const
          ).map((item) => {
            const active = filter === item.key;
            return (
              <Text
                key={item.key}
                onPress={() => onChangeFilter(item.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  active
                    ? 'bg-violet-100 border-violet-300 text-violet-800'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                {item.label}
              </Text>
            );
          })}
        </View>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80, gap: 16 }}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.3}
        onEndReached={onEndReached}
        ListFooterComponent={
          <View className="items-center mt-4 mb-2">
            {loadingMore ? (
              <ActivityIndicator size="small" color="#6B21A8" />
            ) : (
              <View className="w-2 h-2 bg-gray-200 rounded-full" />
            )}
          </View>
        }
      />
    </View>
  );
}
