// assets
import {
  IconAppWindow,
  IconCalendarDollar,
  IconCopyright,
  IconFileTypeDoc,
  IconSettingsPlus,
  IconSquareRoundedPlus,
  IconUser,
  IconPasswordUser
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
const icon = {
  IconUser
};
const icons6 = {
  IconPasswordUser
};

const companySetup = {
  id: 'companySetupGroup',
  title: '',
  type: 'group',
  children: [
    {
      id: 'companySetupGroup',
      title: 'IT Admin',
      caption: '',
      type: 'collapse',
      icon: icons.IconCopyright,
      children: [
        {
          id: 'companySetup',
          title: 'SetUp',
          type: 'collapse',
          icon: icons2.IconSettingsPlus,
          children: [
            {
              id: 'createCompany',
              title: 'New Entity',
              type: 'item',
              url: '/companySetup/CreateCompany',
              icon: icons1.IconSquareRoundedPlus
            },
            {
              id: 'company',
              title: 'Company Setup',
              type: 'item',
              url: '/companySetup/CompanySetup',
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
            }
          ]
        },
        {
          id: 'userManagement',
          title: 'User Management',
          type: 'collapse',
          icon: icon.IconUser,
          children: [
            {
              id: 'userCreation',
              title: 'User Creation',
              type: 'item',
              url: '/admin/user-creation/UserCreation',
              icon: icon.IconUser
              // breadcrumbs: true
            },
            {
              id: 'rolesAndResponsibilities',
              title: 'Roles And Responsibilities',
              type: 'item',
              url: '/basicMaster/roles',
              icon: icons6.IconPasswordUser
            }
          ]
        }
      ]
    }
  ]
};

export default companySetup;
