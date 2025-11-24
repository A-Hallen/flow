import { create } from 'zustand';

import { getCardMetaFromNumber, type CardMeta } from './cardMeta';

export type CardConfigState = {
  fullCardNumber: string | null;
  loginUssd: string | null;
  setFullCardNumber: (card: string | null) => void;
  setLoginUssd: (code: string | null) => void;
};

export const useCardConfigStore = create<CardConfigState>((set) => ({
  fullCardNumber: null,
  loginUssd: null,
  setFullCardNumber: (card) => set({ fullCardNumber: card }),
  setLoginUssd: (code) => set({ loginUssd: code }),
}));

export function getCurrentCardMeta(): CardMeta | null {
  const card = useCardConfigStore.getState().fullCardNumber;
  if (!card) return null;
  return getCardMetaFromNumber(card);
}
