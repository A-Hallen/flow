export type ParsedBalance = {
  balance: number;
  source: 'simple' | 'summary';
};

export function parseNumber(value: string): number | null {
  const normalized = value.replace(/[^0-9.,]/g, '').replace(',', '');
  const parsed = parseFloat(normalized);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
}

function parseSimpleBalance(message: string): ParsedBalance | null {
  const regex = /Saldo\s+(disponible|restante)\s*:\s*(?:CR\s*)?([0-9.,]+)/i;
  const match = message.match(regex);
  if (!match) {
    return null;
  }
  const value = parseNumber(match[2]);
  if (value == null) {
    return null;
  }
  return { balance: value, source: 'simple' };
}

function parseSummaryLine(line: string): number | null {
  const parts = line.split(';');
  if (parts.length < 3) {
    return null;
  }
  const saldoDisponible = parts[2];
  const match = saldoDisponible.match(/CR\s*([0-9.,]+)/i);
  if (!match) {
    return null;
  }
  return parseNumber(match[1]);
}

function parseSummaryByCardPrefix(message: string, cardPrefix: string): ParsedBalance | null {
  const lines = message.split(/\r?\n|\|/).map((line) => line.trim()).filter(Boolean);
  const targetLine = lines.find((line) => line.startsWith(cardPrefix));
  if (!targetLine) {
    return null;
  }
  const value = parseSummaryLine(targetLine);
  if (value == null) {
    return null;
  }
  return { balance: value, source: 'summary' };
}

export function parseBalanceFromSms(message: string, cardPrefix?: string): ParsedBalance | null {
  const simple = parseSimpleBalance(message);
  if (simple) {
    return simple;
  }
  if (!cardPrefix) {
    return null;
  }
  return parseSummaryByCardPrefix(message, cardPrefix);
}
