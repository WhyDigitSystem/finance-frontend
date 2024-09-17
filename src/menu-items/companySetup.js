// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

// const companySetup = {
//   id: 'basicMaster',
//   title: 'Setup',
//   //   caption: 'Pages Caption',
//   type: 'group',
//   children: [
//     {
//       id: 'company',
//       title: 'Company',
//       type: 'item',
//       url: '/company',
//       icon: icons.IconDashboard,
//       breadcrumbs: false
//     }
//   ]
// };

const companySetup = {
  id: 'companySetup',
  title: 'Company Setup',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'companySetup',
      title: 'companySetup',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'createCompany',
          title: 'Create Company',
          type: 'item',
          url: '/company/CreateCompany',
          icon: icons.IconDashboard
        },
        {
          id: 'company',
          title: 'Company Setup',
          type: 'item',
          url: '/company/companyMain',
          icon: icons.IconDashboard
        }
      ]
    }
  ]
};

export default companySetup;
