// assets
import { breadcrumbs } from '@material-tailwind/react';
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const transaction = {
  id: 'transaction',
  title: 'Transaction',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Transaction',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
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
          id: 'reconcile',
          title: 'Reconcile',
          type: 'item',
          url: '/finance/Reconcile/Reconcile'
        },
        {
          id: 'reconciliationSummary',
          title: 'Reconciliation Summary',
          type: 'item',
          url: '/finance/ReconciliationSummaryReport/ReconciliationSummary'
        },
        {
          id: 'taxInvoiceDetail',
          title: 'Tax Invoice',
          type: 'item',
          url: '/finance/taxInvoice/taxInvoiceDetail'
        },
        {
          id: 'creditNoteDetail',
          title: 'IRN Credit Note',
          type: 'item',
          url: '/finance/creditNote/creditNoteDetail'
        },
        {
          id: 'costInvoice',
          title: 'Cost Invoice',
          type: 'item',
          url: '/finance/costInvoice/CostInvoice'
        },
        {
          id: 'costDebitNote',
          title: 'Cost Debit Note',
          type: 'item',
          url: '/finance/costDebitNote/CostDebitNote'
        }
      ]
    }
  ]
};

export default transaction;
