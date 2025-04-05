// assets
import { IconBriefcase } from '@tabler/icons-react';

// constant
const icons = {
  IconBriefcase
};

// const allowedScreens = JSON.parse(localStorage.getItem('screens')) || [];

// // Mapping of screen names (from localStorage) to menu item IDs
// const screenMapping = {
//   'PARTY': 'partyMaster',
//   'CUSTOMER': 'customer',
//   'VENDOR': 'vendor',
//   'COA': 'group',
//   'TDS': 'tdsMaster',
//   'TAX': 'taxMaster',
//   'HSN SAC CODE': 'hsnSacCode',
//   'CHARGES': 'chargeTypeRequest',
//   'COST CENTER': 'costCenter',
//   'LIST OF VALUES': 'listOfValues',
//   'PARTY MASTER': 'createPartyMaster',
// };

// // Convert allowed screen names to corresponding menu item IDs
// const allowedScreenIds = allowedScreens.map((screen) => screenMapping[screen]).filter(Boolean);

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const finance = {
  id: 'finance',
  // title: 'Business Master',
  type: 'group',
  children: [
    {
      id: 'finance',
      title: 'Business Master',
      type: 'collapse',
      icon: icons.IconBriefcase,
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
};

export default finance;
