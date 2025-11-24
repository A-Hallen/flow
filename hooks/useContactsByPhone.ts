import * as Contacts from 'expo-contacts';
import { useCallback, useEffect, useState } from 'react';

export type PhoneContact = {
  id: string;
  name: string;
  phone: string;
  imageUri?: string | null;
};

type ContactsByPhone = Record<string, PhoneContact>;

function normalizePhone(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

export function useContactsByPhone() {
  const [contactsByPhone, setContactsByPhone] = useState<ContactsByPhone>({});

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('[contacts] permission not granted', status);
          return;
        }

        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
        });

        const map: ContactsByPhone = {};

        for (const contact of data) {
          if (!contact.phoneNumbers || !contact.phoneNumbers.length) continue;
          const name = contact.name ?? '';
          const imageUri = contact.image?.uri ?? null;

          for (const phone of contact.phoneNumbers) {
            const normalized = normalizePhone(phone.number ?? '');
            if (!normalized) continue;
            map[normalized] = {
              id: contact.id,
              name,
              phone: normalized,
              imageUri,
            };
          }
        }

        setContactsByPhone(map);
        console.log('[contacts] loaded', Object.keys(map).length, 'phones');
      } catch {
        console.log('[contacts] error loading contacts');
        setContactsByPhone({});
      }
    };

    loadContacts();
  }, []);

  const getContactByPhone = useCallback(
    (phone: string): PhoneContact | null => {
      const normalized = normalizePhone(phone);
      if (!normalized) return null;
      return contactsByPhone[normalized] ?? null;
    },
    [contactsByPhone],
  );

  return {
    getContactByPhone,
  };
}
