// assets
import {
  IconCashBanknote,
  IconDatabaseStar,
  IconKey,
  IconFiles,
  IconUserPlus,
  IconBuildingFactory2,
  IconIdBadge2,
  IconMapQuestion
} from '@tabler/icons-react';

// constant
const icons = {
  IconFiles
};


// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const docs = {
  id: 'docs',
  title: '',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'ar',
      title: 'Docs',
      type: 'collapse',
      icon: icons.IconFiles,

      children: [
        {
          id: 'stockBranch',
          title: 'Stock Branch',
          type: 'item',
          url: '/docs/stockBranch'
        },
        {
          id: 'warehouse',
          title: 'Warehouse',
          type: 'item',
          url: '/docs/warehouse'
        },
        {
          id: 'assetType',
          title: 'Asset Type',
          type: 'item',
          url: '/docs/assetType'
        },
        {
          id: 'assetCategory',
          title: 'Asset Category',
          type: 'item',
          url: '/docs/assetCategory'
        },
        {
          id: 'createAsset',
          title: 'Create Asset',
          type: 'item',
          url: '/docs/createAsset'
        },
        {
          id: 'createKit',
          title: 'Create Kit',
          type: 'item',
          url: '/docs/createKit'
        },
        {
          id: 'materialIssueManifest',
          title: 'Material Issue Manifest',
          type: 'item',
          url: '/docs/materialIssueManifest'
        },
        {
          id: 'retrievalIssueManifest',
          title: 'Retrieval Issue Manifest',
          type: 'item',
          url: '/docs/RetrievalIssueManifest'
        },
        {
          id: 'purchaseOrder',
          title: 'Purchase Order',
          type: 'item',
          url: '/docs/purchaseOrder'
        },
        {
          id: 'quotation',
          title: 'Quotation',
          type: 'item',
          url: '/docs/Quotation'
        }
      ]
    }
  ]
};

export default docs;
