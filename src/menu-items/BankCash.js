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

const icons = {
  AccountBalanceOutlined,
  CurrencyExchangeOutlined,
  AccountTreeOutlined,
  LockOpenOutlined,
  AccountBalanceWalletOutlined,
  AttachMoneyOutlined,
  PaymentOutlined,
  MoveToInboxOutlined,
  MoneyOffOutlined
};

// Load access once
const screenAccess = JSON.parse(localStorage.getItem('screenAccess') || '{}');

const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// Define children items with visibility flags
const bankCashChildren = [
  {
    id: 'daily',
    title: 'EX Rates',
    type: 'item',
    url: '/finance/daily/DailyRate',
    icon: icons.CurrencyExchangeOutlined,
    visible: hasScreenAccess('EXR')
  },
  {
    id: 'chartOfCostCenter',
    title: 'Cost center',
    type: 'item',
    url: '/finance/chartOfCostcenter/ChartOfCostcenter',
    icon: icons.AccountTreeOutlined,
    visible: hasScreenAccess('CC')
  },
  {
    id: 'brsOpening',
    title: 'BRS Opening',
    type: 'item',
    url: '/finance/BRSOpening',
    icon: icons.LockOpenOutlined,
    visible: hasScreenAccess('BRS')
  },
  {
    id: 'reconcile-bank',
    title: 'Reconcile Bank',
    type: 'item',
    url: '/finance/Reconcile/Reconcile',
    icon: icons.AccountBalanceWalletOutlined,
    visible: hasScreenAccess('RB')
  },
  {
    id: 'reconcile-cash',
    title: 'Reconcile Cash',
    type: 'item',
    url: '/finance/Reconcile/ReconcileCash',
    icon: icons.AttachMoneyOutlined,
    visible: hasScreenAccess('RCH')
  },
  {
    id: 'paymentVoucher',
    title: 'Payment Voucher',
    type: 'item',
    url: '/finance/paymentVoucher/paymentVoucher',
    icon: icons.PaymentOutlined,
    visible: hasScreenAccess('PV')
  },
  {
    id: 'deposit',
    title: 'Deposit',
    type: 'item',
    url: '/finance/Deposit',
    icon: icons.MoveToInboxOutlined,
    visible: hasScreenAccess('BD')
  },
  {
    id: 'withdrawal',
    title: 'Withdrawal',
    type: 'item',
    url: '/finance/Withdrawal',
    icon: icons.MoneyOffOutlined,
    visible: hasScreenAccess('BW')
  },
  {
    id: 'costEstimate',
    title: 'Cost Estimate',
    type: 'item',
    url: '/finance/CostEstimate',
    icon: icons.MoneyOffOutlined,
    visible: hasScreenAccess('CE')
  }
].filter((item) => item.visible !== false);

// Only export the menu if there are children to show
const BankCash =
  bankCashChildren.length > 0
    ? {
        id: 'BankCash',
        type: 'group',
        children: [
          {
            id: 'finance',
            title: 'Bank & Cash',
            type: 'collapse',
            icon: icons.AccountBalanceOutlined,
            children: bankCashChildren
          }
        ]
      }
    : null;

export default BankCash;
