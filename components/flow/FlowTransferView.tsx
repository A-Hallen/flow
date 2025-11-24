import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type TransferPayload = {
  card: string;
  mobile: string;
  amount: string;
};

type Props = {
  onSubmit: (payload: TransferPayload) => void;
};

export function FlowTransferView({ onSubmit }: Props) {
  const [card, setCard] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');

  const handlePress = () => {
    if (!card || !mobile || !amount) {
      return;
    }
    onSubmit({ card, mobile, amount });
    setCard('');
    setMobile('');
    setAmount('');
  };

  return (
    <ScrollView className="px-6 pt-8 pb-32" showsVerticalScrollIndicator={false}>
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="flex-row items-center gap-4 mb-8"
      >
        <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center">
          <Feather name="send" size={20} color="#F97316" />
        </View>
        <View>
          <Text className="text-xl font-bold text-gray-800">Nueva Transferencia</Text>
          <Text className="text-[11px] text-gray-400">Complete los datos requeridos</Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(100).duration(400).springify()}
        className="gap-5"
      >
        <View>
          <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-[1.5px] mb-2 ml-1">
            Número de Tarjeta
          </Text>
          <View className="relative">
            <Feather
              name="credit-card"
              size={18}
              color="#9CA3AF"
              style={{ position: 'absolute', left: 16, top: 16 }}
            />
            <TextInput
              value={card}
              onChangeText={setCard}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor="#D1D5DB"
              className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 font-medium text-gray-700"
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View>
          <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-[1.5px] mb-2 ml-1">
            Móvil Beneficiario
          </Text>
          <View className="relative">
            <Feather
              name="smartphone"
              size={18}
              color="#9CA3AF"
              style={{ position: 'absolute', left: 16, top: 16 }}
            />
            <TextInput
              value={mobile}
              onChangeText={setMobile}
              placeholder="+53 5xxx xxxx"
              placeholderTextColor="#D1D5DB"
              className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 font-medium text-gray-700"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View>
          <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-[1.5px] mb-2 ml-1">
            Monto a Enviar
          </Text>
          <View className="relative">
            <Text className="absolute left-4 top-3.5 text-gray-400 font-bold text-lg">$</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#D1D5DB"
              className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 pl-10 pr-4 text-xl font-bold text-gray-800"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View className="pt-4">
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.9}
            className="w-full bg-gray-900 py-4 rounded-2xl shadow-[0_18px_40px_rgba(15,23,42,0.45)] flex-row items-center justify-center gap-3"
          >
            <Text className="text-white font-bold">Confirmar Envío</Text>
            <Feather name="send" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}
