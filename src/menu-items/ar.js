// assets
import { IconFileDollar } from '@tabler/icons-react';
import {
  RequestQuoteOutlined,
  CreditScoreOutlined,
  AssignmentOutlined,
  ReceiptLongOutlined,
  SyncAltOutlined,
  PendingActionsOutlined,
  TimelapseOutlined
} from '@mui/icons-material';

// constants
const icons = {
  IconFileDollar
};
const icons1 = {
  RequestQuoteOutlined
};
const icons2 = {
  CreditScoreOutlined
};
const icons3 = {
  AssignmentOutlined
};
const icons4 = {
  ReceiptLongOutlined
};
const icons5 = {
  SyncAltOutlined
};
const icons6 = {
  PendingActionsOutlined
};
const icons7 = {
  TimelapseOutlined
};

// get screen access safely
const screenAccess = JSON.parse(localStorage.getItem('screenAccess'));

const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// Define AR items
const arChildren = [
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
    url: '/finance/taxInvoice/taxInvoiceDetail',
    icon: icons1.RequestQuoteOutlined,
    visible: hasScreenAccess('TI')
  },
  {
    id: 'creditNoteDetail',
    title: 'Credit Note',
    type: 'item',
    url: '/finance/creditNote/creditNoteDetail',
    icon: icons2.CreditScoreOutlined,
    visible: hasScreenAccess('ICN')
  },
  {
    id: 'taxRegister',
    title: 'Sales Register',
    type: 'item',
    url: '/finance/taxInvoice/SalesRegister',
    icon: icons3.AssignmentOutlined,
    visible: hasScreenAccess('SR')
  },
  {
    id: 'receipt',
    title: 'Receipt',
    type: 'item',
    url: '/finance/receipt/Receipt',
    icon: icons4.ReceiptLongOutlined,
    visible: hasScreenAccess('RT')
  },
  {
    id: 'adjustmentOffset',
    title: 'AR Offset',
    type: 'item',
    url: '/finance/AR-adjustment',
    icon: icons5.SyncAltOutlined,
    visible: hasScreenAccess('ARA')
  },
  {
    id: 'Outstanding',
    title: 'AR Outstanding',
    type: 'item',
    url: '/finance/AR-outstanding',
    icon: icons6.PendingActionsOutlined,
    visible: hasScreenAccess('ARO')
  },
  {
    id: 'aging',
    title: 'AR Ageing',
    type: 'item',
    url: '/finance/AR-aging',
    icon: icons7.TimelapseOutlined,
    visible: hasScreenAccess('ARAG')
  }
].filter((item) => item.visible !== false);

const ar =
  arChildren.length > 0
    ? {
      id: 'ar',
      type: 'group',
      children: [
        {
          id: 'sales',
          title: 'Sales',
          type: 'collapse',
          icon: icons.IconFileDollar,
          children: arChildren
        }
      ]
    }
    : null;

export default ar;
