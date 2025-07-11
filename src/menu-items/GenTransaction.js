// assets
import { IconRepeat } from '@tabler/icons-react';
import {
  BuildCircleOutlined,
  CreditCardOutlined,
  MenuBookOutlined,
  ArticleOutlined,
  ReceiptLongOutlined
} from '@mui/icons-material';

// constants
const icons = { IconRepeat };
const icons1 = { BuildCircleOutlined };
const icons2 = { CreditCardOutlined };
const icons3 = { MenuBookOutlined };
const icons4 = { ArticleOutlined };
const icons5 = { ReceiptLongOutlined };

// safely parse screen access
const screenAccess = JSON.parse(localStorage.getItem('screenAccess') || '{}');

const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// Build transaction menu with visibility logic
const transactionChildren = [
  ...(function () {
    const operationChildren = [
      {
        id: 'JobCard',
        title: 'Card',
        type: 'item',
        url: '/finance/JobCard',
        icon: icons2.CreditCardOutlined,
        visible: hasScreenAccess('JC')
      }
    ].filter((item) => item.visible !== false);

    return operationChildren.length
      ? [
          {
            id: 'operations',
            title: 'Operations',
            type: 'collapse',
            icon: icons1.BuildCircleOutlined,
            children: operationChildren
          }
        ]
      : [];
  })(),

  ...(function () {
    const gnaChildren = [
      {
        id: 'generalJournal',
        title: 'General Journal',
        type: 'item',
        url: '/finance/GeneralJournal/GeneralJournal',
        icon: icons4.ArticleOutlined,
        visible: hasScreenAccess('GJ')
      },
      {
        id: 'adjustmentJournal',
        title: 'Adjustment Journal',
        type: 'item',
        url: '/finance/AdjustmentJournal',
        icon: icons5.ReceiptLongOutlined,
        visible: hasScreenAccess('AJ')
      }
    ].filter((item) => item.visible !== false);

    return gnaChildren.length
      ? [
          {
            id: 'gna',
            title: 'GNA',
            type: 'collapse',
            icon: icons3.MenuBookOutlined,
            children: gnaChildren
          }
        ]
      : [];
  })()
];

// Define the transaction menu object
const genTransaction =
  transactionChildren.length > 0
    ? {
        id: 'transaction',
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
      }
    : null; // return null if no children visible

export default genTransaction;
