import { PermissionsAndroid, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { parseBalanceFromSms, type ParsedBalance } from './smsBalanceParser';

const DEFAULT_SENDER_ADDRESS = '7246966845';

export type SmsBalanceResult = {
  balance: number;
  rawMessage: string;
  date: Date | null;
  source: ParsedBalance['source'];
};

type NativeSmsMessage = {
  body: string;
  address: string;
  date: number;
};

async function ensurePermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    console.log('[sms] non-android platform', Platform.OS);
    return false;
  }
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS);
  console.log('[sms] permission result', granted);
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function listSms(senderAddress: string, max: number): Promise<NativeSmsMessage[]> {
  const filter = {
    box: 'inbox',
    address: senderAddress,
    maxCount: max,
  } as const;

  return new Promise((resolve) => {
    console.log('[sms] listing inbox', filter);
    SmsAndroid.list(
      JSON.stringify(filter),
      (error: string) => {
        console.log('[sms] list error', error);
        resolve([]);
      },
      (_count: number, sms: string) => {
        try {
          const parsed = JSON.parse(sms) as NativeSmsMessage[];
          console.log('[sms] list success count', _count);
          resolve(parsed);
        } catch {
          console.log('[sms] list parse error');
          resolve([]);
        }
      },
    );
  });
}

async function readInboxMessages(senderAddress: string, max: number): Promise<NativeSmsMessage[]> {
  if (!senderAddress) {
    return [];
  }
  return listSms(senderAddress, max);
}

export type GetTotalBalanceOptions = {
  cardPrefix?: string;
  senderAddress?: string;
  maxMessages?: number;
};

export async function getTotalBalanceFromSms(options: GetTotalBalanceOptions = {}): Promise<SmsBalanceResult | null> {
  const hasPermission = await ensurePermissions();
  if (!hasPermission) {
    console.log('[sms] permission denied');
    return null;
  }
  const sender = options.senderAddress ?? DEFAULT_SENDER_ADDRESS;
  const max = options.maxMessages ?? 50;
  const messages = await readInboxMessages(sender, max);
  console.log('[sms] messages length', messages.length);
  if (!messages.length) {
    return null;
  }
  const sorted = [...messages].sort((a, b) => b.date - a.date);
  console.log('[sms] first message', sorted[0]);
  for (const msg of sorted) {
    console.log('[sms] parsing body', msg.body);
    const parsed = parseBalanceFromSms(msg.body, options.cardPrefix);
    console.log('[sms] parsed result', parsed);
    if (parsed) {
      return {
        balance: parsed.balance,
        rawMessage: msg.body,
        date: Number.isFinite(msg.date) ? new Date(msg.date) : null,
        source: parsed.source,
      };
    }
  }
  return null;
}
