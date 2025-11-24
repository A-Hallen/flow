import { useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

import { useCardConfigStore } from '@/Flow/cardConfigStore';
import { getCardMetaFromNumber } from '@/Flow/cardMeta';

type Props = {
  onClose: () => void;
};

export function FlowCardConfigView({ onClose }: Props) {
  const cardConfig = useCardConfigStore();
  const [cardNumber, setCardNumber] = useState(cardConfig.fullCardNumber ?? '');
  const [loginUssd, setLoginUssd] = useState(cardConfig.loginUssd ?? '');

  const meta = useMemo(() => {
    if (!cardNumber.trim()) return null;
    return getCardMetaFromNumber(cardNumber);
  }, [cardNumber]);

  const maskedNumber = useMemo(() => {
    const digits = cardNumber.replace(/\s+/g, '');
    if (!digits) return '';
    const groups: string[] = [];
    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.slice(i, i + 4));
    }
    if (groups.length <= 1) return groups.join(' ');
    const last = groups[groups.length - 1];
    const hidden = groups
      .slice(0, -1)
      .map((g) => g.replace(/./g, '•'))
      .join(' ');
    return `${hidden} ${last}`.trim();
  }, [cardNumber]);

  const bankLabel = meta?.bank === 'BPA' ? 'BPA' : meta?.bank === 'BANDEC' ? 'BANDEC' : 'Desconocido';

  const accountLabel = (() => {
    if (!meta) return '';
    switch (meta.accountType) {
      case 'AHORRO_CUP':
        return 'Ahorro CUP';
      case 'SALARIO_CUP':
        return 'Salario CUP';
      case 'JUBILACION_CUP':
        return 'Jubilación CUP';
      case 'MLC':
        return 'MLC';
      case 'TCP_CUP':
        return 'TCP CUP';
      case 'PRODUCTOR_CUP':
        return 'Productor Agropecuario CUP';
      case 'MIPYME_CUP':
        return 'MIPYME CUP';
      case 'NOMINA_CUP':
        return 'Nómina/Fondos/Ahorro CUP';
      case 'COOPERATIVA_CUP':
        return 'Cooperativa CUP';
      case 'PERSONA_NATURAL_MLC':
        return 'Persona natural MLC';
      case 'TCP_MLC':
        return 'TCP MLC';
      case 'COOPERATIVA_MLC':
        return 'Cooperativa/MIPYME MLC';
      default:
        return '';
    }
  })();

  const cardBgColor = meta?.bank === 'BANDEC' ? '#047857' : meta?.bank === 'BPA' ? '#4c1d95' : '#111827';

  const bankLogo =
    meta?.bank === 'BPA'
      ? require('@/assets/images/banks/bpa-logo.png')
      : meta?.bank === 'BANDEC'
        ? require('@/assets/images/banks/bandec-logo.png')
        : null;

  const handleSave = () => {
    cardConfig.setFullCardNumber(cardNumber.trim() || null);
    cardConfig.setLoginUssd(loginUssd.trim() || null);
    onClose();
  };

  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

  return (
    <Wrapper behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {meta && (
          <Animated.View
            entering={FadeInRight.duration(220)}
            exiting={FadeOutRight.duration(180)}
            className="mb-6"
          >
            <View
              className="rounded-3xl p-4 shadow-[0_18px_45px_rgba(15,23,42,0.5)]"
              style={{ backgroundColor: cardBgColor }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xs font-semibold text-white/80 uppercase tracking-[1px]">
                  {bankLabel}
                </Text>
                {bankLogo && (
                  <Image
                    source={bankLogo}
                    style={{ width: 28, height: 28, borderRadius: 14 }}
                  />
                )}
              </View>
              {maskedNumber ? (
                <Text className="text-lg font-semibold text-white tracking-[2px] mb-1">
                  {maskedNumber}
                </Text>
              ) : null}
              {accountLabel ? (
                <Text className="text-[11px] text-white/80 font-medium mt-1">
                  {accountLabel}
                </Text>
              ) : null}
            </View>
          </Animated.View>
        )}

        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">Mi Tarjeta</Text>
          <TouchableOpacity onPress={onClose} className="px-3 py-1 rounded-full bg-gray-200">
            <Text className="text-xs font-semibold text-gray-700">Cerrar</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-5">
          <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-[1px]">
            Número de tarjeta
          </Text>
          <TextInput
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
            maxLength={20}
            placeholder="XXXXXXXXXXXXXXXX"
            className="bg-white rounded-2xl px-4 py-3 text-base text-gray-900 border border-gray-200"
          />
          {meta && (
            <View className="mt-2">
              <Text className="text-xs text-gray-500">Banco: {bankLabel}</Text>
              {accountLabel ? <Text className="text-xs text-gray-500">Tipo: {accountLabel}</Text> : null}
            </View>
          )}
        </View>

        <View className="mb-5">
          <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-[1px]">
            USSD de autenticación
          </Text>
          <TextInput
            value={loginUssd}
            onChangeText={setLoginUssd}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="*444*40*...#"
            className="bg-white rounded-2xl px-4 py-3 text-base text-gray-900 border border-gray-200"
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.85}
          className="bg-violet-900 rounded-full py-3 items-center shadow-[0_12px_30px_rgba(76,29,149,0.4)]"
        >
          <Text className="text-white font-bold text-sm tracking-[1px] uppercase">Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </Wrapper>
  );
}
