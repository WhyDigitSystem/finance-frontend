// assets
import { IconRepeat } from '@tabler/icons-react';
import { BuildCircleOutlined, CreditCardOutlined, MenuBookOutlined, ArticleOutlined, ReceiptLongOutlined } from '@mui/icons-material';

// constant
const icons = {
  IconRepeat
};
const icons1 = {
  BuildCircleOutlined
};

const icons2 = { CreditCardOutlined };
const icons3 = { MenuBookOutlined };
const icons4 = { ArticleOutlined };
const icons5 = { ReceiptLongOutlined };

// const allowedScreens = JSON.parse(localStorage.getItem('screens')) || [];

// // Mapping of screen names (from localStorage) to menu item IDs
// const screenMapping = {
//   'EX RATES': 'daily',
//   'CHART OF COST CENTER': 'chartOfCostCenter',
//   'BRS OPENING': 'brsOpening',
//   'FUND TRANSFER': 'fundTransfer',
//   'GENERAL JOURNAL': 'generalJournal',
//   'RECONCILE BANK': 'reconcile-bank',
//   'RECONCILE CORP': 'reconcile-corp',
//   'RECONCILE CASH': 'reconcile-cash',
//   'PAYMENT VOUCHER': 'paymentVoucher',
//   'ADJUSTMENT JOURNAL': 'adjustmentJournal',
//   'JOB CARD': 'JobCard',
//   'ARAP ADJUSTMENT OFFSET': 'AdjustmentOffset',
//   'BANKING DEPOSIT': 'deposit',
//   'BANKINGWITHDRAWAL': 'withdrawal',
// };

// // Convert allowed screen names to corresponding menu item IDs
// const allowedScreenIds = allowedScreens.map((screen) => screenMapping[screen]).filter(Boolean);

// Define the transaction menu without filtering
const transactionChildren = [
  {
    id: 'finance',
    title: 'Operations',
    type: 'collapse',
    icon: icons1.BuildCircleOutlined,
    children: [
      {
        id: 'JobCard',
        title: 'Card',
        type: 'item',
        url: '/finance/JobCard',
        icon: icons2.CreditCardOutlined
      }
    ]
  },
  {
    id: 'finance',
    title: 'GNA',
    type: 'collapse',
    // icon: icons7.IconLayoutDashboard,
    icon: icons3.MenuBookOutlined,
    children: [
      {
        id: 'generalJournal',
        title: 'General Journal',
        type: 'item',
        url: '/finance/GeneralJournal/GeneralJournal',
        icon: icons4.ArticleOutlined
      },
      {
        id: 'adjustmentJournal',
        title: 'Adjustment Journal',
        type: 'item',
        url: '/finance/AdjustmentJournal',
        icon: icons5.ReceiptLongOutlined
      }
    ]
  }
  // {
  //   id: 'finance',
  //   title: 'Bank & Cash',
  //   type: 'collapse',
  //   // icon: icons8.IconBriefcase,
  //   children: [
  //     {
  //       id: 'daily',
  //       title: 'EX Rates',
  //       type: 'item',
  //       url: '/finance/daily/DailyRate'
  //     },
  //     {
  //       id: 'chartOfCostCenter',
  //       title: 'Cost center',
  //       type: 'item',
  //       url: '/finance/chartOfCostcenter/ChartOfCostcenter'
  //     },
  //     {
  //       id: 'brsOpening',
  //       title: 'BRS Opening',
  //       type: 'item',
  //       url: '/finance/BRSOpening'
  //     },
  //     {
  //       id: 'reconcile-bank',
  //       title: 'Reconcile Bank',
  //       type: 'item',
  //       url: '/finance/Reconcile/Reconcile'
  //     },
  //     {
  //       id: 'reconcile-cash',
  //       title: 'Reconcile Cash',
  //       type: 'item',
  //       url: '/finance/Reconcile/ReconcileCash'
  //     },
  //     {
  //       id: 'paymentVoucher',
  //       title: 'Payment Voucher',
  //       type: 'item',
  //       url: '/finance/paymentVoucher/paymentVoucher'
  //     },
  //     {
  //       id: 'deposit',
  //       title: 'Deposit',
  //       type: 'item',
  //       url: '/finance/Deposit'
  //     },
  //     {
  //       id: 'withdrawal',
  //       title: 'Withdrawal',
  //       type: 'item',
  //       url: '/finance/Withdrawal'
  //     }
  //   ]
  // },
  // {
  //   id: 'finance',
  //   title: 'Hidden',
  //   type: 'collapse',
  //   // icon: icons8.IconBriefcase,
  //   children: [
  //     {
  //       id: 'fundTransfer',
  //       title: 'Fund Transfer',
  //       type: 'item',
  //       url: '/finance/FundTransfer'
  //     },
  //     {
  //       id: 'reconcile-corp',
  //       title: 'Reconcile - FX',
  //       type: 'item',
  //       url: '/finance/Reconcile/ReconcileCorp'
  //     }
  //   ]
  // }
];
// .filter((item) => allowedScreenIds.includes(item.id))

// Define the transaction menu
const genTransaction = {
  id: 'transaction',
  // title: 'General Transaction',
  type: 'group',
  children: [
    {
      id: 'transaction',
      title: 'Transaction',
      type: 'collapse',
      icon: icons.IconRepeat,
      children: transactionChildren
    }
  ]
};

export default genTransaction;
