// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

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
      icon: icons.IconKey,
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
        },        
        
        
      ] // No filter applied
    }
  ]
};

export default finance;
