// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const companySetup = {
  id: 'basicMaster',
  title: 'Setup',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'company',
      title: 'Company',
      type: 'item',
      url: '/company',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default companySetup;
