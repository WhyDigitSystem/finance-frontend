// assets
import { IconCashBanknote, IconDatabaseStar, IconKey, IconUserShield, IconWorldPin } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

const icons1 = {
  IconWorldPin
};

const icons2 = {
  IconDatabaseStar
};

const icons3 = {
  IconCashBanknote
};

const icons4 = {
  IconUserShield
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const basicMaster = {
  id: 'basicMaster',
  title: '',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'ar',
      title: 'Basic Master',
      type: 'collapse',
      icon: icons2.IconDatabaseStar,

      children: [
        // {
        //   id: 'branch',
        //   title: 'Branch',
        //   type: 'item',
        //   url: '/company/branch'
        // },

        {
          id: 'country',
          title: 'Country',
          type: 'item',
          url: '/basicMaster/country',
          icon: icons1.IconWorldPin
        },
        {
          id: 'state',
          title: 'State',
          type: 'item',
          url: '/basicMaster/state',
          icon: icons1.IconWorldPin
        },
        {
          id: 'city',
          title: 'City',
          type: 'item',
          url: '/basicMaster/city',
          icon: icons1.IconWorldPin
        },
        {
          id: 'currency',
          title: 'Currency',
          type: 'item',
          url: '/basicMaster/currency',
          icon: icons3.IconCashBanknote
        },
        {
          id: 'region',
          title: 'Region',
          type: 'item',
          url: '/basicMaster/RegionMaster'
        },
        {
          id: 'employee',
          title: 'Employee',
          type: 'item',
          url: '/basicMaster/employee',
          icon: icons4.IconUserShield
        }
        // {
        //   id: 'finYear',
        //   title: 'FinYear',
        //   type: 'item',
        //   url: '/basicMaster/finYear'
        // },
        // {
        //   id: 'roles',
        //   title: 'Roles',
        //   type: 'item',
        //   url: '/basicMaster/roles'
        // }
      ]
    }
  ]
};

export default basicMaster;
