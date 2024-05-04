// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const finance = {
  id: 'finance',
  title: 'Finance',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Finance',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        // {
        //   id: 'fin1',
        //   title: 'Fin1',
        //   type: 'item',
        //   url: '/finance'
        //   //   target: true
        // },
        {
          id: 'setTaxRate',
          title: 'SetTaxRate',
          type: 'item',
          url: '/finance/setTaxRate'
        },
        {
          id: 'taxMaster',
          title: 'TaxMaster',
          type: 'item',
          url: '/finance/taxMaster'
        },
        {
          id: 'taxes',
          title: 'Taxes',
          type: 'item',
          url: '/finance/taxes'
        },
        {
          id: 'tcsMaster',
          title: 'TCS Master',
          type: 'item',
          url: '/finance/tcsMaster/TcsMaster'
        },
        {
          id: 'tdsMaster',
          title: 'TDS Master',
          type: 'item',
          url: '/finance/tdsMaster/TdsMaster'
        },
        {
          id: 'hsnSacCode',
          title: 'HSN SAC Code',
          type: 'item',
          url: '/finance/HsnSacCode'
        },
        {
          id: 'hsnSacCodesListing',
          title: 'HSN SAC Codes Listing',
          type: 'item',
          url: '/finance/HsnSacCodesListing'
        },
        {
          id: 'group',
          title: 'Group',
          type: 'item',
          url: '/finance/Group'
        },
        {
          id: 'account',
          title: 'Account',
          type: 'item',
          url: '/finance/account/Account'
        },
        {
          id: 'exRates',
          title: 'ExRates',
          type: 'item',
          url: '/finance/ExRates'
        },
        {
          id: 'subLedgerAccount',
          title: 'Sub Ledger Account',
          type: 'item',
          url: '/finance/SubLedgerAccount'
        },
        {
          id: 'costCenter',
          title: 'Cost Center Values',
          type: 'item',
          url: '/finance/costcenter/CostCentre'
        },
        {
          id: 'daily',
          title: 'Daily / Monthly Ex. Rates',
          type: 'item',
          url: '/finance/daily/DailyRate'
        },
        {
          id: 'chartOfCostCenter',
          title: 'Chart of Costcenter',
          type: 'item',
          url: '/finance/chartOfCostcenter/ChartOfCostcenter'
        },
        {
          id: 'brsOpening',
          title: 'BRS Opening',
          type: 'item',
          url: '/finance/BRSOpening'
        },
        {
          id: 'arApBill',
          title: 'AR/AP Bill Balance',
          type: 'item',
          url: '/finance/ArApBill'
        },
        {
          id: 'chequeBookMaster',
          title: 'Cheque Book Master',
          type: 'item',
          url: '/finance/chequeBookMaster/ChequeBookMaster'
        },
        {
          id: 'glOpening',
          title: 'GL Opening Balance',
          type: 'item',
          url: '/finance/glOpening/GlOpening'
        },
        {
          id: 'fundTransfer',
          title: 'Fund Transfer',
          type: 'item',
          url: '/finance/FundTransfer'
        },
        {
          id: 'generalJournal',
          title: 'General Journal',
          type: 'item',
          url: '/finance/GeneralJournal/GeneralJournal'
        },
        {
          id: 'receipt',
          title: 'Receipt',
          type: 'item',
          url: '/finance/receipt/Receipt'
        },
        {
          id: 'payment',
          title: 'Payment',
          type: 'item',
          url: '/finance/payment/Payment'
        },
        {
          id: 'reconcile',
          title: 'Reconcile',
          type: 'item',
          url: '/finance/Reconcile/Reconcile'
        },
        {
          id: 'receiptRegister',
          title: 'Receipt Register',
          type: 'item',
          url: '/finance/receiptRegister/ReceiptRegister'
        },
        {
          id: 'paymentRegister',
          title: 'Payment Register',
          type: 'item',
          url: '/finance/paymentRegister/PaymentRegister'
        },
        {
          id: 'reconciliationSummary',
          title: 'Reconciliation Summary',
          type: 'item',
          url: '/finance/ReconciliationSummaryReport/ReconciliationSummary'
        }
      ]
    }
  ]
};

export default finance;
