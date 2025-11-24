import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

type Props = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

export function FlowErrorDialog({ visible, message, onClose }: Props) {
  if (!visible) {
    return null;
  }

  return (
    <View className="absolute inset-0 z-50 bg-gray-950/85 items-center justify-center px-8">
      <Animated.View
        entering={FadeInDown.duration(260).springify()}
        exiting={FadeOutDown.duration(200)}
        className="w-full max-w-xs rounded-3xl bg-gray-900/95 shadow-2xl px-6 py-7"
      >
        <View className="items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-red-500/10 border border-red-400/70 items-center justify-center mb-2">
            <Text className="text-xl text-red-400 font-bold">!</Text>
          </View>
          <Text className="text-sm font-semibold text-red-200 mb-1">No se pudo actualizar tu saldo</Text>
        </View>
        <View className="mb-5">
          <Text className="text-sm text-gray-200 text-center whitespace-pre-line">{message}</Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.85}
          className="w-full bg-red-500/90 py-3 rounded-2xl items-center justify-center"
        >
          <Text className="text-sm font-bold text-white tracking-[1px] uppercase">Entendido</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
