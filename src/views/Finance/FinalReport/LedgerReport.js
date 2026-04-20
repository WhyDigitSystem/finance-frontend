import React from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Autocomplete,
  TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import ActionButton from 'utils/ActionButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { showToast } from 'utils/toast-component';
// import CommonReportTable from 'utils/CommonReportTable';
import CMRT2 from 'utils/CMRT2';
import CloseIcon from '@mui/icons-material/Close';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function LedgerReport() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [isLoading, setIsLoading] = useState(false);
  const [accountNameList, setAccountNameList] = useState([]);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logo, setLogo] = useState(null);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [userName] = useState(localStorage.getItem('userName'));
  const [selectedSections, setSelectedSections] = useState({
    accountName: false,
    branch: false
  });
  const [headerFields, setHeaderFields] = useState([]);
  const [companyName, setCompanyName] = useState('');

  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    accountName: 'All',
    branch: 'All',
    withDetails: 'YES'
  });

  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    accountName: '',
    branch: ''
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const [listViewData, setListViewData] = useState([]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setLogo(file);
    } else {
      showToast('error', 'Please upload a valid image (PNG or JPEG).');
    }
  };

  const handleClear = () => {
    setListView(false);
    setFormData({
      fromDate: null,
      toDate: null,
      accountName: 'All',
      branch: 'All',
      withDetails: 'YES'
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      accountName: '',
      branch: ''
    });
    setRowData([]);
    setHeaderFields([]);
  };

  useEffect(() => {
    getAllBranches();
    getAccountName();
    getCompanyDetails();
  }, []);

  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        const particularCompany = response.paramObjectsMap.companyVO[0];
        setListViewData(response.paramObjectsMap.companyVO.reverse());
        setCompanyName(particularCompany.companyName || '');

        // Handle blob image if it comes as a blob URL
        // if (particularCompany.companyLogo && typeof particularCompany.companyLogo === 'string') {
        //   if (particularCompany.companyLogo.startsWith('blob:')) {
        //     // Fetch the blob and convert to base64
        //     try {
        //       const blobResponse = await fetch(particularCompany.companyLogo);
        //       const blob = await blobResponse.blob();
        //       const base64Image = await new Promise((resolve) => {
        //         const reader = new FileReader();
        //         reader.onloadend = () => resolve(reader.result);
        //         reader.readAsDataURL(blob);
        //       });

        //       // Extract image type and data
        //       const matches = base64Image.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/);
        //       if (matches) {
        //         const extension = matches[2];
        //         const base64Data = matches[3];
        //         const byteArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

        //         setCompanyLogo({
        //           buffer: byteArray,
        //           extension,
        //           base64: base64Image // Store base64 for potential other uses
        //         });
        //       }
        //     } catch (error) {
        //       console.error('Error processing blob image:', error);
        //     }
        //   } else if (particularCompany.companyLogo.startsWith('data:image')) {
        //     // Handle base64 image directly
        //     const [meta, base64Data] = particularCompany.companyLogo.split(',');
        //     const extension = meta.includes('jpeg') ? 'jpeg' : 'png';

        //     const byteArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        //     setCompanyLogo({
        //       buffer: byteArray,
        //       extension,
        //       base64: particularCompany.companyLogo
        //     });
        //   }
        // }

        setFormData({
          ...formData,
          companyCode: particularCompany.companyCode,
          companyName: particularCompany.companyName
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchCodeList(branchData);
    } catch (error) {
      console.error('Error fetching branch data:', error);
      showToast('error', 'Failed to load branches');
    }
  };

  const getAccountName = async () => {
    try {
      const response = await apiCalls('get', `/master/getAllGroupLedgerByOrgId?orgId=${orgId}`);
      if (response.status === true && response.paramObjectsMap?.groupLedgerVO) {
        setAccountNameList(response.paramObjectsMap.groupLedgerVO);
      }
    } catch (error) {
      console.error('Error fetching account names:', error);
      showToast('error', 'Failed to load account names');
    }
  };

  const handleSelectAccountChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      accountName: value
    }));
  };

  const handleWithDetailsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      withDetails: e.target.value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
    setFieldErrors((prev) => ({
      ...prev,
      [field]: ''
    }));
  };

  const reportColumns = [
    {
      accessorKey: 'Vid',
      header: 'Doc No',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'center', padding: '8px' }}>{cell.getValue() || '-'}</div>,
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'Vdate',
      header: 'Doc Date',
      size: 110,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return <div style={{ textAlign: 'center', padding: '8px' }}>{value ? dayjs(value).format('DD-MM-YYYY') : '-'}</div>;
      },
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'Particulars',
      header: 'Particulars',
      size: 250,
      Cell: ({ cell }) => (
        <div
          style={{
            textAlign: 'left',
            padding: '8px 10px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'left',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    // {
    //   accessorKey: 'particulars',
    //   header: 'Particulars',
    //   size: 250,
    //   Cell: ({ cell }) => <div style={{ textAlign: 'left', paddingLeft: '10px', padding: '8px' }}>{cell.getValue() || '-'}</div>,
    //   muiTableHeadCellProps: {
    //     align: 'left',
    //     sx: {
    //       backgroundColor: '#34449B',
    //       color: 'white',
    //       fontWeight: 'bold',
    //       fontSize: '0.875rem',
    //       padding: '12px 8px'
    //     }
    //   }
    // },
    {
      accessorKey: 'dbAmount',
      header: 'Debit',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', color: '#d32f2f', fontWeight: '500', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'CrAmount',
      header: 'Credit',
      size: 100,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', color: '#2e7d32', fontWeight: '500', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'Currency',
      header: 'Currency',
      size: 90,
      Cell: ({ cell }) => <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>{cell.getValue() || '-'}</div>,
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'ndAmount',
      header: 'Debit(Base)',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'NcAmount',
      header: 'Credit(Base)',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'Narration',
      header: 'Narration',
      size: 100,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', paddingLeft: '10px', padding: '8px' }}>{cell.getValue() || ''}</div>,
      muiTableHeadCellProps: {
        align: 'left',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    }
  ];

  const handleGo = async () => {
    const errors = {};

    if (!formData.fromDate) {
      errors.fromDate = 'From Date is required';
      // showToast('error', errors.fromDate);
    }
    if (!formData.toDate) {
      errors.toDate = 'To Date is required';
      // showToast('error', errors.toDate);
    }
    if (formData.fromDate && formData.toDate) {
      const fromDate = dayjs(formData.fromDate);
      const toDate = dayjs(formData.toDate);
      if (toDate.isBefore(fromDate)) {
        errors.toDate = 'To Date cannot be before From Date';
        showToast('error', errors.toDate);
      }
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        // Prepare parameters for API
        const params = {
          accountName: formData.accountName === 'All' ? 'All' : formData.accountName,
          branch: formData.branch === 'All' ? 'All' : formData.branch,
          details: formData.withDetails,
          finYear: finYear,
          fromdate: formData.fromDate,
          orgId: orgId,
          toDate: formData.toDate
        };

        // Build query string
        const queryString = Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join('&');

        const response = await apiCalls('get', `/master/getLedgerReport?${queryString}`);

        if (response.status === true) {
          const reportData = response.paramObjectsMap?.ledgerReport || [];

          // Map API fields to table columns
          const mappedData = reportData.map((item) => ({
            Vid: item.voucherNumber || '',
            Vdate: item.voucherDate || '',
            Particulars: item.particulars || '',
            ndAmount: parseFloat(item.ndbAmnt) || 0,
            NcAmount: parseFloat(item.ncrAmnt) || 0,
            Currency: item.currency || '',
            dbAmount: parseFloat(item.dbAmnt) || 0,
            CrAmount: parseFloat(item.crAmnt) || 0,
            Narration: item.narration || ''
          }));

          // Set header fields dynamically
          const generatedBy = localStorage.getItem('userName') || 'Admin';
          const headers = [
            {
              label: 'Range',
              value:
                formData.fromDate && formData.toDate
                  ? `${dayjs(formData.fromDate).format('DD-MM-YYYY')} to ${dayjs(formData.toDate).format('DD-MM-YYYY')}`
                  : ''
            },
            {
              label: 'Account Name',
              value: formData.accountName !== 'All' ? formData.accountName : 'All'
            },
            {
              label: 'Branch',
              value: formData.branch !== 'All' ? formData.branch : 'All'
            },
            {
              label: 'With Details',
              value: formData.withDetails
            }
          ];

          setHeaderFields(headers);
          setRowData(mappedData);
          setListView(true);
          setOpenModal(true);
        } else {
          const errorMsg = response.paramObjectsMap?.errorMessage || 'Failed to fetch report data';
          showToast('error', errorMsg);
        }
      } catch (error) {
        console.error('API Error:', error);
        showToast('error', 'Failed to fetch report data');
      } finally {
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Excel
  const handleDownloadExcel = async ({ logo }) => {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = companyName || 'Ledger Report';
      workbook.created = new Date();

      const sheet = workbook.addWorksheet('Ledger Report');
      sheet.state = 'visible';

      // ====== COMPANY LOGO (top left A1:B5) ======
      sheet.mergeCells('A1:B5');
      if (logo) {
        try {
          const base64Data = logo.split(',')[1] || logo;
          if (base64Data.length >= 100) {
            const extension = logo.includes('jpeg') ? 'jpeg' : 'png';
            const imageId = workbook.addImage({ base64: base64Data, extension });
            sheet.addImage(imageId, {
              tl: { col: 0, row: 0 },
              ext: { width: 120, height: 80 }
            });
          }
        } catch (err) {
          console.error('Error adding logo:', err);
        }
      }

      // ====== TITLE (C1 to I1) ======
      sheet.mergeCells('C1:I1');
      const titleCell = sheet.getCell('C1');
      titleCell.value = 'LEDGER REPORT';
      titleCell.font = { size: 18, bold: true, color: { argb: 'FF34449B' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

      // ====== METADATA in 3 columns (C2:D5, E2:F5, G2:H5) ======
      const metadata = [
        { label: 'From Date', value: formData.fromDate ? dayjs(formData.fromDate).format('DD-MM-YYYY') : 'N/A' },
        { label: 'To Date', value: formData.toDate ? dayjs(formData.toDate).format('DD-MM-YYYY') : 'N/A' },
        { label: 'Account Name', value: formData.accountName !== 'All' ? formData.accountName : 'All' },
        { label: 'Branch', value: formData.branch !== 'All' ? formData.branch : 'All' },
        { label: 'With Details', value: formData.withDetails },
        { label: 'Generated By', value: localStorage.getItem('userName') || 'System' },
        { label: 'Generated On', value: dayjs().format('DD-MM-YYYY HH:mm') }
      ];

      metadata.forEach((meta, index) => {
        const rowIndex = (index % 4) + 2; // Rows 2,3,4,5
        const colGroup = Math.floor(index / 4); // 0 (C-D), 1 (E-F), 2 (G-H)

        const colStart = 4 + colGroup * 2; // C=3, E=5, G=7
        const row = sheet.getRow(rowIndex);

        row.getCell(colStart).value = meta.label;
        row.getCell(colStart).font = { bold: true };
        row.getCell(colStart + 1).value = meta.value;
      });

      // ====== TABLE HEADER (Row 7) ======
      const headerRowIndex = 7;
      const headerRow = sheet.getRow(headerRowIndex);
      reportColumns.forEach((col, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = col.header;
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF34449B' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      });
      headerRow.height = 20;

      // ====== TABLE DATA (From Row 8) ======
      rowData.forEach((item) => {
        const row = sheet.addRow([
          item.Vid || '',
          item.Vdate ? dayjs(item.Vdate).format('DD-MM-YYYY') : '-',
          item.Particulars || '-',
          item.ndAmount,
          item.NcAmount,
          item.Currency || '',
          item.dbAmount,
          item.CrAmount,
          item.Narration || ''
        ]);

        // Format numeric columns
        [4, 5, 7, 8].forEach((colIndex) => {
          const cell = row.getCell(colIndex);
          if (typeof cell.value === 'number') {
            cell.numFmt = '#,##0.00';
            cell.alignment = { horizontal: 'right' };
          }
        });
        const debitCell = row.getCell(7);
        if (typeof debitCell.value === 'number') {
          debitCell.font = { color: { argb: 'FFFF0000' } }; // Red
        }

        const creditCell = row.getCell(8);
        if (typeof creditCell.value === 'number') {
          creditCell.font = { color: { argb: 'FF00AA00' } }; // Green
        }
        // Add borders
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
        });
      });

      // ====== COLUMN WIDTHS ======
      sheet.columns = [
        { width: 15 }, // Vid
        { width: 15 }, // Vdate
        { width: 40 }, // PartyName
        { width: 15 }, // ndAmount
        { width: 15 }, // NcAmount
        { width: 12 }, // Currency
        { width: 15 }, // dbAmount
        { width: 15 }, // CrAmount
        { width: 40 } // Narration
      ];

      // ====== DOWNLOAD ======
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      saveAs(blob, `Ledger_Report_${companyName || ''}_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      showToast('error', 'Failed to generate Excel file');
    }
  };

  // Common table options
  const tableOptions = {
    muiTablePaperProps: {
      sx: {
        border: '1px solid #e0e0e0',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
      }
    },
    muiTableContainerProps: {
      sx: { maxHeight: '70vh' }
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 ? '#f9f9f9' : '#ffffff',
        '&:hover': { backgroundColor: '#f0f7ff' }
      }
    }),
    enableStickyHeader: true,
    muiTableProps: {
      sx: {
        borderCollapse: 'collapse',
        '& .MuiTableCell-root': {
          border: '1px solid #e0e0e0 !important'
        }
      }
    }
  };

  // pdf download
  const handleDownloadPdf = ({ logo, columns, data, fileName = 'Ledger Report', userName, formData }) => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // 1) COMPANY LOGO (top-left)
    const logoBase64 = logo;
    const logoWidth = 30;
    const logoHeight = 23;
    const logoX = 10;
    const logoY = 10;
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
    }

    // 2) TITLE BOX
    const title = `${fileName}`;
    const textW = doc.getTextWidth(title);
    const padX = 10,
      boxH = 10,
      yTitle = 25;
    const boxW = textW + padX * 2,
      boxX = (pageW - boxW) / 2;
    doc
      .setFillColor('#e7ebeb')
      .roundedRect(boxX, yTitle - boxH + 3, boxW, boxH, 4, 4, 'F')
      .setTextColor('#34449B')
      .setFontSize(12)
      .text(title, pageW / 2, yTitle, { align: 'center' });

    // 3) FOOTER (Generated On / By)
    doc.setFontSize(8).setTextColor('#555555');
    doc.text(`Generated On: ${dayjs().format('DD-MM-YYYY hh:mm A')}`, pageW - 15, pageH - 10, { align: 'right' });
    doc.text(`Generated By: ${userName}`, 15, pageH - 10, { align: 'left' });

    // 4) FILTER METADATA
    const { fromDate, toDate, accountName, branch, withDetails } = formData;

    doc.setFontSize(9);
    doc.setTextColor('#000000');
    doc.setFillColor(231, 235, 235);
    doc.roundedRect(2, 35, 206, 12, 2, 2, 'F');

    // Row 1: Labels (bold)
    doc.setFont(undefined, 'bold');
    doc.text('From Date', 8, 40);
    doc.text('To Date', 32, 40);
    doc.text('Account Name', 54, 40);
    doc.text('Branch', 153, 40);
    doc.text('WithDetails', 184, 40);

    // Row 2: Values (normal)
    doc.setFont(undefined, 'normal');
    doc.text(dayjs(fromDate).format('DD-MM-YYYY'), 8, 45);
    doc.text(dayjs(toDate).format('DD-MM-YYYY'), 32, 45);
    doc.text(accountName, 54, 45);
    doc.text(branch, 153, 45);
    doc.text(withDetails, 184, 45);

    // 5) TABLE
    const headerLabels = columns.map((c) => c.header);
    const numericFields = columns.map((c) => c.accessorKey).filter((k) => k && /(amount|debit|credit|balance)/i.test(k));

    const body = data.map((row) =>
      columns.map((col) => {
        const key = col.accessorKey;
        const raw = key ? row[key] : '';
        if (key?.toLowerCase().includes('date')) {
          const d = dayjs(raw);
          return d.isValid() ? d.format('DD-MM-YYYY') : '-';
        }
        if (typeof raw === 'number') {
          return raw === 0 ? '' : raw.toLocaleString('en-IN');
        }
        return raw ?? '';
      })
    );

    autoTable(doc, {
      startY: 50, // replace Fifty with a number like 60
      head: [headerLabels],
      body,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [220, 220, 220]
      },
      headStyles: {
        fillColor: [52, 68, 155],
        textColor: 255,
        halign: 'center'
      },
      bodyStyles: {
        halign: 'left'
      },
      didParseCell: (cellHookData) => {
        const { cell, column, section } = cellHookData;
        if (section === 'body') {
          // get the accessorKey for this column
          const key = columns[column.index].accessorKey;

          if (key === 'dbAmount') {
            // set debit cells to red
            cell.styles.textColor = [255, 0, 0];
          } else if (key === 'CrAmount') {
            // set credit cells to green
            cell.styles.textColor = [0, 128, 0];
          }

          // existing right-align logic
          if (numericFields.includes(key)) {
            cell.styles.halign = 'right';
          }
        }
      }
    });

    // 6) SAVE
    doc.save(`${fileName}_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`);
  };

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
      <div className="row">
        <div className="row">
          <div className="col-md-3 mb-3">
            <FormControlLabel
              control={
                <Checkbox checked={selectedSections.accountName} onChange={handleCheckboxChange} name="accountName" color="secondary" />
              }
              label="Account Name"
            />
          </div>
          <div className="col-md-3 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.branch} onChange={handleCheckboxChange} name="branch" color="secondary" />}
              label="Branch Code"
            />
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <FormControl fullWidth variant="filled" size="small">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={formData.fromDate ? dayjs(formData.fromDate, 'YYYY-MM-DD') : null}
                onChange={(date) => handleDateChange('fromDate', date)}
                slotProps={{
                  textField: {
                    size: 'small',
                    error: !!fieldErrors.fromDate,
                    helperText: fieldErrors.fromDate
                  }
                }}
                format="DD-MM-YYYY"
              />
            </LocalizationProvider>
          </FormControl>
        </div>

        <div className="col-md-3 mb-3">
          <FormControl fullWidth variant="filled" size="small">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="To Date"
                value={formData.toDate ? dayjs(formData.toDate, 'YYYY-MM-DD') : null}
                onChange={(date) => handleDateChange('toDate', date)}
                slotProps={{
                  textField: {
                    size: 'small',
                    error: !!fieldErrors.toDate,
                    helperText: fieldErrors.toDate
                  }
                }}
                format="DD-MM-YYYY"
              />
            </LocalizationProvider>
          </FormControl>
        </div>

        <div className="col-md-3 mb-3">
          <FormControl size="small" variant="outlined" fullWidth>
            <InputLabel id="withDetails-label">With Details</InputLabel>
            <Select
              labelId="withDetails-label"
              label="With Details"
              value={formData.withDetails}
              onChange={handleWithDetailsChange}
              name="withDetails"
            >
              <MenuItem value="YES">Yes</MenuItem>
              <MenuItem value="NO">No</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* {selectedSections.accountName && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel id="accountName-label">Account Name</InputLabel>
              <Select
                labelId="accountName-label"
                label="Account Name"
                value={formData.accountName}
                onChange={handleSelectAccountChange}
                name="accountName"
              >
                <MenuItem value="All">All</MenuItem>
                {accountNameList.map((account) => (
                  <MenuItem key={account.id} value={account.accountGroupName}>
                    {account.accountGroupName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )} */}
        {selectedSections.accountName && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" fullWidth>
              <Autocomplete
                size="small"
                options={[{ accountGroupName: 'All' }, ...accountNameList]}
                getOptionLabel={(option) => option?.accountGroupName || ''}
                value={
                  accountNameList.find((acc) => acc.accountGroupName === formData.accountName) ||
                  (formData.accountName === 'All' ? { accountGroupName: 'All' } : null)
                }
                onChange={(event, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    accountName: newValue ? newValue.accountGroupName : ''
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Account Name" name="accountName" variant="outlined" />}
                isOptionEqualToValue={(option, value) => option.accountGroupName === value.accountGroupName}
              />
            </FormControl>
          </div>
        )}

        {selectedSections.branch && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel id="branch-label">Branch</InputLabel>
              <Select labelId="branch-label" label="Branch" value={formData.branch} onChange={handleInputChange} name="branch">
                <MenuItem value="All">All</MenuItem>
                {branchCodeList.map((branch) => (
                  <MenuItem key={branch.id} value={branch.branch}>
                    {branch.branch}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        <div className="col-md-3">
          <div className="d-flex flex-wrap justify-content-start mt-1">
            <ActionButton title="Search" icon={SearchIcon} onClick={handleGo} isLoading={isLoading} disabled={isLoading} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          </div>
        </div>
      </div>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xl"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 0,
            px: 3,
            backgroundColor: '#34449B',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Ledger Report</span>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              color: 'white'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <CMRT2
            data={rowData}
            columns={reportColumns}
            fileName={'Ledger Report'}
            tableOptions={tableOptions}
            handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
            handleDownloadPdf={() =>
              handleDownloadPdf({
                logo: listViewData[0]?.companyLogo,
                columns: reportColumns,
                data: rowData,
                formData,
                fileName: 'Ledger Report',
                userName
              })
            }
            headerFields={headerFields}
          />
        </DialogContent>
      </Dialog>

      {listView && (
        <div className="mt-4">
          <CMRT2
            data={rowData}
            columns={reportColumns}
            fileName={'Ledger Report'}
            isListView={true}
            handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
            handleDownloadPdf={() =>
              handleDownloadPdf({
                logo: listViewData[0]?.companyLogo,
                columns: reportColumns,
                data: rowData,
                fileName: 'Ledger Report',
                userName,
                formData
              })
            }
            tableOptions={{
              ...tableOptions,
              muiTableContainerProps: { sx: { maxHeight: '60vh' } }
            }}
            headerFields={headerFields}
          />
        </div>
      )}
    </div>
  );
}

export default LedgerReport;
