// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const ap = {
  id: 'ap',
  title: 'AP',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'ap',
      title: 'Payable',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'arApBill',
          title: 'AR/AP Bill Balance',
          type: 'item',
          url: '/finance/ArApBill'
        },
        {
          id: 'payment',
          title: 'Payment',
          type: 'item',
          url: '/finance/payment/Payment'
        },
        {
          id: 'paymentRegister',
          title: 'Payment Register',
          type: 'item',
          url: '/finance/paymentRegister/PaymentRegister'
        }
      ]
    }
  ]
};

export default ap;
