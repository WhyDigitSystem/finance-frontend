// assets
import { IconFiles } from '@tabler/icons-react';

// constants
const icons = {
  IconFiles
};

// Safe access from localStorage
const screenAccess = JSON.parse(localStorage.getItem('screenAccess') || '{}');

const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// Children with access control
const docsChildren = [
  {
    id: 'stockBranch',
    title: 'Stock Branch',
    type: 'item',
    url: '/docs/stockBranch',
    visible: hasScreenAccess('STB')
  },
  {
    id: 'warehouse',
    title: 'Warehouse',
    type: 'item',
    url: '/docs/warehouse',
    visible: hasScreenAccess('WARH')
  },
  {
    id: 'assetType',
    title: 'Asset Type',
    type: 'item',
    url: '/docs/assetType',
    visible: hasScreenAccess('ASSTP')
  },
  {
    id: 'assetCategory',
    title: 'Asset Category',
    type: 'item',
    url: '/docs/assetCategory',
    visible: hasScreenAccess('ASSCAT')
  },
  {
    id: 'createAsset',
    title: 'Create Asset',
    type: 'item',
    url: '/docs/createAsset',
    visible: hasScreenAccess('CA')
  },
  {
    id: 'createKit',
    title: 'Create Kit',
    type: 'item',
    url: '/docs/createKit',
    visible: hasScreenAccess('CK')
  },
  {
    id: 'materialIssueManifest',
    title: 'Material Issue Manifest',
    type: 'item',
    url: '/docs/materialIssueManifest',
    visible: hasScreenAccess('MIM')
  },
  {
    id: 'retrievalIssueManifest',
    title: 'Retrieval Manifest',
    type: 'item',
    url: '/docs/RetrievalIssueManifest',
    visible: hasScreenAccess('RIM')
  },
  {
    id: 'purchaseOrder',
    title: 'Purchase Order',
    type: 'item',
    url: '/docs/purchaseOrder',
    visible: hasScreenAccess('PO')
  },
  {
    id: 'quotation',
    title: 'Quotation',
    type: 'item',
    url: '/docs/Quotation',
    visible: hasScreenAccess('QT')
  },
  {
    id: 'mimrimRegister',
    title: 'Material Register',
    type: 'item',
    url: '/docs/MimRimRegister',
    visible: hasScreenAccess('MATREG')
  },
  {
    id: 'allotment',
    title: 'Allotment',
    type: 'item',
    url: '/docs/allotment',
    visible: hasScreenAccess('AL')
  },
].filter((item) => item.visible !== false);

// Return null if no children allowed
const docs =
  docsChildren.length > 0
    ? {
        id: 'docs',
        type: 'group',
        children: [
          {
            id: 'ar',
            title: 'Docs',
            type: 'collapse',
            icon: icons.IconFiles,
            children: docsChildren
          }
        ]
      }
    : null;

export default docs;
