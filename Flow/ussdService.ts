import { NativeModules, PermissionsAndroid, Platform } from 'react-native';

import { useCardConfigStore } from './cardConfigStore';

const DEFAULT_LOGIN_USSD = '*444*40*770249*0549730*1250120#';
const DEFAULT_BALANCE_USSD = '*444*46#';

type NativeUssdModule = {
  callUssd: (code: string) => Promise<void>;
};

const { UssdModule } = NativeModules as { UssdModule?: NativeUssdModule };

async function ensureCallPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function getLoginUssdCode(): string {
  const state = useCardConfigStore.getState();
  return state.loginUssd || DEFAULT_LOGIN_USSD;
}

async function send(code: string): Promise<void> {
  if (Platform.OS !== 'android' || !UssdModule) {
    return;
  }
  const allowed = await ensureCallPermission();
  if (!allowed) {
    return;
  }
  console.log('[ussd] calling', code);
  await UssdModule.callUssd(code);
}

export async function sendLoginUssd(): Promise<void> {
  await send(getLoginUssdCode());
}

export async function sendBalanceUssd(): Promise<void> {
  await send(DEFAULT_BALANCE_USSD);
}
