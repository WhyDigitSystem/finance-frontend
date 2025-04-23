// assets
import { IconKey } from '@tabler/icons-react';
import { MdOutlinePayment } from 'react-icons/md';
import { IconFileInvoice } from '@tabler/icons-react';
import { BiCreditCard } from 'react-icons/bi';

// constant
const icons = {
  IconFileInvoice
};

// const allowedScreens = JSON.parse(localStorage.getItem('screens')) || [];

// // Mapping of screen names (from localStorage) to menu item IDs
// const screenMapping = {
//   'COST INVOICE': 'costInvoice',
//   'COST DEBIT NOTE': 'costDebitNote',
//   'R COST INVOICE': 'rcostInvoicegna',
//   'UR COST INVOICE': 'urcostInvoicegna',
//   'COST REGISTER': 'costRegister',
//   'AP BILL BALANCE': 'apBill',
//   'PAYMENT': 'payment',
//   'AP ADJUSTMENT OFFSET': 'apAdjustment',
//   'VENDOR LEDGER': 'vendorLedger',
//   'PAYMENT REGISTER': 'paymentRegister',
// };

// // Convert allowed screen names to corresponding menu item IDs
// const allowedScreenIds = allowedScreens.map((screen) => screenMapping[screen]).filter(Boolean);

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const ap = {
  id: 'ap',
  // title: 'Accounts Payable',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'ap',
      title: 'Purchase',
      type: 'collapse',
      icon: icons.IconFileInvoice,

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
          id: 'rcostInvoicegna',
          title: 'R Cost Invoice',
          type: 'item',
          url: '/finance/RCostInvoicegna/RCostInvoicegna'
        },
        {
          id: 'urcostInvoicegna',
          title: 'UR Cost Invoice',
          type: 'item',
          url: '/finance/UrCostInvoicegna/UrCostInvoicegna'
        },
        {
          id: 'costRegister',
          title: 'Cost Register',
          type: 'item',
          url: '/finance/costInvoice/CostRegister'
        },
        {
          id: 'apBill',
          title: 'AP Bill Balance',
          type: 'item',
          url: '/finance/payment/ApBillBalance'
        },
        {
          id: 'payment',
          title: 'Payment',
          type: 'item',
          url: '/finance/payment/Payment'
        },
        {
          id: 'apAdjustment',
          title: 'AP Offset',
          type: 'item',
          url: '/finance/AP-adjustment'
        },
        // {
        //   id: 'vendorLedger',
        //   title: 'Vendor Ledger',
        //   type: 'item',
        //   url: '/finance/paymentRegister/PaymentRegister'
        // },
        {
          // id: 'paymentRegister',
          id: 'Ap OutSstanding',
          title: 'AP Outstanding',
          type: 'item',
          url: '/Finance/paymentRegister/PaymentRegister'
        },

        {
          id: 'apAging',
          title: 'AP Ageing',
          type: 'item',
          url: '/Finance/paymentRegister/APaging'
        }
      ]
      // .filter((item) => allowedScreenIds.includes(item.id))
    }
  ]
};

export default ap;
