// // assets
// import HomeRepairServiceOutlinedIcon from '@mui/icons-material/HomeRepairServiceOutlined';
// import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
// import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
// // constant
// const icons = {
//   IconHomeRepairService: HomeRepairServiceOutlinedIcon,
//   IconMarkEmailReadOutlined: MarkEmailReadOutlinedIcon,
//   IconDocumentScannerOutlined: DocumentScannerOutlinedIcon
// };

// // Safe screen access
// const screenAccess = JSON.parse(localStorage.getItem('screenAccess') || '{}');

// const hasScreenAccess = (screenId) => {
//   const access = screenAccess?.[screenId];
//   return access?.canRead || access?.canWrite || access?.canDelete;
// };

// // Define children with access check
// const ToolsChildren = [
//   {
//     id: 'sendemail',
//     title: 'Send Email',
//     type: 'item',
//     url: '/finance/Tools/Sendemail',
//     icon: icons.IconMarkEmailReadOutlined,
//     visible: hasScreenAccess('SE')
//   },
//   {
//     id: 'ocr',
//     title: 'OCR',
//     type: 'item',
//     url: '/finance/Tools/OCR',
//     icon: icons.IconDocumentScannerOutlined,
//     visible: hasScreenAccess('OCR')
//   }
// ].filter((item) => item.visible !== false);

// // Only show if at least one child is visible
// const Tools =
//   ToolsChildren.length > 0
//     ? {
//         id: 'tools',
//         type: 'group',
//         children: [
//           {
//             id: 'tools',
//             title: 'Tools',
//             type: 'collapse',
//             icon: icons.IconHomeRepairService,
//             children: ToolsChildren
//           }
//         ]
//       }
//     : null;

// export default Tools;
