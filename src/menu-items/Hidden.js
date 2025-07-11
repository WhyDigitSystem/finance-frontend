import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

// Icons
const icons = { VisibilityOffOutlinedIcon };

// Read screen access safely
const screenAccess = JSON.parse(localStorage.getItem('screenAccess'));

// Helper function to check screen access
const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// Define children with visibility
const hiddenChildren = [
  {
    id: 'fundTransfer',
    title: 'Fund Transfer',
    type: 'item',
    url: '/finance/FundTransfer',
    visible: hasScreenAccess('FT')
  },
  {
    id: 'reconcile-corp',
    title: 'Reconcile - FX',
    type: 'item',
    url: '/finance/Reconcile/ReconcileCorp',
    visible: hasScreenAccess('RC')
  },
  {
    id: 'unit',
    title: 'Unit',
    type: 'item',
    url: '/finance/Unit',
    visible: hasScreenAccess('UNIT')
  },
  {
    id: 'itemmaster',
    title: 'Item Master',
    type: 'item',
    url: '/finance/ItemMaster',
    visible: hasScreenAccess('ITEMMAS')
  }
].filter((item) => item.visible !== false);

// Return Hidden menu only if any child is visible
const Hidden =
  hiddenChildren.length > 0
    ? {
        id: 'Hidden',
        type: 'group',
        children: [
          {
            id: 'finance',
            title: 'Hidden',
            type: 'collapse',
            icon: icons.VisibilityOffOutlinedIcon,
            children: hiddenChildren
          }
        ]
      }
    : null;

export default Hidden;
