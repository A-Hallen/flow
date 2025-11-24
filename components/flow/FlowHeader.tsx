import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  balance: number;
  onRefresh: () => void;
};

function FlowLogo() {
  return (
    <View className="bg-white/20 p-2 rounded-2xl border border-white/20 shadow-inner">
      <View className="w-8 h-8 rounded-full border-2 border-white/70 items-center justify-center">
        <Text className="text-white font-bold">F</Text>
      </View>
    </View>
  );
}

export function FlowHeader({ balance, onRefresh }: Props) {
  return (
    <LinearGradient
      colors={['#1f1459', '#a21caf', '#f97316']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="pb-12 rounded-b-[32px] shadow-2xl overflow-hidden"
    >
      <StatusBar style="light" />
      <View className="flex-row items-center justify-between px-6 pt-12 pb-1">
        <View className="flex-row items-center gap-1.5 opacity-80">
        </View>
      </View>

      <View className="absolute -top-8 -right-10 w-64 h-64 bg-yellow-300 rounded-full opacity-30" />
      <View className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-900 rounded-full opacity-30" />

      <View className="items-center mt-4 mb-6">
        <View className="flex-row items-center gap-3">
          <FlowLogo />
          <Text className="font-bold text-2xl tracking-wide text-white italic">Flow.</Text>
        </View>
      </View>

      <View className="items-center">
        <Text className="text-orange-100/90 text-[11px] uppercase tracking-[2px] mb-2 font-semibold">
          Saldo Total
        </Text>
        <View className="flex-row items-baseline gap-1 mb-5">
          <Text className="text-3xl text-orange-200/80 font-semibold">$</Text>
          <Text className="text-5xl font-bold text-white tracking-tight">
            {balance.toLocaleString('es-CU', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onRefresh}
          activeOpacity={0.8}
          className="flex-row items-center gap-2 bg-white/10 px-5 py-2.5 rounded-full border border-white/20"
        >
          <Feather name="refresh-ccw" size={14} color="white" />
          <Text className="text-[11px] font-bold text-white tracking-[1px]">ACTUALIZAR</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
