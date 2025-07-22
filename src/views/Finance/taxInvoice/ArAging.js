import React, { useState, useEffect } from 'react';
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
  Tooltip
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import CommonReportTable from 'utils/CommonReportTable';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import CloseIcon from '@mui/icons-material/Close';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CircularProgress from '@mui/material/CircularProgress';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ArAging = () => {
  const [userName] = useState(localStorage.getItem('userName'));
  const [listViewData, setListViewData] = useState([]);
  const [orgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [partyNameList, setPartyNameList] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [rowData, setRowData] = useState([]);
  const [branchNameList, setBranchNameList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [headerFields, setHeaderFields] = useState([]);
  const [formData, setFormData] = useState({
    partyName: 'All',
    date: dayjs().format('YYYY-MM-DD'),
    branchCode: 'All',
    base: ''
  });

  const [selectedSections, setSelectedSections] = useState({
    partyName: false,
    date: true,
    branchCode: false,
    base: false
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSelectedSections((prev) => ({ ...prev, [name]: checked }));

    if (name === 'date' && checked) {
      const today = dayjs().format('YYYY-MM-DD');
      setFormData((prev) => ({ ...prev, date: today }));
      setFieldErrors((prev) => ({ ...prev, date: '' }));
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
    setFormData((prev) => ({ ...prev, [field]: formattedDate }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const allClearData = () => {
    setFormData({
      partyName: 'All',
      date: dayjs().format('YYYY-MM-DD'),
      branchCode: 'All',
      base: ''
    });
    setSelectedSections({
      partyName: false,
      date: true,
      branchCode: false,
      base: false
    });
    setFieldErrors({});
    setListView(false);
    setRowData([]);
    setOpenModal(false);
  };

  useEffect(() => {
    getPartyName();
    getAllBranches();
    getCompanyDetails();
  }, []);

  const getPartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=customer`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO || []);
    } catch (error) {
      console.error('Error fetching party names:', error);
    }
  };

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchNameList(branchData);
    } catch (error) {
      console.error('Error fetching branch data:', error);
      showToast('error', 'Failed to load branches');
    }
  };

  const handleSelectPartyName = (e) => {
    const value = e.target.value;
    if (value === 'All') {
      setFormData((prev) => ({ ...prev, partyName: 'All' }));
    } else {
      const selected = partyNameList.find((item) => item.partyName === value);
      if (selected) {
        setFormData((prev) => ({ ...prev, partyName: selected.partyName }));
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    if (selectedSections.date && !formData.date) {
      setFieldErrors((prev) => ({
        ...prev,
        date: 'Date is required'
      }));
      return;
    }

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        asOnDate: formData.date,
        base: formData.base,
        branch: formData.branchCode,
        orgId,
        partyName: formData.partyName
      });

      if (selectedSections.branchCode && formData.branchCode !== 'All') {
        queryParams.append('branchCode', formData.branchCode);
      }

      const response = await apiCalls('get', `/reportController/getARAgeingReport?${queryParams.toString()}`);

      if (response.status === true) {
        setRowData(response.paramObjectsMap.rimReportFillGrid || []);

        // Set header fields for AP Ageing report
        setHeaderFields([
          {
            label: 'As on Date',
            value: formData.date ? dayjs(formData.date).format('DD-MM-YYYY') : ''
          },
          {
            label: 'Party Name',
            value: formData.partyName
          },
          {
            label: 'Branch Name',
            value: formData.branchCode
          }
        ]);

        setListView(true);
        setOpenModal(true);
      } else {
        showToast('error', response.paramObjectsMap.getAPAgeing?.errorMessage || 'Report Fetch failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Report Fetch failed');
    } finally {
      setIsLoading(false);
    }
  };

  const reportColumns = [
    // {
    //   accessorKey: 'subledgerName',
    //   header: 'Party Name',
    //   size: 110,
    //   Cell: ({ cell }) => <div style={{ textAlign: 'center', padding: '8px' }}>{cell.getValue() || ''}</div>,
    //   muiTableHeadCellProps: {
    //     align: 'center',
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
      accessorKey: 'subledgerName',
      header: 'Party Name',
      size: 110,
      Cell: ({ cell, row, table }) => {
        const currentValue = cell.getValue();
        const rowIndex = row.index;

        const allRows = table.getSortedRowModel().rows;

        const isFirstOccurrence = rowIndex === 0 || allRows[rowIndex - 1]?.original?.subledgerName !== currentValue;

        return <div style={{ textAlign: 'center', padding: '8px' }}>{isFirstOccurrence ? currentValue : ''}</div>;
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
      accessorKey: 'docId',
      header: 'Doc No',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'center', padding: '8px' }}>{cell.getValue() || ''}</div>,
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
      accessorKey: 'docDate',
      header: 'Doc Date',
      size: 110,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return <div style={{ textAlign: 'center', paddingRight: '8px' }}>{value ? dayjs(value).format('DD-MM-YYYY') : ''}</div>;
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
      accessorKey: 'dueDate',
      header: 'Due Date',
      size: 110,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return <div style={{ textAlign: 'center', padding: '8px' }}>{value ? dayjs(value).format('DD-MM-YYYY') : ''}</div>;
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
      accessorKey: 'amount',
      header: 'Inv Amt',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : ''}
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
      accessorKey: 'outstanding',
      header: 'Outstanding',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : ''}
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
      accessorKey: 'totalDue',
      header: 'Total Due',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : ''}
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
      accessorKey: 'mSlab1',
      header: 'Below 30 Days',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : ''}
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
      accessorKey: 'mSlab2',
      header: 'Days 31-60',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : ''}
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
      accessorKey: 'mSlab3',
      header: 'Days 61-90',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : ''}
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
      accessorKey: 'mSlab4',
      header: 'Days 91-120',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : ''}
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
      accessorKey: 'mSlab5',
      header: 'Days 120+',
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
    }
  ];

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

  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      console.log('API Response:', response);
      setListViewData(response.paramObjectsMap.companyVO.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDownloadExcel = async ({ logo }) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('AR Ageing Report');
    // ====== LOGO SECTION ======
    sheet.mergeCells('A1:B6');
    if (logo) {
      try {
        const base64Data = logo.split(',')[1] || logo;
        if (base64Data.length >= 100) {
          const extension = logo.includes('jpeg') ? 'jpeg' : 'png';
          const imageId = workbook.addImage({
            base64: base64Data,
            extension,
            type: 'image' // Ensure image type is specified
          });
          sheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 120, height: 80 }
          });
        }
      } catch (err) {
        console.error('Error adding logo:', err);
      }
    }

    // Report Title
    sheet.mergeCells('C1:H2');
    const titleCell = sheet.getCell('C1');
    titleCell.value = 'AR_Ageing_Report';
    titleCell.font = { size: 18, bold: true, color: { argb: 'FF34449B' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Header Info
    const headerInfo = [
      ...headerFields,
      { label: 'Generated By', value: localStorage.getItem('userName') || 'Admin' },
      { label: 'Generated On', value: dayjs().format('DD-MM-YYYY HH:mm') }
    ];

    for (let i = 0; i < headerInfo.length; i += 2) {
      const rowIndex = i / 2 + 3;
      const row = sheet.getRow(rowIndex);
      row.getCell(3).value = headerInfo[i].label + ':';
      row.getCell(3).font = { bold: true };
      row.getCell(4).value = headerInfo[i].value;
      if (headerInfo[i + 1]) {
        row.getCell(6).value = headerInfo[i + 1].label + ':';
        row.getCell(6).font = { bold: true };
        row.getCell(7).value = headerInfo[i + 1].value;
      }
    }

    // Header Row

    const headers = [
      'Party Name',
      'Invoice No',
      'Invoice Date',
      'Due Date',
      'Inv Amt',
      'Outstanding',
      'Total Due',
      'Unadjusted',
      'Below 30 Days',
      'Days 31-60',
      'Days 61-90',
      'Days 91-120',
      'Days 120+'
    ];
    const headerRow = sheet.addRow(headers);
    headerRow.height = 20;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF34449B' } };

      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Data Rows
    let previousPartyName = '';
    rowData.forEach((item) => {
      const partyName = item.subledgerName === previousPartyName ? '' : item.subledgerName;
      previousPartyName = item.subledgerName;
      const row = sheet.addRow([
        partyName,
        item.docId || '-',
        item.docDate ? dayjs(item.docDate).format('DD-MM-YYYY') : '',
        item.dueDate ? dayjs(item.dueDate).format('DD-MM-YYYY') : '-',
        item.amount ?? 0,
        item.outstanding ?? 0,
        item.totalDue ?? 0,
        item.unadjusted ?? 0,
        item.mSlab1 ?? 0,
        item.mSlab2 ?? 0,
        item.mSlab3 ?? 0,
        item.mSlab4 ?? 0,
        item.mSlab5 ?? 0
      ]);

      for (let col = 5; col <= 13; col++) {
        const cell = row.getCell(col);
        cell.numFmt = '#,##,##0.00';
        cell.alignment = { horizontal: 'right' };
      }

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    sheet.columns = [
      { width: 70 },
      { width: 30 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 }
    ];

    // Column Widths
    // sheet.columns = Array(12).fill({ width: 15 });
    // sheet.getColumn(1).width = 20;

    // Export
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `AR_Ageing_Report_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
  };

  // pdf downloaded
  const handleDownloadPdf = ({ logo, columns, data, fileName, userName, formData }) => {
    const doc = new jsPDF({ orientation: 'landscape' });
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

    // 4) FILTER METADATA
    const { date, partyName, branchCode, base } = formData;
    doc.setFontSize(9);
    doc.setTextColor('#000000');
    doc.setFillColor(231, 235, 235);
    doc.roundedRect(2, 35, 292, 12, 2, 2, 'F');
    // Row 1: Labels (bold)
    doc.setFont(undefined, 'bold');
    doc.text('Date', 8, 40);
    doc.text('Party Name', 37, 40);
    doc.text('Branch', 125, 40);
    doc.text('Currency Type', 178, 40);

    // Row 2: Values (normal)
    doc.setFont(undefined, 'normal');
    doc.text(dayjs(date).format('DD-MM-YYYY'), 8, 45);
    doc.text(partyName, 37, 45);
    doc.text(branchCode, 125, 45);
    doc.text(base.toUpperCase(), 178, 45);

    // 5) TABLE
    const headerLabels = columns.map((c) => c.header);
    const numericFields = columns
      .map((c) => c.accessorKey)
      .filter((k) => k && /(totalDue|mSlab3|mSlab4|mSlab5|mSlab2|mSlab1|creditLimit|amount|outstanding|unAdjusted)/i.test(k));
    let previousSubledger = '';
    const body = data.map((row) => {
      return columns.map((col, index) => {
        const key = col.accessorKey;
        let raw = key ? row[key] : '';
        if (index === 0) {
          if (raw === previousSubledger) {
            raw = '';
          } else {
            previousSubledger = raw;
          }
        }
        if (key?.toLowerCase().includes('date')) {
          const d = dayjs(raw);
          return d.isValid() ? d.format('DD-MM-YYYY') : '-';
        }
        if (!isNaN(raw) && raw !== null && raw !== '') {
          const number = Math.round(Number(raw));
          return number === 0 ? '' : number.toLocaleString('en-IN');
        }
        return raw ?? '';
      });
    });

    const columnStyles = {
      0: { cellWidth: 68 }, // partyname
      1: { cellWidth: 30 }, // Doc No
      2: { cellWidth: 20 }, // Doc Date
      3: { cellWidth: 20 }, // Due Date
      4: { cellWidth: 20 }, // Inv Amount
      5: { cellWidth: 20 }, // Outstanding
      6: { cellWidth: 20 }, // Total Due
      7: { cellWidth: 20 }, // Below 30 Days
      8: { cellWidth: 20 }, // Days 31-60
      9: { cellWidth: 20 }, // Days 61-90
      10: { cellWidth: 20 }, // Days 91-120
      11: { cellWidth: 20 } // Days 120+
    };

    autoTable(doc, {
      startY: 50,
      head: [headerLabels],
      body,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [220, 220, 220],
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [52, 68, 155],
        textColor: 255,
        halign: 'center'
      },
      bodyStyles: {
        halign: 'left'
      },
      theme: 'grid',
      margin: { left: 0, right: 0 },
      tableWidth: 'auto',
      columnStyles: columnStyles,
      didDrawPage: (data) => {
        doc.setFontSize(8).setTextColor('#555555');
        doc.text(`Generated On: ${dayjs().format('DD-MM-YYYY hh:mm A')}`, pageW - 15, pageH - 10, { align: 'right' });
        doc.text(`Generated By: ${userName}`, 15, pageH - 10, { align: 'left' });
      },
      didParseCell: (cellHookData) => {
        const { cell, column, section } = cellHookData;
        if (section === 'body') {
          // get the accessorKey for this column
          const key = columns[column.index].accessorKey;

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
        {/* Section checkboxes */}
        <div className="row">
          <div className="col-md-2 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.date} onChange={handleChange} name="date" color="secondary" />}
              label="Date"
            />
          </div>
          <div className="col-md-2 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.partyName} onChange={handleChange} name="partyName" color="secondary" />}
              label="Party Name"
            />
          </div>
          <div className="col-md-2 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.branchCode} onChange={handleChange} name="branchCode" color="secondary" />}
              label="Branch Name"
            />
          </div>
          <div className="col-md-2 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.base} onChange={handleChange} name="base" color="secondary" />}
              label="Curreny Type"
            />
          </div>
        </div>

        {/* Date Picker */}
        {selectedSections.date && (
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled" size="small">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="As on Date"
                  format="DD-MM-YYYY"
                  onChange={(date) => handleDateChange('date', date)}
                  value={formData.date ? dayjs(formData.date, 'YYYY-MM-DD') : null}
                  slotProps={{
                    textField: {
                      size: 'small',
                      clearable: true,
                      error: !!fieldErrors.date,
                      helperText: fieldErrors.date
                    }
                  }}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
        )}

        {/* Party Name Dropdown */}
        {selectedSections.partyName && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel id="partyName-label">Party Name</InputLabel>
              <Select
                labelId="partyName-label"
                label="PartyName"
                name="partyName"
                onChange={handleSelectPartyName}
                value={formData.partyName}
              >
                <MenuItem value="All">All</MenuItem>
                {partyNameList.map((row) => (
                  <MenuItem key={row.id} value={row.partyName}>
                    {row.partyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        {/* Branch Name Dropdown */}
        {selectedSections.branchCode && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel id="branchCode-label">Branch Name</InputLabel>
              <Select
                labelId="branchCode-label"
                label="Branch Name"
                value={formData.branchCode}
                onChange={handleInputChange}
                name="branchCode"
              >
                <MenuItem value="All">All</MenuItem>
                {branchNameList.map((branch) => (
                  <MenuItem key={branch.id} value={branch.branch}>
                    {branch.branch}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        {selectedSections.base && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel id="base-label">Currency Type</InputLabel>
              <Select labelId="base-label" label="Currency Type" value={formData.base} onChange={handleInputChange} name="base">
                <MenuItem value="Native">Native</MenuItem>
                <MenuItem value="Base">Base</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}

        {/* Action Buttons */}
        {(selectedSections.partyName || selectedSections.date || selectedSections.branchCode) && (
          <div className="col-md-3 mb-3">
            <div className="row d-flex ml">
              <div className="d-flex flex-wrap justify-content-start mb-4 mt-1">
                <ActionButton title="Search" icon={SearchIcon} onClick={handleSearch} />
                <ActionButton title="Clear" icon={ClearIcon} onClick={allClearData} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialog for popup */}
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
            p: 1,
            backgroundColor: '#34449B',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Accounts Payable Ageing Report</span>
          <IconButton aria-label="close" onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <CommonReportTable
            data={rowData}
            columns={reportColumns}
            fileName={'AP Ageing Report'}
            tableOptions={tableOptions}
            handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })} // Safely access logo
            handleDownloadPdf={() =>
              handleDownloadPdf({
                logo: listViewData[0]?.companyLogo,
                columns: reportColumns,
                data: rowData,
                formData,
                fileName: 'AR_Ageing_Report',
                userName
              })
            }
            headerFields={headerFields}
            // sumFields={['amount', 'outstanding', 'totaldue']}
          />
        </DialogContent>
      </Dialog>

      {listView && (
        <div className="mt-4">
          <CommonReportTable
            data={rowData}
            columns={reportColumns}
            fileName={'AP Ageing Report'}
            isListView={true}
            handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })} // Safely access logo
            tableOptions={{
              ...tableOptions,
              muiTableContainerProps: { sx: { maxHeight: '60vh' } }
            }}
            handleDownloadPdf={() =>
              handleDownloadPdf({
                logo: listViewData[0]?.companyLogo,
                columns: reportColumns,
                data: rowData,
                formData,
                fileName: 'AR_Ageing_Report',
                userName
              })
            }
            headerFields={headerFields}
            // sumFields={['amount', 'outstanding', 'totaldue',]}
          />
        </div>
      )}
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            width: '100%'
          }}
        >
          <CircularProgress size={40} />
        </div>
      )}
    </div>
  );
};

export default ArAging;
