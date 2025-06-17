// assets
import { IconCopyright } from '@tabler/icons-react';

// constant
const icons = {
  IconCopyright
};

// const allowedScreens = JSON.parse(localStorage.getItem('screens')) || [];

// // Mapping of screen names (from localStorage) to menu item IDs
// const screenMapping = {
//   'PARTY LEDGER': 'partyLedger',
//   'LEDGER REPORT': 'ledgerReport',
//   'TRAIL BALANCE': 'trailBalance',
//   'PROFIT': 'profit',
//   'BALANCESHEET': 'balanceSheet'
// };

// const allowedScreenIds = allowedScreens.map((screen) => screenMapping[screen]).filter(Boolean);

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const finalReport =  {
  id: ' finalReport',
  // title: 'Final Report',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'report',
      title: 'Reports',
      type: 'collapse',
      icon: icons.IconCopyright,
      children: [
        {
          id: 'partyLedger',
          title: 'Party Ledger',
          type: 'item',
          url: '/finance/FinalReport/PartyLedger'
        },
        {
          id: 'ledgerReport',
          title: 'Ledger Report',
          type: 'item',
          url: '/finance/FinalReport/LedgerReport'
        },
        {
          id: 'trailBalance',
          title: 'Trail Balance',
          type: 'item',
          url: '/finance/FinalReport/TrailBalance'
        },
        {
          id: 'profit',
          title: 'Profit & Loss',
          type: 'item',
          url: '/finance/FinalReport/TrailBalance'
        },
        {
          id: 'balanceSheet',
          title: 'Balance Sheet',
          type: 'item',
          url: '/finance/FinalReport/TrailBalance'
        },
        {
          id: 'paymentRegister',
          title: 'Payment Register',
          type: 'item',
          url: '/finance/FinalReport/PaymentReport'
        },
        {
          id: 'receiptRegister',
          title: 'Receipt Register',
          type: 'item',
          url: '/finance/FinalReport/ReceiptReport'
        },
        {
          id: 'salesReport',
          title: 'Sales Report',
          type: 'item',
          url: '/finance/FinalReport/SalesReport'
        },
        {
          id: 'costReport',
          title: 'Cost Report',
          type: 'item',
          url: '/finance/FinalReport/CostReport'
        },
      ]
      // .filter((item) => allowedScreenIds.includes(item.id))
    }
  ]
} 

export default finalReport;
