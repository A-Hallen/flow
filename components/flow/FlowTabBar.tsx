import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';

export type FlowTabKey = 'home' | 'transfer' | 'history';

type Props = {
  activeTab: FlowTabKey;
  onChangeTab: (tab: FlowTabKey) => void;
};

export function FlowTabBar({ activeTab, onChangeTab }: Props) {
  return (
    <View className="absolute left-0 right-0 items-center bottom-4">
      <View className="w-full max-w-[340px] bg-white/95 flex-row items-center px-2 py-2 rounded-full shadow-2xl border border-gray-100">
        <TouchableOpacity
          onPress={() => onChangeTab('home')}
          activeOpacity={0.9}
          className={`flex-1 items-center py-2 rounded-full ${
            activeTab === 'home' ? 'bg-fuchsia-50' : ''
          }`}
        >
          <Feather
            name="grid"
            size={20}
            color={activeTab === 'home' ? '#C026D3' : '#9CA3AF'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onChangeTab('transfer')}
          activeOpacity={0.9}
          className={`flex-1 items-center py-2 rounded-full ${
            activeTab === 'transfer' ? 'bg-orange-50' : ''
          }`}
        >
          <Feather
            name="send"
            size={20}
            color={activeTab === 'transfer' ? '#F97316' : '#9CA3AF'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onChangeTab('history')}
          activeOpacity={0.9}
          className={`flex-1 items-center py-2 rounded-full ${
            activeTab === 'history' ? 'bg-fuchsia-50' : ''
          }`}
        >
          <Feather
            name="clock"
            size={20}
            color={activeTab === 'history' ? '#C026D3' : '#9CA3AF'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
