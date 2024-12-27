// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// Retrieve allowed screens from local storage
const allowedScreens = JSON.parse(localStorage.getItem('screens') || '[]');

// Helper function to check if a screen should be displayed
const isScreenAllowed = (screenTitle) => {
  return allowedScreens.includes(screenTitle.toUpperCase());
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
        // {
        //   id: 'finYear',
        //   title: 'FinYear',
        //   type: 'item',
        //   url: '/basicMaster/finYear'
        // },
        {
          id: 'partyMaster',
          title: 'Party',
          type: 'item',
          url: '/finance/partyMaster'
        }
        // {
        //   id: 'documentType',
        //   title: 'Document Type',
        //   type: 'item',
        //   url: '/finance/DocumentType/documentType'
        // },
        // {
        //   id: 'documentTypeMaping',
        //   title: 'Document Type Mapping',
        //   type: 'item',
        //   url: '/finance/DocumentType/documentTypeMapping'
        // },
        // {
        //   id: 'multipleDocumentIdGeneration',
        //   title: 'Multiple Document Id Generation',
        //   type: 'item',
        //   url: '/finance/DocumentType/multipleDocumentIdGeneration'
        // }
      ].filter((child) => isScreenAllowed(child.title)) // Filter based on allowed screens
    }
  ]
};

export default finance;
