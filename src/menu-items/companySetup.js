// assets
import {
  IconAppWindow,
  IconCalendarDollar,
  IconCopyright,
  IconFileTypeDoc,
  IconSettingsPlus,
  IconSquareRoundedPlus
} from '@tabler/icons-react';

// constant
const icons = {
  IconCopyright
};

const icons1 = {
  IconSquareRoundedPlus
};
const icons2 = {
  IconSettingsPlus
};

const icons3 = {
  IconCalendarDollar
};

const icons4 = {
  IconFileTypeDoc
};

const icons5 = {
  IconAppWindow
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
  title: '',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'companySetup',
      title: 'Setup',
      type: 'collapse',
      icon: icons2.IconSettingsPlus,

      children: [
        {
          id: 'createCompany',
          title: 'New Entity',
          type: 'item',
          url: '/companysetup/createcompany',
          icon: icons1.IconSquareRoundedPlus
        },
        {
          id: 'company',
          title: 'Company Setup',
          type: 'item',
          url: '/companysetup/companysetup',
          icon: icons2.IconSettingsPlus
        },
        {
          id: 'finYear',
          title: 'FinYear',
          type: 'item',
          url: '/basicMaster/finYear',
          icon: icons3.IconCalendarDollar
        },
        {
          id: 'screenNames',
          title: 'Screens',
          type: 'item',
          url: '/basicMaster/ScreenNames',
          icon: icons5.IconAppWindow
        },
        {
          id: 'documentType',
          title: 'Doc Type',
          type: 'item',
          url: '/finance/DocumentType/documentType',
          icon: icons4.IconFileTypeDoc
        },
        {
          id: 'documentTypeMaping',
          title: 'Doc Mapping',
          type: 'item',
          url: '/finance/DocumentType/documentTypeMapping',
          icon: icons4.IconFileTypeDoc
        },
        {
          id: 'multipleDocumentIdGeneration',
          title: 'Multi Doc',
          type: 'item',
          url: '/finance/DocumentType/multipleDocumentIdGeneration',
          icon: icons4.IconFileTypeDoc
        },
      ]
    }
  ]
};

export default companySetup;
