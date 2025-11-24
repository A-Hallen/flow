import { PermissionsAndroid, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { isAuthenticated, useAuthStore } from './authStore';
import { parseAuthSms } from './smsAuthParser';

const BANK_ADDRESS = 'PAGOxMOVIL';

type NativeSmsMessage = {
  body: string;
  address: string;
  date: number;
};

async function ensurePermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS);
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function listBankSms(max: number): Promise<NativeSmsMessage[]> {
  const filter = {
    box: 'inbox',
    address: BANK_ADDRESS,
    maxCount: max,
  } as const;

  return new Promise((resolve) => {
    SmsAndroid.list(
      JSON.stringify(filter),
      () => {
        resolve([]);
      },
      (_count: number, sms: string) => {
        try {
          const parsed = JSON.parse(sms) as NativeSmsMessage[];
          resolve(parsed);
        } catch {
          resolve([]);
        }
      },
    );
  });
}

export async function syncAuthStatus(maxMessages = 20): Promise<boolean> {
  const hasPermission = await ensurePermissions();
  if (!hasPermission) {
    return false;
  }

  const messages = await listBankSms(maxMessages);
  if (!messages.length) {
    return false;
  }

  const sorted = [...messages].sort((a, b) => b.date - a.date);
  const store = useAuthStore.getState();

  const latestMsg = sorted[0];
  const latestDate = Number.isFinite(latestMsg.date) ? new Date(latestMsg.date) : new Date();
  store.setLastBankSmsAt(latestDate);

  for (const msg of sorted) {
    const auth = parseAuthSms(msg.body);
    if (auth) {
      const date = Number.isFinite(msg.date) ? new Date(msg.date) : latestDate;
      const prefix = auth.cardNumber.slice(0, 4) || null;
      store.setLastAuthAt(date);
      if (prefix) {
        store.setCardPrefix(prefix);
      }
      break;
    }
  }

  const updated = useAuthStore.getState();
  return isAuthenticated(updated.lastAuthAt, updated.lastBankSmsAt);
}
