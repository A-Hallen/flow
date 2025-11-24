import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  message: string;
};

export function FlowLoader({ message }: Props) {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  const progress = useSharedValue(0.2);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    pulse.value = withRepeat(
      withTiming(1.06, {
        duration: 900,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    progress.value = withRepeat(
      withTiming(1, {
        duration: 2200,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
  }, [progress, pulse, rotation]);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: pulse.value },
    ],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: 0.4 + progress.value * 0.6 },
    ],
    opacity: 0.6 + progress.value * 0.4,
  }));

  return (
    <View className="absolute inset-0 z-50 bg-gray-950/85 items-center justify-center px-8">
      <View className="w-full max-w-xs rounded-3xl bg-gray-900/95 border border-fuchsia-500/20 shadow-2xl px-6 py-7">
        <View className="items-center mb-4">
          <Text className="text-[11px] tracking-[2px] uppercase text-fuchsia-300/90 mb-2">Consultando</Text>
          <View className="w-24 h-24 rounded-full bg-fuchsia-500/10 items-center justify-center">
            <View className="w-20 h-20 rounded-full bg-gray-900/90 border border-fuchsia-500/20 items-center justify-center">
              <Animated.View style={spinnerStyle} className="w-12 h-12">
                <View className="absolute inset-0 border-[3px] border-fuchsia-500/90 rounded-full border-b-transparent" />
                <View className="absolute inset-1.5 border-[3px] border-orange-400/90 rounded-full border-t-transparent" />
              </Animated.View>
            </View>
          </View>
        </View>
        <View className="mb-4">
          <Text className="text-sm text-gray-300 text-center mb-1">Consultando saldo</Text>
          <Text className="text-base font-semibold text-white text-center whitespace-pre-line">{message}</Text>
        </View>
        <View className="mt-1">
          <View className="h-[3px] w-full rounded-full bg-gray-800 overflow-hidden">
            <Animated.View style={progressStyle} className="h-[3px] w-full bg-gradient-to-r from-fuchsia-500 via-orange-400 to-fuchsia-400 origin-left" />
          </View>
          <Text className="text-[11px] text-gray-400 text-center mt-2">No cierres la app ni apagues los datos móviles.</Text>
        </View>
      </View>
    </View>
  );
}
