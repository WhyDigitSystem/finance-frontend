import {
  AccountBalanceOutlined,
  CurrencyExchangeOutlined,
  AccountTreeOutlined,
  LockOpenOutlined,
  AccountBalanceWalletOutlined,
  AttachMoneyOutlined,
  PaymentOutlined,
  MoveToInboxOutlined,
  MoneyOffOutlined
} from '@mui/icons-material';

const icons = { AccountBalanceOutlined };
const icons1 = {
  CurrencyExchangeOutlined
};
const icons2 = {
  AccountTreeOutlined
};
const icons3 = {
  LockOpenOutlined
};
const icons4 = {
  AccountBalanceWalletOutlined
};
const icons5 = {
  AttachMoneyOutlined
};
const icons6 = {
  PaymentOutlined
};
const icons7 = {
  MoveToInboxOutlined
};
const icons8 = {
  MoneyOffOutlined
};
const BankCash = {
  id: 'BankCash',
  type: 'group',
  children: [
    {
      id: 'finance',
      title: 'Bank & Cash',
      type: 'collapse',
      icon: icons.AccountBalanceOutlined,

      children: [
        {
          id: 'daily',
          title: 'EX Rates',
          type: 'item',
          url: '/finance/daily/DailyRate',
          icon: icons1.CurrencyExchangeOutlined
        },
        {
          id: 'chartOfCostCenter',
          title: 'Cost center',
          type: 'item',
          url: '/finance/chartOfCostcenter/ChartOfCostcenter',
          icon: icons2.AccountTreeOutlined
        },
        {
          id: 'brsOpening',
          title: 'BRS Opening',
          type: 'item',
          url: '/finance/BRSOpening',
          icon: icons3.LockOpenOutlined
        },
        {
          id: 'reconcile-bank',
          title: 'Reconcile Bank',
          type: 'item',
          url: '/finance/Reconcile/Reconcile',
          icon: icons4.AccountBalanceWalletOutlined
        },
        {
          id: 'reconcile-cash',
          title: 'Reconcile Cash',
          type: 'item',
          url: '/finance/Reconcile/ReconcileCash',
          icon: icons5.AttachMoneyOutlined
        },
        {
          id: 'paymentVoucher',
          title: 'Payment Voucher',
          type: 'item',
          url: '/finance/paymentVoucher/paymentVoucher',
          icon: icons6.PaymentOutlined
        },
        {
          id: 'deposit',
          title: 'Deposit',
          type: 'item',
          url: '/finance/Deposit',
          icon: icons7.MoveToInboxOutlined
        },
        {
          id: 'withdrawal',
          title: 'Withdrawal',
          type: 'item',
          url: '/finance/Withdrawal',
          icon: icons8.MoneyOffOutlined
        },
        {
          id: 'costEstimate',
          title: 'Cost Estimate',
          type: 'item',
          url: '/finance/CostEstimate',
          icon: icons8.MoneyOffOutlined
        }
      ]
    }
  ]
};

export default BankCash;
