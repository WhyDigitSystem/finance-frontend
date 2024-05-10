// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const basicMaster = {
  id: 'basicMaster',
  title: 'Setup',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'ar',
      title: 'Basic Master',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'company',
          title: 'Company',
          type: 'item',
          url: '/company',
          icon: icons.IconDashboard
          //   breadcrumbs: false
        },
        {
          id: 'country',
          title: 'Country',
          type: 'item',
          url: '/basicMaster/country'
        },
        {
          id: 'state',
          title: 'State',
          type: 'item',
          url: '/basicMaster/state'
        },
        {
          id: 'city',
          title: 'City',
          type: 'item',
          url: '/basicMaster/city'
        },
        {
          id: 'currency',
          title: 'Currency',
          type: 'item',
          url: '/basicMaster/currency'
        }
      ]
    }
  ]
};

export default basicMaster;
