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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import CircularProgress from '@mui/material/CircularProgress';

const APaging = () => {
  const [listViewData, setListViewData] = useState([]);
  const [orgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [userName] = useState(localStorage.getItem('userName'));
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
    baseType: 'Native',
    msLab1: '',
    msLab2: '',
    msLab3: '',
    msLab4: '',
    msLab5: ''
  });

  const [selectedSections, setSelectedSections] = useState({
    partyName: false,
    date: true,
    branchCode: false,
    baseType: true
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
      baseType: 'Native'
    });
    setSelectedSections({
      partyName: false,
      date: true,
      branchCode: false,
      baseType: true
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
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=vendor`);
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
        asdate: formData.date,
        orgId,
        branch: formData.branchCode,
        partyname: formData.partyName === 'All' ? 'ALL' : formData.partyName,
        baseType: formData.baseType
      });

      if (selectedSections.branchCode && formData.branchCode !== 'All') {
        queryParams.append('branch', formData.branchCode);
      }

      const response = await apiCalls('get', `/reportController/getApAgeing?${queryParams.toString()}`);

      if (response.status === true) {
        // Transform the API response data to match our table structure
        const transformedData = response.paramObjectsMap.mapp.map((item) => ({
          docid: item.docId || item.refNo,
          docdate: item.docDate || item.refDate,
          duedate: item.dueDate,
          amount: item.amount,
          outstanding: item.outStanding,
          totaldue: item.totalDue,
          unadjusted: item.outStanding, // Assuming unadjusted is same as outstanding
          msLab1: item.msLab1, // These would come from your actual API response
          msLab2: item.msLab2,
          msLab3: item.msLab3,
          msLab4: item.msLab4,
          msLab5: item.msLab5,
          // Include additional fields if needed
          partyName: item.partyName,
          subledgerName: item.subledgerName,
          branch: item.branch,
          partyType: item.partyType
        }));

        setRowData(transformedData);

        // Set header fields for AP Ageing report
        setHeaderFields([
          {
            label: 'As on Date',
            value: formData.date ? dayjs(formData.date).format('DD-MM-YYYY') : ''
          },
          {
            label: 'Party Name',
            value: formData.partyName === 'All' ? 'ALL' : formData.partyName
          },
          {
            label: 'Branch Name',
            value: formData.branchCode === 'All' ? 'ALL' : formData.branchCode
          },
          {
            label: 'Base Type',
            value: formData.baseType
          }
        ]);

        setListView(true);
        setOpenModal(true);
        setIsLoading(false);
      } else {
        showToast('error', response.paramObjectsMap?.message || 'Report Fetch failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Report Fetch failed');
    } finally {
      setIsLoading(false);
    }
  };

  const reportColumns = [
    {
      accessorKey: 'partyName',
      header: 'Party Name',
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
      accessorKey: 'docid',
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
      accessorKey: 'docdate',
      header: 'Doc Date',
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
      accessorKey: 'duedate',
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
      accessorKey: 'totaldue',
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
      accessorKey: 'msLab1',
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
      accessorKey: 'msLab2',
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
      accessorKey: 'msLab3',
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
      accessorKey: 'msLab4',
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
      accessorKey: 'msLab5',
      header: 'Days 120+',
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
  const handleDownloadExcel = async ({ logo }) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('AP Ageing Report');

    // ====== LOGO SECTION ======
    sheet.mergeCells('A1:B5');
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

    // ====== TITLE ====== (Shifted to C2:I2 to avoid overlap with A1:B5)
    sheet.mergeCells('C2:I2');
    const titleCell = sheet.getCell('C2');
    titleCell.value = 'Accounts Payable Ageing Report';
    titleCell.font = {
      size: 18,
      bold: true,
      color: { argb: 'FF34449B' }
    };
    titleCell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };

    // ====== HEADER INFORMATION ======
    const headerInfo = [
      ...headerFields,
      { label: 'Generated By', value: localStorage.getItem('userName') || 'Admin' },
      { label: 'Generated On', value: dayjs().format('DD-MM-YYYY HH:mm') }
    ];

    for (let i = 0; i < headerInfo.length; i += 2) {
      const rowIndex = Math.floor(i / 2) + 3; // Start from row 4
      const row = sheet.getRow(rowIndex);

      // First column (C & D)
      const labelCell1 = row.getCell(3); // C
      const valueCell1 = row.getCell(4); // D
      labelCell1.value = headerInfo[i].label + ':';
      labelCell1.font = { bold: true };
      valueCell1.value = headerInfo[i].value;

      // Second column (E & F), if exists
      if (headerInfo[i + 1]) {
        const labelCell2 = row.getCell(5); // E
        const valueCell2 = row.getCell(6); // F
        labelCell2.value = headerInfo[i + 1].label + ':';
        labelCell2.font = { bold: true };
        valueCell2.value = headerInfo[i + 1].value;
      }
    }

    // ====== TABLE HEADER ======
    const headerRow = sheet.addRow(reportColumns.map((col) => col.header));
    headerRow.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF34449B' }
    };
    headerRow.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
    headerRow.height = 20;

    // ====== DATA ROWS ======
    rowData.forEach((item) => {
      const row = sheet.addRow([
        item.partyName,
        item.docid || '',
        item.docdate ? dayjs(item.docdate).format('DD-MM-YYYY') : '-',
        item.duedate ? dayjs(item.duedate).format('DD-MM-YYYY') : '-',
        item.amount,
        item.outstanding,
        item.totaldue,
        // item.unadjusted,
        item.msLab1,
        item.msLab2,
        item.msLab3,
        item.msLab4,
        item.msLab5
        // item.branch,
        // item.partyType
      ]);

      // Format numeric columns
      [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((colIdx) => {
        const cell = row.getCell(colIdx + 1);
        if (typeof cell.value === 'number') {
          cell.numFmt = '#,##0.00'; // Indian comma format
          cell.alignment = { horizontal: 'right' };
        }
      });
    });

    // ====== COLUMN WIDTHS ======
    sheet.columns = [
      { width: 20 }, // Invoice/Ref No
      { width: 15 }, // Invoice/Ref Date
      { width: 15 }, // Due Date
      { width: 15 }, // Amount
      { width: 15 }, // Outstanding
      { width: 15 }, // Total Due
      { width: 15 }, // Unadjusted
      { width: 15 }, // Below 30 Days
      { width: 15 }, // Days 31-60
      { width: 15 }, // Days 61-90
      { width: 15 }, // Days 91-120
      { width: 15 } // Days 120+
    ];

    // ====== FINALIZE AND SAVE ======
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `AP_Ageing_Report_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
  };

  // Logo
  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      console.log('API Response:', response);
      setListViewData(response.paramObjectsMap.companyVO.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // pdf download
  const handleDownloadPdf = ({ logo, columns, data, fileName = 'AP Ageing', userName, formData }) => {
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
      .setFontSize(18)
      .text(title, pageW / 2, yTitle, { align: 'center' });

    // 3) FOOTER (Generated On / By)
    doc.setFontSize(8).setTextColor('#555555');
    doc.text(`Generated On: ${dayjs().format('DD-MM-YYYY hh:mm A')}`, pageW - 15, pageH - 10, { align: 'right' });
    doc.text(`Generated By: ${userName}`, 15, pageH - 10, { align: 'left' });

    // 4) FILTER METADATA
    const { date, branchCode, baseType, partyName } = formData;

    const md = [
      ['Date', date ? dayjs(date).format('DD-MM-YYYY') : '-'],
      ['Party Name', partyName || 'All'],
      ['Branch', branchCode || 'All'],
      ['Currency Type', baseType ? 'Native' : 'Base']
    ];
    const bandX = 14;
    const bandY = 38;
    const bandWidth = pageW - bandX * 2; // = pageW - 28
    const bandHeight = 10;

    doc.setFontSize(9).setTextColor('#000000').setFillColor(231, 235, 235).roundedRect(bandX, bandY, bandWidth, bandHeight, 2, 2, 'F');
    const cols = md.length;
    const colWidth = bandWidth / cols;
    md.forEach(([label, value], i) => {
      // Left edge of this metadata column
      const colX = bandX + i * colWidth;

      // Y position for text (vertically center at bandY + bandHeight/2)
      // jsPDF’s text is drawn on the baseline, so add ~3px for rough vertical centering
      const textY = bandY + bandHeight / 3 + 3;

      // Draw label in bold
      doc.setFont(undefined, 'bold');
      doc.text(label + ':', colX + 4, textY);

      // Draw value right after label
      const labelW = doc.getTextWidth(label + ': ');
      doc.setFont(undefined, 'normal');
      doc.text(String(value), colX + 4 + labelW, textY);
    });

    // 5) TABLE
    const headerLabels = columns.map((c) => c.header);
    const numericFields = columns
      .map((c) => c.accessorKey)
      .filter((k) => k && /(amount|outStanding|totalDue|msLab1|msLab2|msLab3|msLab4|msLab5)/i.test(k));
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
          <div className="col-md-4 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.baseType} onChange={handleChange} name="baseType" color="secondary" />}
              label="Currency Type"
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

        {/* Base Type Dropdown */}
        {selectedSections.baseType && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel id="baseType-label">Currency Type</InputLabel>
              <Select labelId="baseType-label" label="Currency Type" value={formData.baseType} onChange={handleInputChange} name="baseType">
                <MenuItem value="Native">Native</MenuItem>
                <MenuItem value="Base">Base</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}

        {/* Action Buttons */}
        {(selectedSections.partyName || selectedSections.date || selectedSections.branchCode || selectedSections.baseType) && (
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
            handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
            handleDownloadPdf={() =>
              handleDownloadPdf({
                logo: listViewData[0]?.companyLogo,
                columns: reportColumns,
                data: rowData,
                formData,
                fileName: 'AP Ageing',
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
            handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
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
                fileName: 'AP Ageing',
                userName
              })
            }
            headerFields={headerFields}
            // sumFields={['amount', 'outstanding', 'totaldue']}
          />
          {/* isloading component */}
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
export default APaging;
