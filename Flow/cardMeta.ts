export type BankId = 'BPA' | 'BANDEC' | 'UNKNOWN';

export type CardAccountType =
  | 'AHORRO_CUP'
  | 'SALARIO_CUP'
  | 'JUBILACION_CUP'
  | 'MLC'
  | 'TCP_CUP'
  | 'PRODUCTOR_CUP'
  | 'MIPYME_CUP'
  | 'NOMINA_CUP'
  | 'COOPERATIVA_CUP'
  | 'PERSONA_NATURAL_MLC'
  | 'TCP_MLC'
  | 'COOPERATIVA_MLC'
  | 'UNKNOWN';

export type CardMeta = {
  bank: BankId;
  accountType: CardAccountType;
  cardPrefix4: string | null;
};

function getBpaAccountType(first4: string): CardAccountType | null {
  if (first4 === '9205' || first4 === '9238') return 'AHORRO_CUP';
  if (first4 === '9204') return 'SALARIO_CUP';
  if (first4 === '9206') return 'JUBILACION_CUP';
  if (first4 === '9225' || first4 === '9235' || first4 === '9226' || first4 === '9228') return 'MLC';
  if (first4 === '9212') return 'TCP_CUP';
  if (first4 === '9237') return 'PRODUCTOR_CUP';
  if (first4 === '9233') return 'MIPYME_CUP';
  return null;
}

function getBandecAccountType(thirdFourth: string): CardAccountType | null {
  if (['04', '05', '24', '27', '34', '44'].includes(thirdFourth)) return 'NOMINA_CUP';
  if (thirdFourth === '06') return 'JUBILACION_CUP';
  if (thirdFourth === '12' || thirdFourth === '13') return 'TCP_CUP';
  if (thirdFourth === '33') return 'MIPYME_CUP';
  if (['25', '35', '40'].includes(thirdFourth)) return 'PERSONA_NATURAL_MLC';
  if (thirdFourth === '26') return 'TCP_MLC';
  if (thirdFourth === '28') return 'COOPERATIVA_MLC';
  return null;
}

export function getCardMetaFromNumber(cardNumberRaw: string): CardMeta {
  const cardNumber = cardNumberRaw.replace(/\s+/g, '');
  const first4 = cardNumber.slice(0, 4);
  const thirdFourth = cardNumber.slice(2, 4);
  const cardPrefix4 = first4.length === 4 ? first4 : null;

  const bpaType = getBpaAccountType(first4);
  if (bpaType) {
    return {
      bank: 'BPA',
      accountType: bpaType,
      cardPrefix4,
    };
  }

  const bandecType = getBandecAccountType(thirdFourth);
  if (bandecType) {
    return {
      bank: 'BANDEC',
      accountType: bandecType,
      cardPrefix4,
    };
  }

  return {
    bank: 'UNKNOWN',
    accountType: 'UNKNOWN',
    cardPrefix4,
  };
}
