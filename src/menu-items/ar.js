// assets
import { IconKey } from '@tabler/icons-react';
import { IconFileDollar } from '@tabler/icons-react';

// constant
const icons = {
  IconFileDollar
};

// const allowedScreens = JSON.parse(localStorage.getItem('screens')) || [];

// // Mapping of screen names (from localStorage) to menu item IDs
// const screenMapping = {
//   'TAX INVOICE': 'taxInvoiceDetail',
//   'IRN CREDIT NOTE': 'creditNoteDetail',
//   'TAX REGISTER': 'taxRegister',
//   'RECEIPT': 'receipt',
//   'AR ADJUSTMENT OFFSET': 'adjustmentOffset',
//   'CUSTOMER LEDGER': 'customerLedger',
//   'ADJUSTMENT JOURNAL': 'adjustmentJournal',
//   'AR OUTSTANDING': 'Outstanding'
// };

// // Convert allowed screen names to corresponding menu item IDs
// const allowedScreenIds = allowedScreens.map((screen) => screenMapping[screen]).filter(Boolean);

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const ar = {
  id: 'ar',
  // title: 'Accounts Receivable',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'ar',
      title: 'Sales',
      type: 'collapse',
      icon: icons.IconFileDollar,

      children: [
        // {
        //   id: 'arBill',
        //   title: 'AR Bill Balance',
        //   type: 'item',
        //   url: '/finance/receipt/ArBillBalance'
        // },
        // {
        //   id: 'receipt',
        //   title: 'Receipt',
        //   type: 'item',
        //   url: '/finance/receipt/Receipt'
        // },
        // {
        //   id: 'receiptRegister',
        //   title: 'Receipt Register',
        //   type: 'item',
        //   url: '/finance/receiptRegister/ReceiptRegister'
        // }

        {
          id: 'taxInvoiceDetail',
          title: 'Tax Invoice',
          type: 'item',
          url: '/finance/taxInvoice/taxInvoiceDetail'
        },
        {
          id: 'creditNoteDetail',
          title: 'Credit Note',
          type: 'item',
          url: '/finance/creditNote/creditNoteDetail'
        },
        {
          id: 'taxRegister',
          title: 'Sales Register',
          type: 'item',
          url: '/finance/taxInvoice/TaxRegister'
        },
        {
          id: 'receipt',
          title: 'Receipt',
          type: 'item',
          url: '/finance/receipt/Receipt'
        },

        {
          id: 'adjustmentOffset',
          title: 'AR Offset',
          type: 'item',
          url: '/finance/AR-adjustment'
        },
        // {
        //   id: 'customerLedger',
        //   title: 'Customer Ledger',
        //   type: 'item',
        //   url: '/finance/AR-adjustment'
        // },
        {
          id: 'Outstanding',
          title: 'AR Outstanding',
          type: 'item',
          url: '/finance/AR-outstanding'
        },
        {
          id: 'aging',
          title: 'AR Aging',
          type: 'item',
          url: '/finance/AR-aging'
        }
      ]
      // .filter((item) => allowedScreenIds.includes(item.id))
    }
  ]
};

export default ar;
