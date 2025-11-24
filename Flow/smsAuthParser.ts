export type AuthSmsResult = {
  cardNumber: string;
};

export function parseAuthSms(message: string): AuthSmsResult | null {
  const normalized = message.replace(/\s+/g, ' ');
  if (!/Usted se ha autenticado en la plataforma de pagos moviles/i.test(normalized)) {
    return null;
  }
  const match = normalized.match(/cuenta\s+([0-9Xx]+)/i);
  if (!match) {
    return null;
  }
  return { cardNumber: match[1] };
}
