// assets
import { IconFileInvoice } from '@tabler/icons-react';

// constant
const icons = {
  IconFileInvoice
};

// Safe screen access
const screenAccess = JSON.parse(localStorage.getItem('screenAccess') || '{}');

const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// Define children with access check
const apChildren = [
  {
    id: 'costInvoice',
    title: 'Cost Invoice',
    type: 'item',
    url: '/finance/costInvoice/CostInvoice',
    visible: hasScreenAccess('CI')
  },
  {
    id: 'costDebitNote',
    title: 'Debit Note',
    type: 'item',
    url: '/finance/costDebitNote/CostDebitNote',
    visible: hasScreenAccess('CDN')
  },
  {
    id: 'rcostInvoicegna',
    title: 'R Cost Invoice',
    type: 'item',
    url: '/finance/RCostInvoicegna/RCostInvoicegna',
    visible: hasScreenAccess('RCOI')
  },
  {
    id: 'urcostInvoicegna',
    title: 'UR Cost Invoice',
    type: 'item',
    url: '/finance/UrCostInvoicegna/UrCostInvoicegna',
    visible: hasScreenAccess('URCI')
  },
  {
    id: 'costRegister',
    title: 'Cost Register',
    type: 'item',
    url: '/finance/costInvoice/CostRegister',
    visible: hasScreenAccess('CR')
  },
  {
    id: 'apBill',
    title: 'AP Bill Balance',
    type: 'item',
    url: '/finance/payment/ApBillBalance',
    visible: hasScreenAccess('APB')
  },
  {
    id: 'payment',
    title: 'Payment',
    type: 'item',
    url: '/finance/payment/Payment',
    visible: hasScreenAccess('PT')
  },
  {
    id: 'apAdjustment',
    title: 'AP Offset',
    type: 'item',
    url: '/finance/AP-adjustment',
    visible: hasScreenAccess('APA')
  },
  {
    id: 'Ap OutSstanding',
    title: 'AP Outstanding',
    type: 'item',
    url: '/Finance/paymentRegister/PaymentRegister',
    visible: hasScreenAccess('APO')
  },
  {
    id: 'apAging',
    title: 'AP Ageing',
    type: 'item',
    url: '/Finance/paymentRegister/APaging',
    visible: hasScreenAccess('APAG')
  }
].filter((item) => item.visible !== false);

// Only show if at least one child is visible
const ap =
  apChildren.length > 0
    ? {
        id: 'ap',
        type: 'group',
        children: [
          {
            id: 'purchase',
            title: 'Purchase',
            type: 'collapse',
            icon: icons.IconFileInvoice,
            children: apChildren
          }
        ]
      }
    : null;

export default ap;
