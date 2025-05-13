import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const icons = { VisibilityOffOutlinedIcon };

const Hidden = {
  id: 'Hidden',
  type: 'group',
  children: [
    {
      id: 'finance',
      title: 'Hidden',
      type: 'collapse',
      icon: icons.VisibilityOffOutlinedIcon,

      children: [
        {
          id: 'fundTransfer',
          title: 'Fund Transfer',
          type: 'item',
          url: '/finance/FundTransfer'
        },
        {
          id: 'reconcile-corp',
          title: 'Reconcile - FX',
          type: 'item',
          url: '/finance/Reconcile/ReconcileCorp'
        },
        {
          id: 'Hidden',
          title: 'Unit',
          type: 'item',
          url: '/finance/Unit'
        },
        {
          id: 'itemmaster',
          title: 'Item Master',
          type: 'item',
          url: '/finance/ItemMaster'
        }
      ]
    }
  ]
};
export default Hidden;
