import React from 'react';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
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
import CloseIcon from '@mui/icons-material/Close';
import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { IconButton } from '@mui/material';
import { Box, Button, Chip, Stack } from '@mui/material';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CMRT2 from 'utils/CMRT2';
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function PaymentReport() {
  const [listViewData, setListViewData] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [fillGridData, setFillGridData] = useState([]);
  const [value, setValue] = useState('1');
  const [modalOpen, setModalOpen] = useState(false);
  const [partyNameList, setPartyNameList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    vendor: false,
    branchCode: false
  });

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    vendor: false,
    branchCode: false
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };
  const handleProceed = () => {
    setVisibleSections({ ...selectedSections });
  };

  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    // dateRange: [null, null],
    vendor: 'All',
    vendorCode: 'All',
    branchCode: 'All'
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    vendor: '',
    vendorCode: '',
    branchCode: ''
  });
  const handleClear = () => {
    setListView(false);
    setFormData({
      // dateRange: [null, null],
      fromDate: null,
      toDate: null,
      vendor: 'All',
      vendorCode: 'All',
      branchCode: 'All'
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      vendor: '',
      vendorCode: '',
      branchCode: ''
    });
    setRowData([]);
  };
  const handleSelectPartyChange = (e) => {
    const value = e.target.value;
    console.log('Selected employeeCode value:', value);
    const selectedEmp = partyNameList.find((emp) => emp.partyName === value);

    if (selectedEmp) {
      console.log('Selected party:', selectedEmp);
      setFormData((prevData) => ({
        ...prevData,
        vendor: selectedEmp.partyName,
        vendorCode: selectedEmp.partyCode
      }));
    } else {
      console.log('No party found with the given code:', value);
    }
  };
  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchCodeList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, selectionStart, selectionEnd } = e.target;

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
    let inputValue = value;
    if (type === 'text' || type === 'textarea') {
      inputValue = value.toUpperCase();
    }
    setFormData((prevData) => ({ ...prevData, [name]: inputValue }));

    setTimeout(() => {
      const inputElement = document.getElementsByName(name)[0];
      if (inputElement && inputElement.setSelectionRange) {
        inputElement.setSelectionRange(selectionStart, selectionEnd);
      }
    }, 0);
  };
  // const handleDateChange = (newValue) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     dateRange: newValue,
  //   }));
  //   console.log("date range",formData.dateRange);

  // };
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };
  useEffect(() => {
    getPartyName();
    getAllBranches();
    getCompanyDetails();
  }, []);

  const getPartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=vendor`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const reportColumns = [
    // { accessorKey: 'docId', header: 'Doc No', size: 100 },
    {
      accessorKey: 'docId',
      header: 'Doc Id',
      size: 100,
      Cell: ({ row }) => {
        const docId = row.original.docId;
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleDocClick(docId);
            }}
            style={{
              color: 'crimson',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s, text-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'red';
              // e.target.style.textShadow = '0 0 2px rgba(255, 0, 0, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'crimson';
              e.target.style.textShadow = 'none';
            }}
          >
            {docId}
          </a>
        );
      }
    },
    { accessorKey: 'docDate', header: 'Doc Date', size: 100 },
    { accessorKey: 'subLedgerName', header: 'Vendor Name', size: 100 },
    { accessorKey: 'chequeNo', header: 'Cheque No', size: 100 },
    { accessorKey: 'chequeDate', header: 'Cheque Date', size: 100 },
    { accessorKey: 'bankCashAcc', header: 'Bank Account', size: 100 },
    {
      accessorKey: 'PaymentAmount',
      header: 'Payment Amt',
      size: 70,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', width: '100%' }}>{cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : 0}</div>
      )
    },
    {
      accessorKey: 'chargeamt',
      header: 'Payable Amt',
      size: 70,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', width: '100%' }}>{cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : 0}</div>
      )
    },
    {
      accessorKey: 'arApOutstanding',
      header: 'OutStanding',
      size: 70,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', width: '100%' }}>{cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : 0}</div>
      )
    },
    {
      accessorKey: 'arapSettled',
      header: 'Settled',
      size: 70,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', width: '100%' }}>{cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : 0}</div>
      )
    },
    {
      accessorKey: 'onaccount',
      header: 'On Account',
      size: 70,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', width: '100%' }}>{cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : 0}</div>
      )
    }
  ];
  const handleDocClick = async (docId) => {
    setModalOpen(true);
    try {
      const response = await apiCalls('get', `/payable/getPaymentByDocId?docId=${docId}&orgId=${orgId}`);
      if (response.status === true) {
        setFillGridData(response.paramObjectsMap.PaymentVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatAmount = (value) => {
    if (value == null || value === '') return '0';
    return Number(value).toLocaleString('en-IN'); // For Indian numbering system
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleGo = async () => {
    const errors = {};
    // if (!formData.partyName) {
    //   errors.partyName = 'Sub ledger name is required';
    // }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if (formData.fromDate && formData.toDate) {
          response = await apiCalls(
            'get',
            `/reportController/getPaymentRegisterReport?branchCode=${formData.branchCode}&finYear=${finYear}&orgId=${orgId}&partyCode=${formData.vendorCode}&toDate=${formData.toDate}&fromDate=${formData.fromDate}`
          );
        } else {
          response = await apiCalls(
            'get',
            `/reportController/getPaymentRegisterReport?branchCode=${formData.branchCode}&finYear=${finYear}&orgId=${orgId}&partyCode=${formData.vendorCode}`
          );
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.paymentReport);
          console.log('Payment Report', response.paramObjectsMap.paymentReport);
          setIsLoading(false);
          setListView(true);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Report Fetch failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Report Fetch failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };
  //
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
  const handleDownloadPdf = ({ logo, columns, data, fileName, loginUserName, formData }) => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // 1) COMPANY LOGO
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
    const boxW = textW + padX * 2;
    const boxX = (pageW - boxW) / 2;

    doc
      .setFillColor('#e7ebeb')
      .roundedRect(boxX, yTitle - boxH + 3, boxW, boxH, 4, 4, 'F')
      .setTextColor('#34449B')
      .setFontSize(12)
      .text(title, pageW / 2, yTitle, { align: 'center' });

    // 3) FOOTER
    doc.setFontSize(8).setTextColor('#555555');
    doc.text(`Generated On: ${dayjs().format('DD-MM-YYYY hh:mm A')}`, pageW - 15, pageH - 10, { align: 'right' });
    doc.text(`Generated By: ${loginUserName}`, 15, pageH - 10, { align: 'left' });

    // 4) FILTER METADATA
    const { fromDate, toDate, branchCode, vendor } = formData;
    doc.setFontSize(9);
    doc.setTextColor('#000000');
    doc.setFillColor(231, 235, 235);
    doc.roundedRect(2, 35, 292, 12, 2, 2, 'F');

    doc.setFont(undefined, 'bold');
    doc.text('From Date', 8, 40);
    doc.text('To Date', 32, 40);
    doc.text('Branch Code', 56, 40);
    doc.text('Vendor', 90, 40);

    doc.setFont(undefined, 'normal');
    doc.text(dayjs(fromDate).format('DD-MM-YYYY'), 8, 45);
    doc.text(dayjs(toDate).format('DD-MM-YYYY'), 32, 45);
    doc.text(branchCode, 56, 45);
    doc.text(vendor, 90, 45);

    // 5) Table Header & Body
    const headerLabels = columns.map((c) => c.header);
    const numericFields = columns
      .map((c) => c.accessorKey)
      .filter((k) => k && /(PaymentAmount|chargeamt|arApOutstanding|arapSettled|onaccount)/i.test(k));

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

    // const totalFields = ['PaymentAmount', 'chargeamt', 'arApOutstanding', 'arapSettled', 'onaccount'];
    // const totals = totalFields.map((key) => data.reduce((sum, row) => sum + (parseFloat(row[key]) || 0), 0));

    // const totalRow = columns.map((col, idx) => {
    //   const key = col.accessorKey;
    //   if (idx === 0) return 'Total';
    //   if (totalFields.includes(key)) {
    //     const index = totalFields.indexOf(key);
    //     return totals[index].toLocaleString('en-IN', {
    //       minimumFractionDigits: 2,
    //       maximumFractionDigits: 2
    //     });
    //   }
    //   return '';
    // });

    // body.push(totalRow);

    // 6) Define Column Widths (should match your table structure)
    const columnStyles = {
      0: { cellWidth: 25 }, // Cost Invoice No
      1: { cellWidth: 20 }, // Date
      2: { cellWidth: 52 }, // Doc Id
      3: { cellWidth: 25 }, // Doc Date
      4: { cellWidth: 20 }, // Party Name (made wider)
      5: { cellWidth: 50 }, // Reg In
      6: { cellWidth: 21 }, // GST Type
      7: { cellWidth: 21 }, // Bill Amount
      8: { cellWidth: 21 }, // TAX
      9: { cellWidth: 21 },
      10: { cellWidth: 21 } // Total Amount
    };

    // 7) Draw Table
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
      didDrawPage: () => {
        doc.setFontSize(8).setTextColor('#555555');
        doc.text(`Generated On: ${dayjs().format('DD-MM-YYYY hh:mm A')}`, pageW - 15, pageH - 10, { align: 'right' });
        doc.text(`Generated By: ${loginUserName}`, 15, pageH - 10, { align: 'left' });
      },
      didParseCell: (cellHookData) => {
        const { cell, column, section, row } = cellHookData;
        const key = columns[column.index]?.accessorKey;

        if (section === 'body' && numericFields.includes(key)) {
          cell.styles.halign = 'right';
        }

        if (section === 'body' && row.index === body.length - 1) {
          cell.styles.fontStyle = 'bold';
          cell.styles.textColor = [0, 0, 0];
          cell.styles.fillColor = [240, 240, 240];
        }
      }
    });

    // 8) Save File
    doc.save(`${fileName}_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`);
  };
  // excel download
  const handleDownloadExcel = async ({ logo }) => {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.created = new Date();
      const sheet = workbook.addWorksheet('Payment Register');
      sheet.state = 'visible';

      // ====== LOGO ======
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

      // ====== TITLE ======
      sheet.mergeCells('C1:I1');
      const titleCell = sheet.getCell('C1');
      titleCell.value = 'PAYMENT REGISTER';
      titleCell.font = { size: 18, bold: true, color: { argb: 'FF34449B' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

      // ====== METADATA ======
      const metadata = [
        { label: 'From Date', value: formData.fromDate ? dayjs(formData.fromDate).format('DD-MM-YYYY') : 'N/A' },
        { label: 'To Date', value: formData.toDate ? dayjs(formData.toDate).format('DD-MM-YYYY') : 'N/A' },
        { label: 'Branch Code', value: formData.branchCode !== 'All' ? formData.branchCode : 'All' },
        { label: 'Customer', value: formData.vendor },
        { label: 'Generated By', value: localStorage.getItem('userName') || 'System' },
        { label: 'Generated On', value: dayjs().format('DD-MM-YYYY HH:mm') }
      ];

      metadata.forEach((meta, index) => {
        const rowIndex = (index % 4) + 2;
        const colGroup = Math.floor(index / 4);
        const colStart = 4 + colGroup * 2;
        const row = sheet.getRow(rowIndex);
        row.getCell(colStart).value = meta.label;
        row.getCell(colStart).font = { bold: true };
        row.getCell(colStart + 1).value = meta.value;
      });

      // ====== HEADERS ======
      const headerRowIndex = 7;
      const headerRow = sheet.getRow(headerRowIndex);
      const headers = [
        'Doc Id',
        'Doc Date',
        'Vendor Name',
        'Cheque No',
        'Cheque Date',
        'Bank Account',
        'Payment Amt',
        'Payable Amt',
        'OutStanding',
        'Settled',
        'OnAccount'
      ];
      headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = header;
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

      // ====== DATA ROWS ======
      let PaymentAmount = 0;
      let chargeamt = 0;
      let arApOutstanding = 0;
      let arapSettled = 0;
      let onaccount = 0;
      // let totalPayable = 0;

      rowData.forEach((item) => {
        // const PA = parseFloat(item.PaymentAmount || 0);
        // const CA = parseFloat(item.chargeamt || 0);
        // const ARAPO = parseFloat(item.arApOutstanding || 0);
        // const ARAPS = parseFloat(item.arapSettled || 0);
        // const OA = parseFloat(item.onaccount || 0);

        // PaymentAmount += PA;
        // chargeamt += CA;
        // arApOutstanding += ARAPO;
        // arapSettled += ARAPS;
        // onaccount += OA;
        const row = sheet.addRow([
          item.docId || '',
          item.docDate ? dayjs(item.docDate).format('DD-MM-YYYY') : '-',
          item.subLedgerName || '-',
          item.chequeNo,
          item.chequeDate ? dayjs(item.chequeDate).format('DD-MM-YYYY') : '-',
          item.bankCashAcc || '',
          item.PaymentAmount || '',
           item.chargeamt || '',
            item.arApOutstanding || '',
             item.arapSettled || '',
             item.onaccount || '',
          // PA,
          // CA,
          // ARAPO,
          // ARAPS,
          // OA
        ]);

        [7, 8, 9, 10, 11].forEach((colIndex) => {
          const cell = row.getCell(colIndex);
          if (typeof cell.value === 'number') {
            if (cell.value === 0) {
              cell.value = '';
            } else {
              cell.numFmt = '#,##0.00';
            }
            cell.alignment = { horizontal: 'right' };
          }
        });

        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
        });
      });

      // ====== TOTAL ROW ======
      // const totalRow = sheet.addRow(['Total', '', '', '', '', '', PaymentAmount, chargeamt, arApOutstanding, arapSettled, onaccount]);

      // totalRow.eachCell((cell, colNumber) => {
      //   cell.font = { bold: true };
      //   cell.alignment = { horizontal: colNumber >= 6 ? 'right' : 'left' };
      //   cell.border = {
      //     top: { style: 'thin' },
      //     bottom: { style: 'thin' },
      //     left: { style: 'thin' },
      //     right: { style: 'thin' }
      //   };
      //   if (colNumber >= 6) {
      //     cell.numFmt = '#,##0.00';
      //   }
      // });

      // ====== COLUMN WIDTHS ======
      sheet.columns = [
        { width: 25 },
        { width: 20 },
        { width: 40 },
        { width: 30 },
        { width: 20 },
        { width: 35 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 }
      ];

      // ====== EXPORT ======
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      saveAs(blob, `Payment_Register_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      showToast('error', 'Failed to generate Excel file');
    }
  };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <>
          <div className="row">
            <div className="row">
              <div
                className="col-md-2
               mb-3"
              >
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.date} onChange={handleCheckboxChange} name="date" color="secondary" />}
                  label="Date"
                />
              </div>
              <div className="col-md-2 mb-1">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.vendor} onChange={handleCheckboxChange} name="vendor" color="secondary" />}
                  label="Vendor"
                />
              </div>
              <div className="col-md-2 mb-1">
                <FormControlLabel
                  control={
                    <Checkbox checked={selectedSections.branchCode} onChange={handleCheckboxChange} name="branchCode" color="secondary" />
                  }
                  label="Branch Code"
                />
              </div>
            </div>
            {selectedSections.date && (
              <>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="From Date"
                        value={formData.fromDate ? dayjs(formData.fromDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('fromDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true, error: fieldErrors.fromDate, helperText: fieldErrors.fromDate }
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
                          textField: { size: 'small', clearable: true, error: fieldErrors.toDate, helperText: fieldErrors.toDate }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
              </>
            )}
            {selectedSections.vendor && (
              <div className="col-md-3 mb-2">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.vendor}>
                  <InputLabel id="vendor-label">Vendor</InputLabel>
                  <Select labelId="vendor-label" label="Vendor" value={formData.vendor} onChange={handleSelectPartyChange} name="vendor">
                    <MenuItem value="All">All</MenuItem>

                    {partyNameList?.map((row) => (
                      <MenuItem key={row.id} value={row.partyName}>
                        {row.partyName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.vendor && <FormHelperText>{fieldErrors.vendor}</FormHelperText>}
                </FormControl>
              </div>
            )}
            {selectedSections.branchCode && (
              <div className="col-md-3 mb-2">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branchCode}>
                  <InputLabel id="branchCode-label">Branch Code</InputLabel>
                  <Select
                    labelId="branchCode-label"
                    label="Branch Code"
                    value={formData.branchCode}
                    onChange={handleSelectPartyChange}
                    name="branchCode"
                  >
                    <MenuItem value="All">All</MenuItem>

                    {branchCodeList?.map((row) => (
                      <MenuItem key={row.id} value={row.branchCode}>
                        {row.branchCode}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.branchCode && <FormHelperText>{fieldErrors.branchCode}</FormHelperText>}
                </FormControl>
              </div>
            )}
            {(selectedSections.date || selectedSections.vendor || selectedSections.branchCode) && (
              <div className="col-md-3 mb-2">
                <div className="row d-flex ml">
                  <div className="d-flex flex-wrap justify-content-start mb-4 mt-1" style={{ marginBottom: '20px' }}>
                    <ActionButton title="Search" icon={SearchIcon} onClick={handleGo} isLoading={isLoading} />
                    <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
        {listView && (
          <div>
            <CMRT2
              data={rowData}
              columns={reportColumns}
              isListView={listView}
              fileName={'Payment Register'}
              // sumFields={['PaymentAmount', 'chargeamt', 'arApOutstanding', 'arapSettled', 'onaccount']}
              handleDownloadPdf={() =>
                handleDownloadPdf({
                  logo: listViewData[0]?.companyLogo,
                  columns: reportColumns,
                  data: rowData,
                  formData,
                  fileName: 'Payment Register',
                  loginUserName
                })
              }
              handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
            />
          </div>
        )}
        <>
          <Dialog
            open={modalOpen}
            maxWidth={'xl'}
            fullWidth={true}
            onClose={handleCloseModal}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <h6 style={{ margin: 0, textAlign: 'center' }}>Report Details</h6>
                <IconButton onClick={handleCloseModal} color="error">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent className="pb-0">
              <div className="row mb-2 mb-1">
                <div className="col-md-3 mb-1">
                  <strong>Doc ID:</strong> {fillGridData.docId}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Date:</strong> {fillGridData.docDate ? dayjs(fillGridData.docDate).format('DD-MM-YYYY') : ''}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Payment Type:</strong> {fillGridData.paymentType}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>UTI No:</strong> {fillGridData.chequeNo}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Date:</strong> {fillGridData.chequeDate ? dayjs(fillGridData.chequeDate).format('DD-MM-YYYY') : ''}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Payment Amount:</strong> ₹{Number(fillGridData.paymentAmt || 0).toLocaleString('en-IN')}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>On Account:</strong> ₹{Number(fillGridData.onAccount || 0).toLocaleString('en-IN')}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Settled Amount:</strong> ₹{Number(fillGridData.netAmount || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="card w-full p-6 bg-base-100 shadow-xl mb-3">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
                        <Tab label="Details" value="1" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    #
                                  </th>
                                  <th className="table-header">Invoice No</th>
                                  <th className="table-header">Invoice Date</th>
                                  <th className="table-header">Ref No</th>
                                  <th className="table-header">Ref Date</th>
                                  <th className="table-header">Currency</th>
                                  <th className="table-header">Ex Rate</th>
                                  <th className="table-header">Bill Amt</th>
                                  <th className="table-header">Tax Amt</th>
                                  <th className="table-header">Payable Amt</th>

                                  <th className="table-header">Outstanding Amt</th>
                                  <th className="table-header">Settled Amt</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fillGridData.paymentInvDtlsVO && fillGridData.paymentInvDtlsVO.length > 0 ? (
                                  fillGridData.paymentInvDtlsVO.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.invNo || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatDate(row.invDate)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.refNo || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatDate(row.refDate)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.currency || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.exRate)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.amount)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.gstAmount)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.chargeAmt)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.outstanding)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.settled)}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <div className="text-center">No Data</div>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  </TabContext>
                </Box>
              </div>
            </DialogContent>
          </Dialog>
        </>
      </div>
    </>
  );
}

export default PaymentReport;
