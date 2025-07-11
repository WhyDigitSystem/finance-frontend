// assets
import { IconCopyright } from '@tabler/icons-react';

// constants
const icons = {
  IconCopyright
};

// Safe screen access
const screenAccess = JSON.parse(localStorage.getItem('screenAccess') || '{}');

const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// Child items with access check
const reportChildren = [
  {
    id: 'partyLedger',
    title: 'Party Ledger',
    type: 'item',
    url: '/finance/FinalReport/PartyLedger',
    visible: hasScreenAccess('PL')
  },
  {
    id: 'ledgerReport',
    title: 'Ledger Report',
    type: 'item',
    url: '/finance/FinalReport/LedgerReport',
    visible: hasScreenAccess('LR')
  },
  {
    id: 'trailBalance',
    title: 'Trail Balance',
    type: 'item',
    url: '/finance/FinalReport/TrailBalance',
    visible: hasScreenAccess('TB')
  },
  {
    id: 'profit',
    title: 'Profit & Loss',
    type: 'item',
    url: '/finance/FinalReport/TrailBalance',
    visible: hasScreenAccess('PF')
  },
  {
    id: 'balanceSheet',
    title: 'Balance Sheet',
    type: 'item',
    url: '/finance/FinalReport/TrailBalance',
    visible: hasScreenAccess('BLS')
  },
  {
    id: 'paymentRegister',
    title: 'Payment Register',
    type: 'item',
    url: '/finance/FinalReport/PaymentReport',
    visible: hasScreenAccess('PYR')
  },
  {
    id: 'receiptRegister',
    title: 'Receipt Register',
    type: 'item',
    url: '/finance/FinalReport/ReceiptReport',
    visible: hasScreenAccess('RR')
  },
  {
    id: 'salesReport',
    title: 'Sales Report',
    type: 'item',
    url: '/finance/FinalReport/SalesReport',
    visible: hasScreenAccess('SLR')
  },
  {
    id: 'costReport',
    title: 'Cost Report',
    type: 'item',
    url: '/finance/FinalReport/CostReport',
    visible: hasScreenAccess('CSTR')
  },
  {
    id: 'receiptReport',
    title: 'Receipt Report',
    type: 'item',
    url: '/finance/FinalReport/receiptReportD&S',
    visible: hasScreenAccess('RCR')
  },
  {
    id: 'paymentReport',
    title: 'Payment Report',
    type: 'item',
    url: '/finance/FinalReport/PaymentReportD&S',
    visible: hasScreenAccess('PR')
  },
  {
    id: 'pendingReport',
    title: 'Pending Report',
    type: 'item',
    url: '/finance/FinalReport/PendingReport',
    visible: hasScreenAccess('PENR')
  }
].filter((item) => item.visible !== false);

// Export finalReport only if any child is visible
const finalReport =
  reportChildren.length > 0
    ? {
        id: 'finalReport',
        type: 'group',
        children: [
          {
            id: 'report',
            title: 'Reports',
            type: 'collapse',
            icon: icons.IconCopyright,
            children: reportChildren
          }
        ]
      }
    : null;

export default finalReport;
