import { createNumberMask } from 'text-mask-addons';

export const useMoney = () => {
  const moneyMask = createNumberMask({
    prefix: 'R$ ',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    integerLimit: 10,
    allowNegative: false,
    allowLeadingZeroes: false,
  });

  const formatMoney = (value) => {
    if (!value) {
      return '';
    }

    if (!value.includes(',')) {
      return value + ',00';
    }

    let parts = value.split(',');
    if (parts[1].length === 1) {
      return value + '0';
    }

    return value;
  };

  return {
    moneyMask,
    formatMoney,
  };
};
