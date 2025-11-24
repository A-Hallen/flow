import { PermissionsAndroid, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

import { parseTransactionFromSms } from './smsTransactionParser';
import type { SmsTransaction } from './smsTransactionTypes';

const DEFAULT_SENDER_ADDRESS = 'PAGOxMOVIL';

export type NativeSmsMessage = {
  _id: number;
  body: string;
  address: string;
  date: number;
};

export type GetTransactionsOptions = {
  senderAddress?: string;
  maxMessages?: number;
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
      (_error: string) => {
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

export async function getTransactionsFromSms(options: GetTransactionsOptions = {}): Promise<SmsTransaction[]> {
  const hasPermission = await ensurePermissions();
  if (!hasPermission) {
    return [];
  }

  const sender = options.senderAddress ?? DEFAULT_SENDER_ADDRESS;
  const max = options.maxMessages ?? 50;
  const messages = await readInboxMessages(sender, max);

  if (!messages.length) {
    return [];
  }

  const mapped: SmsTransaction[] = [];

  for (const msg of messages) {
    const smsDate = Number.isFinite(msg.date) ? new Date(msg.date) : new Date();
    const tx = parseTransactionFromSms(msg.body, String(msg._id ?? msg.date), smsDate);
    if (tx) {
      mapped.push(tx);
    }
  }

  mapped.sort((a, b) => b.date.getTime() - a.date.getTime());

  return mapped;
}
