// assets
import HomeRepairServiceOutlinedIcon from '@mui/icons-material/HomeRepairServiceOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
// constant
const icons = {
  IconHomeRepairService: HomeRepairServiceOutlinedIcon,
  IconMarkEmailReadOutlined: MarkEmailReadOutlinedIcon
};

// Safe screen access
const screenAccess = JSON.parse(localStorage.getItem('screenAccess') || '{}');

const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// Define children with access check
const InvoicesChildren = [
  {
    id: 'invoice',
    title: 'Invoice',
    type: 'item',
    url: '/finance/Invoice/Invoice',
    icon: icons.IconMarkEmailReadOutlined,
    visible: hasScreenAccess('IV')
  },
  {
    id: 'invoicepdf',
    title: 'Invoice PDF',
    type: 'item',
    url: '/finance/Invoice/InvoicePDF',
    icon: icons.IconMarkEmailReadOutlined,
    visible: hasScreenAccess('IVPDF')
  }
].filter((item) => item.visible !== false);

// Only show if at least one child is visible
const Invoices =
  InvoicesChildren.length > 0
    ? {
        id: 'invoices',
        type: 'group',
        children: [
          {
            id: 'invoices',
            title: 'Invoice',
            type: 'collapse',
            icon: icons.IconHomeRepairService,
            children: InvoicesChildren
          }
        ]
      }
    : null;

export default Invoices;
