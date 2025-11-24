import { PermissionsAndroid, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { parseBalanceFromSms, type ParsedBalance } from './smsBalanceParser';

const DEFAULT_SENDER_ADDRESS = 'PAGOxMOVIL';

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
    return false;
  }
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS);
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function listSms(senderAddress: string, max: number): Promise<NativeSmsMessage[]> {
  const filter = {
    box: 'inbox',
    address: senderAddress,
    maxCount: max,
  } as const;

  return new Promise((resolve) => {
    SmsAndroid.list(
      JSON.stringify(filter),
      (error: string) => {
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
    return null;
  }
  const sender = options.senderAddress ?? DEFAULT_SENDER_ADDRESS;
  const max = options.maxMessages ?? 20;
  const messages = await readInboxMessages(sender, max);
  if (!messages.length) {
    return null;
  }
  const sorted = [...messages].sort((a, b) => b.date - a.date);
  const candidates = sorted.reduce<{ msg: NativeSmsMessage; parsed: ParsedBalance }[]>((acc, msg) => {
    const parsed = parseBalanceFromSms(msg.body, options.cardPrefix);
    if (parsed) {
      acc.push({ msg, parsed });
    }
    return acc;
  }, []);

  if (!candidates.length) {
    return null;
  }

  const best = candidates.reduce((current, item) => {
    if (!current) {
      return item;
    }
    return item.msg.date > current.msg.date ? item : current;
  });

  const result: SmsBalanceResult = {
    balance: best.parsed.balance,
    rawMessage: best.msg.body,
    date: Number.isFinite(best.msg.date) ? new Date(best.msg.date) : null,
    source: best.parsed.source,
  };

  console.log('[sms] best balance', result.balance, result.date);

  return result;
}
