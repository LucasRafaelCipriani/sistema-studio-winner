export const getPaymentMethod = (method) => {
  switch (method) {
    case 'cartao':
      return 'Cartão de Débito/Crédito';
    case 'pix':
      return 'PIX';
    case 'dinheiro':
      return 'Dinheiro';
    default:
      return '';
  }
};
