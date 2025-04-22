import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
const icons = { AccountBalanceOutlinedIcon };

const BankCash = {
  id: 'BankCash',
  type: 'group',
  children: [
    {
      id: 'finance',
      title: 'Bank & Cash',
      type: 'collapse',
      icon: icons.AccountBalanceOutlinedIcon,

      children: [
        {
          id: 'daily',
          title: 'EX Rates',
          type: 'item',
          url: '/finance/daily/DailyRate'
        },
        {
          id: 'chartOfCostCenter',
          title: 'Cost center',
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
          id: 'reconcile-bank',
          title: 'Reconcile Bank',
          type: 'item',
          url: '/finance/Reconcile/Reconcile'
        },
        {
          id: 'reconcile-cash',
          title: 'Reconcile Cash',
          type: 'item',
          url: '/finance/Reconcile/ReconcileCash'
        },
        {
          id: 'paymentVoucher',
          title: 'Payment Voucher',
          type: 'item',
          url: '/finance/paymentVoucher/paymentVoucher'
        },
        {
          id: 'deposit',
          title: 'Deposit',
          type: 'item',
          url: '/finance/Deposit'
        },
        {
          id: 'withdrawal',
          title: 'Withdrawal',
          type: 'item',
          url: '/finance/Withdrawal'
        }
      ]
    }
  ]
};

export default BankCash;
