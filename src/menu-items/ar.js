// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const ar = {
  id: 'ar',
  title: 'AR',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'ar',
      title: 'Receivable',
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
          id: 'receipt',
          title: 'Receipt',
          type: 'item',
          url: '/finance/receipt/Receipt'
        },
        {
          id: 'receiptRegister',
          title: 'Receipt Register',
          type: 'item',
          url: '/finance/receiptRegister/ReceiptRegister'
        }
      ]
    }
  ]
};

export default ar;
