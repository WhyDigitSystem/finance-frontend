// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const finance = {
  id: 'finance',
  title: 'Business Master',
  type: 'group',
  children: [
    {
      id: 'finance',
      title: 'Business Master',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'listOfValues',
          title: 'List Of Values',
          type: 'item',
          url: '/finance/listOfValues/listOfValues'
        },
        {
          id: 'chargeTypeRequest',
          title: 'Charge Code',
          type: 'item',
          url: '/finance/ChargeTypeRequest'
        },
        {
          id: 'tdsMaster',
          title: 'TDS',
          type: 'item',
          url: '/finance/tdsMaster/TdsMaster'
        },
        {
          id: 'hsnSacCode',
          title: 'HSN SAC Code',
          type: 'item',
          url: '/finance/HsnSacCode'
        },
        {
          id: 'group',
          title: 'COA',
          type: 'item',
          url: '/finance/Group'
        },
        {
          id: 'costCenter',
          title: 'Cost Center Values',
          type: 'item',
          url: '/finance/costcenter/CostCentre'
        },
        {
          id: 'partyMaster',
          title: 'Party',
          type: 'item',
          url: '/finance/partyMaster'
        }
      ] // No filter applied
    }
  ]
};

export default finance;
