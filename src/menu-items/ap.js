// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const ap = {
  id: 'ap',
  title: 'Accounts Payable - AP',
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
          id: 'costInvoice',
          title: 'Cost Invoice',
          type: 'item',
          url: '/finance/costInvoice/CostInvoice'
        },
        {
          id: 'costDebitNote',
          title: 'Debit Note',
          type: 'item',
          url: '/finance/costDebitNote/CostDebitNote'
        },
        {
          id: 'costInvoicegna',
          title: 'R Cost Invoice',
          type: 'item',
          url: '/finance/costInvoice/RCostInvoicegna'
        },
        {
          id: 'urcostInvoicegna',
          title: 'UR Cost Invoice',
          type: 'item',
          url: '/finance/costInvoice/UrCostInvoicegna'
        },
        {
          id: 'apBill',
          title: 'AP Bill Balance',
          type: 'item',
          url: '/finance/payment/ApBillBalance'
        },
        {
          id: 'payment',
          title: 'Vendor Payment',
          type: 'item',
          url: '/finance/payment/Payment'
        },
        {
          id: 'apAdjustment',
          title: 'AP Adjustment / Offset',
          type: 'item',
          url: '/finance/paymentRegister/PaymentRegister'
        },
        {
          id: 'vendorLedger',
          title: 'Vendor Ledger',
          type: 'item',
          url: '/finance/paymentRegister/PaymentRegister'
        },
        {
          id: 'paymentRegister',
          title: 'AP Outstanding with aging Report',
          type: 'item',
          url: '/finance/paymentRegister/PaymentRegister'
        }
      ]
    }
  ]
};

export default ap;
