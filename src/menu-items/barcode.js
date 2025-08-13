// assets
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import QrCodeOutlinedIcon from '@mui/icons-material/QrCodeOutlined';
// constant
const icons = {
  IconQrCodeScannerOutlined: QrCodeScannerOutlinedIcon,
  IconQrCode2Outlined: QrCode2OutlinedIcon,
  IconQrCodeOutlined: QrCodeOutlinedIcon
};

// Safe screen access
const screenAccess = JSON.parse(localStorage.getItem('screenAccess') || '{}');

const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// Define children with access check
const BarcodeChildren = [
  {
    id: 'barcodesingle',
    title: 'QR Bar Single',
    type: 'item',
    url: '/finance/BarCode/QRbarsingle',
    icon: icons.IconQrCode2Outlined,
    visible: hasScreenAccess('BC')
  },
  {
    id: 'QRbargroup',
    title: 'QR Bar Group',
    type: 'item',
    url: '/finance/BarCode/QRbargroup',
    icon: icons.IconQrCodeOutlined,
    visible: hasScreenAccess('BG')
  }
].filter((item) => item.visible !== false);

// Only show if at least one child is visible
const barcode =
  BarcodeChildren.length > 0
    ? {
        id: 'barcode',
        type: 'group',
        children: [
          {
            id: 'barcode',
            title: 'Barcode',
            type: 'collapse',
            icon: icons.IconQrCodeScannerOutlined,
            children: BarcodeChildren
          }
        ]
      }
    : null;

export default barcode;
