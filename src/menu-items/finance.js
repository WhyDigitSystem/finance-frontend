// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const finance = {
  id: 'finance',
  title: 'Finance',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Finance',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'fin1',
          title: 'Fin1',
          type: 'item',
          url: '/finance'
          //   target: true
        },
        {
          id: 'setTaxRate',
          title: 'SetTaxRate',
          type: 'item',
          url: '/finance/setTaxRate'
        },
        {
          id: 'taxMaster',
          title: 'TaxMaster',
          type: 'item',
          url: '/finance/taxMaster'
        },
        {
          id: 'taxes',
          title: 'Taxes',
          type: 'item',
          url: '/finance/taxes'
        },
        {
          id: 'tcsMaster',
          title: 'TCS Master',
          type: 'item',
          url: '/finance/tcsMaster/TcsMaster'
        },
        {
          id: 'tdsMaster',
          title: 'TDS Master',
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
          id: 'hsnSacCodesListing',
          title: 'HSN SAC Codes Listing',
          type: 'item',
          url: '/finance/HsnSacCodesListing'
        },
        {
          id: 'group',
          title: 'Group',
          type: 'item',
          url: '/finance/Group'
        }
      ]
    }
  ]
};

export default finance;
