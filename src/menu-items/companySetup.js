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

// constants
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

// get access from localStorage safely
const screenAccess = JSON.parse(localStorage.getItem('screenAccess') || '{}');

const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// Define Setup Children with access
const setupChildren = [
  {
    id: 'createCompany',
    title: 'New Entity',
    type: 'item',
    url: '/companySetup/CreateCompany',
    icon: icons1.IconSquareRoundedPlus,
    visible: hasScreenAccess('NE')
  },
  {
    id: 'company',
    title: 'Company Setup',
    type: 'item',
    url: '/companySetup/CompanySetup',
    icon: icons2.IconSettingsPlus,
    visible: hasScreenAccess('CSET')
  },
  {
    id: 'finYear',
    title: 'FinYear',
    type: 'item',
    url: '/basicMaster/finYear',
    icon: icons3.IconCalendarDollar,
    visible: hasScreenAccess('FY')
  },
  {
    id: 'screenNames',
    title: 'Screens',
    type: 'item',
    url: '/basicMaster/ScreenNames',
    icon: icons5.IconAppWindow,
    visible: hasScreenAccess('SRE')
  },
  {
    id: 'documentType',
    title: 'Doc Type',
    type: 'item',
    url: '/finance/DocumentType/documentType',
    icon: icons4.IconFileTypeDoc,
    visible: hasScreenAccess('DT')
  },
  {
    id: 'documentTypeMaping',
    title: 'Doc Mapping',
    type: 'item',
    url: '/finance/DocumentType/documentTypeMapping',
    icon: icons4.IconFileTypeDoc,
    visible: hasScreenAccess('DTM')
  },
  {
    id: 'multipleDocumentIdGeneration',
    title: 'Multi Doc',
    type: 'item',
    url: '/finance/DocumentType/multipleDocumentIdGeneration',
    icon: icons4.IconFileTypeDoc,
    visible: hasScreenAccess('MULDOC')
  }
].filter((item) => item.visible !== false);

// Define User Management Children with access
const userManagementChildren = [
  {
    id: 'userCreation',
    title: 'User Creation',
    type: 'item',
    url: '/admin/user-creation/UserCreation',
    icon: icon.IconUser,
    visible: hasScreenAccess('UC')
  },
  {
    id: 'rolesAndResponsibilities',
    title: 'Roles And Responsibilities',
    type: 'item',
    url: '/basicMaster/roles',
    icon: icons6.IconPasswordUser,
    visible: hasScreenAccess('ROLRES')
  },
  {
    id: 'screenAccess',
    title: 'Screen Access',
    type: 'item',
    url: '/basicMaster/screenAccess',
    icon: icons6.IconPasswordUser,
    visible: hasScreenAccess('SCRACC')
  }
].filter((item) => item.visible !== false);

// Combine visible children
const children = [];

if (setupChildren.length > 0) {
  children.push({
    id: 'companySetup',
    title: 'SetUp',
    type: 'collapse',
    icon: icons2.IconSettingsPlus,
    children: setupChildren
  });
}

if (userManagementChildren.length > 0) {
  children.push({
    id: 'userManagement',
    title: 'User Management',
    type: 'collapse',
    icon: icon.IconUser,
    children: userManagementChildren
  });
}

const companySetup =
  children.length > 0
    ? {
        id: 'companySetupGroup',
        type: 'group',
        children: [
          {
            id: 'companySetupGroup',
            title: 'IT Admin',
            type: 'collapse',
            icon: icons.IconCopyright,
            children
          }
        ]
      }
    : null;

export default companySetup;
