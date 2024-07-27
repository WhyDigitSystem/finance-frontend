// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const finance = {
  id: 'finance',
  title: 'Master',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Master',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'setTaxRate',
          title: 'SetTaxRate',
          type: 'item',
          url: '/finance/setTaxRate'
        },
        {
          id: 'listOfValues',
          title: 'List Of Values',
          type: 'item',
          url: '/finance/listOfValues/listOfValues'
        },
        {
          id: 'chargeTypeRequest',
          title: 'Charge Type Request',
          type: 'item',
          url: '/finance/ChargeTypeRequest'
        },
        {
          id: 'taxMaster',
          title: 'TaxMaster',
          type: 'item',
          url: '/finance/taxMaster'
        },
        // {
        //   id: 'taxes',
        //   title: 'Taxes',
        //   type: 'item',
        //   url: '/finance/taxMaster/taxMaster'
        // },
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
        // {
        //   id: 'hsnSacCodesListing',
        //   title: 'HSN SAC Codes Listing',
        //   type: 'item',
        //   url: '/finance/HsnSacCodesListing'
        // },
        {
          id: 'group',
          title: 'Group',
          type: 'item',
          url: '/finance/Group'
        },
        {
          id: 'account',
          title: 'Account',
          type: 'item',
          url: '/finance/account/Account'
        },
        {
          id: 'exRates',
          title: 'ExRates',
          type: 'item',
          url: '/finance/ExRates'
        },
        {
          id: 'subLedgerAccount',
          title: 'Sub Ledger Account',
          type: 'item',
          url: '/finance/SubLedgerAccount'
        },
        {
          id: 'costCenter',
          title: 'Cost Center Values',
          type: 'item',
          url: '/finance/costcenter/CostCentre'
        },
        {
          id: 'chequeBookMaster',
          title: 'Cheque Book Master',
          type: 'item',
          url: '/finance/chequeBookMaster/ChequeBookMaster'
        }
      ]
    }
  ]
};

export default finance;
