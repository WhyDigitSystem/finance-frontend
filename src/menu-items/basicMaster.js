// assets
import { IconCashBanknote, IconDatabaseStar, IconKey, IconWorldPin, IconUserPlus, IconBuildingFactory2, IconIdBadge2, IconLayoutDashboard, IconBriefcase, IconMapQuestion } from '@tabler/icons-react';

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
  IconBuildingFactory2
};
const icons5 = {
  IconUserPlus
};
const icons6 = {
  IconIdBadge2
};
const icons7 = {
  IconLayoutDashboard
};
const icons8 = {
  IconBriefcase
};
const icons9 = {
  IconMapQuestion
};

// const allowedScreens = JSON.parse(localStorage.getItem('screens')) || [];

// // Mapping of screen names (from localStorage) to menu item IDs
// const screenMapping = {
//   COUNTRY: 'country',
//   STATE: 'state',
//   CITY: 'city',
//   CURRENCY: 'currency',
//   REGION: 'region',
//   DEPARTMENT: 'department',
//   DESIGNATION: 'designation',
//   EMPLOYEE: 'employee'
// };

// const allowedScreenIds = allowedScreens.map((screen) => screenMapping[screen]).filter(Boolean);

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const basicMaster = {
  id: 'basicMaster',
  title: '',
  caption: 'Master',
  type: 'group',
  children: [
    {
      id: 'basicMaster',
      title: 'Master',
      type: 'collapse',
      icon: icons7.IconLayoutDashboard,
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
              url: '/basicMaster/RegionMaster',
              icon: icons9.IconMapQuestion
            },
            {
              id: 'department',
              title: 'Department',
              type: 'item',
              url: '/basicMaster/Department',
              icon: icons4.IconBuildingFactory2
            },
            {
              id: 'designation',
              title: 'Designation',
              type: 'item',
              url: '/basicMaster/Designation',
              icon: icons6.IconIdBadge2
            },
            {
              id: 'employee',
              title: 'Employee',
              type: 'item',
              url: '/basicMaster/employee',
              icon: icons5.IconUserPlus
              // <IconUserPlus stroke={2} />
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
          // .filter((item) => allowedScreenIds.includes(item.id))
        },
        {
          id: 'finance',
          title: 'Business Master',
          type: 'collapse',
          icon: icons8.IconBriefcase,
          children: [
            {
              id: 'partyMaster',
              title: 'Party',
              type: 'item',
              url: '/finance/partyMaster'
            },
            {
              id: 'customer',
              title: 'Customer',
              type: 'item',
              url: '/finance/customer'
            },
            {
              id: 'vendor',
              title: 'Vendor',
              type: 'item',
              url: '/finance/vendor'
            },
            {
              id: 'group',
              title: 'COA',
              type: 'item',
              url: '/finance/Group'
            },
            {
              id: 'tdsMaster',
              title: 'TDS',
              type: 'item',
              url: '/finance/tdsMaster/TdsMaster'
            },
            {
              id: 'taxMaster',
              title: 'Tax',
              type: 'item',
              url: '/finance/taxMaster'
            },
            {
              id: 'hsnSacCode',
              title: 'HSN SAC',
              type: 'item',
              url: '/finance/HsnSacCode'
            },
            {
              id: 'productService',
              title: 'Product Service',
              type: 'item',
              url: '/finance/ProductService'
            },
            {
              id: 'chargeTypeRequest',
              title: 'Charges',
              type: 'item',
              url: '/finance/ChargeTypeRequest'
            },
            {
              id: 'costCenter',
              title: 'Cost Center Values',
              type: 'item',
              url: '/finance/costcenter/CostCentre'
            },
            {
              id: 'listOfValues',
              title: 'List Of Values',
              type: 'item',
              url: '/finance/listOfValues/listOfValues'
            },
            {
              id: 'createPartyMaster',
              title: 'Create Party',
              type: 'item',
              url: '/finance/createPartyMaster'
            }
          ] // No filter applied
          // .filter((item) => allowedScreenIds.includes(item.id))
        }
      ]
    }
  ]
};

export default basicMaster;
