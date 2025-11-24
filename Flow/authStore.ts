import { create } from 'zustand';

export type AuthState = {
  lastAuthAt: Date | null;
  cardPrefix: string | null;
  lastBankSmsAt: Date | null;
  setLastAuthAt: (date: Date | null) => void;
  setCardPrefix: (prefix: string | null) => void;
  setLastBankSmsAt: (date: Date | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  lastAuthAt: null,
  cardPrefix: null,
  lastBankSmsAt: null,
  setLastAuthAt: (date) => set({ lastAuthAt: date }),
  setCardPrefix: (prefix) => set({ cardPrefix: prefix }),
  setLastBankSmsAt: (date) => set({ lastBankSmsAt: date }),
}));

const HOUR_MS = 60 * 60 * 1000;

export function hasRecentBankSms(lastBankSmsAt: Date | null, now: Date = new Date()): boolean {
  if (!lastBankSmsAt) {
    return false;
  }
  const bankDiff = now.getTime() - lastBankSmsAt.getTime();
  return bankDiff < HOUR_MS;
}

export function isAuthenticated(
  lastAuthAt: Date | null,
  lastBankSmsAt: Date | null,
  now: Date = new Date(),
): boolean {
  if (!lastAuthAt && !lastBankSmsAt) {
    return false;
  }
  const authDiff = lastAuthAt ? now.getTime() - lastAuthAt.getTime() : Infinity;
  const bankDiff = lastBankSmsAt ? now.getTime() - lastBankSmsAt.getTime() : Infinity;
  return authDiff < HOUR_MS || bankDiff < HOUR_MS;
}
