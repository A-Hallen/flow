export type TransactionDirection = 'in' | 'out';

export type TransactionType =
  | 'TRANSFER_OUT_CARD'
  | 'TRANSFER_IN_CARD'
  | 'TRANSFER_OUT_WALLET'
  | 'MOBILE_TOPUP'
  | 'ONLINE_PAYMENT'
  | 'UTILITY_PAYMENT_ELECTRICITY';

export type TransactionCounterpartyKind = 'card' | 'phone' | 'merchant' | 'service';

export type TransactionCounterparty = {
  kind: TransactionCounterpartyKind;
  label: string;
};

export type SmsTransaction = {
  id: string;
  smsId: string;
  type: TransactionType;
  direction: TransactionDirection;
  amount: number;
  currency: 'CUP';
  date: Date;
  rawSmsBody: string;
  rawSmsDate: Date;
  transactionId?: string;
  counterparty?: TransactionCounterparty;
  extra?: Record<string, string>;
};
