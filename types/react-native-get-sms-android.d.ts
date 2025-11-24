declare module 'react-native-get-sms-android' {
  type SmsFilter = {
    box: 'inbox' | 'sent' | 'draft' | 'failed' | 'outbox';
    address?: string;
    maxCount?: number;
  };

  type ListErrorCallback = (error: string) => void;
  type ListSuccessCallback = (count: number, smsList: string) => void;

  const SmsAndroid: {
    list(
      filter: string,
      failureCallback: ListErrorCallback,
      successCallback: ListSuccessCallback,
    ): void;
  };

  export default SmsAndroid;
}
