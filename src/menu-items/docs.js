// assets
import {
  IconCashBanknote,
  IconDatabaseStar,
  IconKey,
  IconWorldPin,
  IconUserPlus,
  IconBuildingFactory2,
  IconIdBadge2,
  IconMapQuestion
} from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

const icons1 = {
  IconWorldPin
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
      icon: icons.IconKey,

      children: [
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
        // {
        //   id: 'invoice',
        //   title: 'Invoice',
        //   type: 'item',
        //   url: '/docs/Invoice'
        // },
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
