import React, { useEffect, useState } from 'react';
import {
  TextField,
  Checkbox,
  Box,
  Typography,
  Button,
  FormControlLabel,
  FormHelperText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ButtonGroup,
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle,
  Autocomplete
} from '@mui/material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import CommonReportTableGrouped from '../../../utils/CommonReportTableGrouped';
import ActionButton from 'utils/ActionButton';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

function PaymentReport() {
  const [userName] = useState(localStorage.getItem('userName'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [headerFields, setHeaderFields] = useState([]);
  useEffect(() => {
    getPartyName();
    getAllBranches();
  }, []);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branchCode: false,
    vendor: false
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    branchCode: 'All',
    vendor: 'All',
    viewMode: 'details'
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branchCode: '',
    vendor: ''
  });
  const handleClear = () => {
    setFormData({
      fromDate: null,
      toDate: null,
      branchCode: 'All',
      vendor: 'All',
      viewMode: 'details'
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      vendor: '',
      branchCode: ''
    });
    setSelectedSections({});
    setRowData([]);
  };
  // const handleSelectPartyChange = (e) => {
  //   const value = e.target.value;
  //   console.log('Selected employeeCode value:', value);
  //   const selectedEmp = partyNameList.find((emp) => emp.partyName === value);
  //   if (value === 'All') {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       vendor: 'All'
  //     }));
  //   } else {
  //     if (selectedEmp) {
  //       console.log('Selected party:', selectedEmp);
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         vendor: selectedEmp.partyName
  //       }));
  //     } else {
  //       console.log('No party found with the given code:', value);
  //     }
  //   }
  // };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleInputChange = (e) => {
    const { name, value, type, selectionStart, selectionEnd } = e.target;
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
    if (name === 'branchCode') {
      if (value === 'All') {
        setFormData((prevData) => ({
          ...prevData,
          branchCode: 'All'
        }));
      } else {
        const selectedBranch = branchCodeList.find((br) => br.branchCode === value);
        setFormData((prevData) => ({
          ...prevData,
          branchCode: selectedBranch ? selectedBranch.branchCode : ''
        }));
      }
    } else {
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
    }
  };
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
    setFieldErrors((prevData) => ({
      ...prevData,
      [field]: ''
    }));
  };
  const getLogo = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      return response.paramObjectsMap.companyVO[0]?.companyLogo || null;
    } catch (error) {
      console.error('Error fetching logo:', error);
      return null;
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
  const getPartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=vendor`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const handleGo = async () => {
    const errors = {};
    if (selectedSections.date) {
      if (!formData.toDate) {
        errors.toDate = 'To Date is required';
      }
      if (!formData.fromDate) {
        errors.fromDate = 'From Date is required';
      }
    }
    if (selectedSections.branchCode) {
      if (!formData.branchCode) {
        errors.branchCode = 'Branch is required';
      }
    }
    if (selectedSections.vendor) {
      if (!formData.vendor) {
        errors.vendor = 'Vendor name is required';
      }
    }
    console.log('go error', errors);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      setOpenModal(true);
      try {
        let response;
        if (formData.viewMode === 'details') {
          if (formData.fromDate && formData.toDate) {
            response = await apiCalls(
              'get',
              `/payable/getPaymentDetails?branchCode=${formData.branchCode}&fromDate=${formData.fromDate}&orgId=${orgId}&partyname=${formData.vendor}&toDate=${formData.toDate}&finYear=${finYear}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/payable/getPaymentDetails?branchCode=${formData.branchCode}&orgId=${orgId}&partyname=${formData.vendor}&finYear=${finYear}`
            );
          }
        } else {
          if (formData.fromDate && formData.toDate) {
            response = await apiCalls(
              'get',
              `/payable/getPaymentSummary?branchCode=${formData.branchCode}&fromDate=${formData.fromDate}&orgId=${orgId}&partyname=${formData.vendor}&toDate=${formData.toDate}&finYear=${finYear}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/payable/getPaymentSummary?branchCode=${formData.branchCode}&orgId=${orgId}&partyname=${formData.vendor}&finYear=${finYear}`
            );
          }
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.paymentVO || []);
          setIsLoading(false);
          setOpen(true);
          const newHeaderFields = [];
          if (selectedSections.date) {
            newHeaderFields.push({
              label: 'Date Range',
              value: `${formatDate(formData.fromDate)} to ${formatDate(formData.toDate)}`
            });
          }

          // if (selectedSections.branchCode) {
          newHeaderFields.push({
            label: 'Branch',
            value: formData.branchCode
          });
          // }

          // if (selectedSections.vendor) {
          newHeaderFields.push({
            label: 'Vendor',
            value: formData.vendor
          });
          // }

          setHeaderFields(newHeaderFields);
        } else {
          showToast('error', response.paramObjectsMap.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', rowData.paramObjectsMap.message);
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dayjs(dateString).format('DD-MM-YYYY');
  };

  const getColumns = () => {
    return formData.viewMode === 'details'
      ? [
          { accessorKey: 'docid', header: 'Doc ID', size: 80 },
          { accessorKey: 'docdate', header: 'Date', size: 80 },
          { accessorKey: 'chequeno', header: 'Cheque No', size: 80 },
          { accessorKey: 'chequedate', header: 'Cheque Date', size: 120 },
          { accessorKey: 'partyname', header: 'Vendor', size: 120 },
          {
            accessorKey: 'paymentamt',
            header: 'Payment Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'onaccount',
            header: 'On Account',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'netamount',
            header: 'Net Amount',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          { accessorKey: 'invno', header: 'Inv No', size: 80 },
          { accessorKey: 'invdate', header: 'Inv Date', size: 150 },
          { accessorKey: 'refno', header: 'Ref No', size: 80 },
          { accessorKey: 'refdate', header: 'Ref Date', size: 80 },
          {
            accessorKey: 'amount',
            header: 'Bill Amount',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'gstamount',
            header: 'Tax Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'tdsamt',
            header: 'Tds Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'chargeamt',
            header: 'Total Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'settled',
            header: 'Settled Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'outstanding',
            header: 'Outstanding Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          }
        ]
      : [
          { accessorKey: 'docid', header: 'Doc Id', size: 100 },
          { accessorKey: 'docdate', header: 'Date', size: 100 },
          { accessorKey: 'chequeno', header: 'UTI No', size: 100 },
          { accessorKey: 'chequedate', header: 'UTI Date', size: 100 },
          { accessorKey: 'partyname', header: 'Vendor Name', size: 200 },
          { accessorKey: 'bankcashacc', header: 'Bank Account', size: 100 },
          {
            accessorKey: 'paymentamt',
            header: 'Paid Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'tdsamt',
            header: 'Tds Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'onaccount',
            header: 'On Account',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'netamount',
            header: 'Net Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          }
        ];
  };
  const getSumFields = () => {
    return formData.viewMode === 'details'
      ? ['tdsamt', 'chargeamt', 'settled', 'outstanding']
      : ['paymentamt', 'tdsamt', 'onaccount', 'netamount'];
  };
  const handleClose = () => {
    setOpen(false);
    setRowData([]);
  };

  const handleDownloadExcel = async () => {
    if (!rowData || rowData.length === 0) {
      showToast('warning', 'No data available to download');
      return;
    }

    try {
      const logoBase64 = await getLogo();
      const workbook = new ExcelJS.Workbook();
      const reportType = formData.viewMode === 'details' ? 'Detailed Payment Report' : 'Summary Payment Report';

      const sheet = workbook.addWorksheet(reportType);
      let currentRow = 1;

      // Add logo if available
      if (logoBase64) {
        try {
          const logoId = workbook.addImage({
            base64: logoBase64,
            extension: 'png'
          });
          sheet.addImage(logoId, {
            tl: { col: 0, row: 0 },
            ext: { width: 90, height: 50 }
          });
          sheet.getRow(1).height = 28;
          sheet.getColumn(1).width = 18;
        } catch (logoError) {
          console.error('Error adding logo:', logoError);
        }
      }

      // Company Name
      const columns = getColumns();
      const lastColChar = String.fromCharCode(64 + columns.length); // Dynamic last column

      sheet.mergeCells(`B1:${lastColChar}1`);
      const companyCell = sheet.getCell('B1');
      companyCell.value = companyName;
      companyCell.font = { bold: true, size: 14, color: { argb: '1F4E78' } };
      companyCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

      // Report Title
      sheet.mergeCells(`B2:${lastColChar}2`);
      const titleCell = sheet.getCell('B2');
      titleCell.value = reportType;
      titleCell.font = { size: 14, bold: true };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      currentRow = 3;

      // Parameters
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      };

      const parameters = [];
      if (selectedSections.date && formData.fromDate && formData.toDate) {
        parameters.push(`Date Range: ${formatDate(formData.fromDate)} to ${formatDate(formData.toDate)}`);
      }
      if (formData.branchCode) {
        parameters.push(`Branch: ${formData.branchCode}`);
      }
      if (formData.vendor) {
        parameters.push(`Vendor: ${formData.vendor}`);
      }

      if (parameters.length > 0) {
        const paramRow = sheet.addRow([parameters.join(' | ')]);
        paramRow.font = { italic: true };
        sheet.mergeCells(`A${currentRow}:${lastColChar}${currentRow}`);
        currentRow++;
      }

      const timestamp = `Generated on: ${dayjs().format('DD-MM-YYYY HH:mm:ss')}`;
      const timeRow = sheet.addRow([timestamp]);
      timeRow.font = { size: 10, color: { argb: '7F7F7F' } };
      timeRow.alignment = { horizontal: 'right' };
      sheet.mergeCells(`A${currentRow}:${lastColChar}${currentRow}`);
      currentRow++;

      // Headers
      const headers = columns.map((col) => col.header);
      const accessors = columns.map((col) => col.accessorKey);
      const headerRow = sheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
      headerRow.height = 25;
      currentRow++;

      // Rows
      rowData.forEach((item, index) => {
        const rowValues = accessors.map((key) => {
          const val = item[key];
          if (val === null || val === undefined) return '';
          if (key.toLowerCase().includes('date')) return formatDate(val);
          if (typeof val === 'number') return Number(val);
          return val;
        });
        const row = sheet.addRow(rowValues);
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: index % 2 === 0 ? 'F2F2F2' : 'FFFFFF' }
        };
        for (let i = 0; i < rowValues.length; i++) {
          if (typeof rowValues[i] === 'number') {
            row.getCell(i + 1).alignment = { horizontal: 'right' };
            row.getCell(i + 1).numFmt = '#,##0.00';
          }
        }
      });

      // Column formatting
      sheet.columns.forEach((col, i) => {
        col.width = columns[i].size ? Math.floor(columns[i].size / 6) : 15;
        col.alignment = { vertical: 'middle' };
      });

      // Download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `${reportType.replace(/\s+/g, '_')}.xlsx`);
    } catch (error) {
      console.error('Excel export failed:', error);
      showToast('error', 'Excel download failed');
    }
  };

  // pdf Download
  const handleDownloadPdf = ({ logo, columns, data, fileName, userName, formData }) => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // 1) COMPANY LOGO (top-left)
    const logoBase64 = logo;
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 10, 10, 30, 23);
    }

    // 2) TITLE BOX
    const title = `${fileName}`;
    const textW = doc.getTextWidth(title);
    const boxW = textW + 20;
    const boxX = (pageW - boxW) / 2;
    doc
      .setFillColor('#e7ebeb')
      .roundedRect(boxX, 18, boxW, 10, 4, 4, 'F')
      .setTextColor('#34449B')
      .setFontSize(12)
      .text(title, pageW / 2, 25, { align: 'center' });

    // 3) FILTER METADATA
    const { fromDate, toDate, branchCode, vendor, viewMode } = formData;
    doc.setFontSize(9);
    doc.setTextColor('#000000');
    doc.setFillColor(231, 235, 235);
    doc.roundedRect(2, 35, 206, 12, 2, 2, 'F');

    // Row 1: Labels
    doc.setFont(undefined, 'bold');
    doc.text('From Date', 8, 40);
    doc.text('To Date', 37, 40);
    doc.text('Vendor', 58, 40);
    doc.text('Branch Code', 153, 40);
    doc.text('View Mode', 184, 40);

    // Row 2: Values
    doc.setFont(undefined, 'normal');
    doc.text(dayjs(fromDate).format('DD-MM-YYYY'), 8, 45);
    doc.text(dayjs(toDate).format('DD-MM-YYYY'), 37, 45);
    doc.text(String(vendor ?? '-'), 58, 45);
    doc.text(String(branchCode ?? '-'), 153, 45);
    doc.text(String(viewMode.toUpperCase() ?? '-'), 184, 45);

    // 4) Build Table Body
    const headerLabels = columns.map((c) => c.header);
    const numericFields = columns
      .map((c) => c.accessorKey)
      .filter((k) => k && /(paymentamt|amount|outstanding|chargeamt|settled|gstamount|netamount|onaccount)/i.test(k));

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

    // 5) Add Total Row
    const totalFields =
      viewMode === 'details' ? ['tdsamt', 'chargeamt', 'settled', 'outstanding'] : ['paymentamt', 'tdsamt', 'onaccount', 'netamount'];

    const totalRow = columns.map((col, index) => {
      const key = col.accessorKey;
      if (index === 0) return 'Total';
      if (totalFields.includes(key)) {
        const sum = data.reduce((acc, row) => acc + (parseFloat(row[key]) || 0), 0);
        return sum.toLocaleString('en-IN');
      }
      return '';
    });

    body.push(totalRow); // ✅ Append total row

    // 6) Render Table
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
      margin: { left: 5, right: 5 },
      tableWidth: 'auto',
      columnStyles: generateFullWidthColumnStyles(columns, doc),
      didDrawPage: (data) => {
        doc.setFontSize(8).setTextColor('#555555');
        doc.text(`Generated On: ${dayjs().format('DD-MM-YYYY hh:mm A')}`, pageW - 15, pageH - 10, { align: 'right' });
        doc.text(`Generated By: ${userName}`, 15, pageH - 10, { align: 'left' });
      },
      didParseCell: (cellHookData) => {
        const { cell, column, section, row } = cellHookData;
        const key = columns[column.index]?.accessorKey;

        if (section === 'body' && numericFields.includes(key)) {
          cell.styles.halign = 'right';
        }
      }
    });

    // 7) Save
    doc.save(`${fileName}_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`);
  };
  const generateFullWidthColumnStyles = (columns, doc) => {
    const totalColumns = columns.length;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10; // left + right total margin (10 on each side)
    const usableWidth = pageWidth - margin;

    const colWidth = usableWidth / totalColumns;

    const styles = {};
    columns.forEach((_, index) => {
      styles[index] = { cellWidth: colWidth };
    });

    return styles;
  };
  return (
    <>
      <div className="card w-full bg-base-100 shadow-xl" style={{ padding: '10px', borderRadius: '10px' }}>
        <>
          <div className="row">
            <div className="row">
              <div
                className="col-md-2
               mb-2"
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
                  label="Branch"
                />
              </div>
              <div className="col-md-2 mb-4 d-flex align-items-center">
                <ButtonGroup variant="outlined" size="small">
                  <Button
                    variant={formData.viewMode === 'details' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        viewMode: 'details'
                      }))
                    }
                  >
                    Details
                  </Button>
                  <Button
                    variant={formData.viewMode === 'summary' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        viewMode: 'summary'
                      }))
                    }
                  >
                    Summary
                  </Button>
                </ButtonGroup>
              </div>
              <div className="col-md-3 mb-2">
                <div className="row d-flex ml">
                  <div className="d-flex flex-wrap justify-content-start mb-3 mt-1" style={{ marginBottom: '20px' }}>
                    <ActionButton title="Search" icon={SearchIcon} onClick={handleGo} isLoading={isLoading} />
                    <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
                  </div>
                </div>
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
            {selectedSections.branchCode && (
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branchCode}>
                  <InputLabel id="branchCode-label">Branch Code</InputLabel>
                  <Select
                    labelId="branchCode-label"
                    label="branchCode"
                    value={formData.branchCode}
                    onChange={handleInputChange}
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
            {/* {selectedSections.vendor && (
              <div className="col-md-3 mb-2">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.vendor}>
                  <InputLabel id="vendor-label">Vendor</InputLabel>
                  <Select labelId="vendor-label" label="vendor" value={formData.vendor} onChange={handleSelectPartyChange} name="vendor">
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
            )} */}
            {/*  */}
            {selectedSections.vendor && (
              <div className="col-md-3 mb-2">
                <FormControl size="small" fullWidth error={!!fieldErrors.vendor}>
                  <Autocomplete
                    size="small"
                    options={[{ partyName: 'All' }, ...(partyNameList || [])]}
                    getOptionLabel={(option) => option?.partyName || ''}
                    value={
                      partyNameList?.find((item) => item.partyName === formData.vendor) ||
                      (formData.vendor === 'All' ? { partyName: 'All' } : null)
                    }
                    onChange={(event, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        vendor: newValue ? newValue.partyName : ''
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Vendor" name="vendor" error={!!fieldErrors.vendor} helperText={fieldErrors.vendor} />
                    )}
                    isOptionEqualToValue={(option, value) => option.partyName === value.partyName}
                  />
                </FormControl>
              </div>
            )}
            {/*  */}
          </div>
        </>
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
            p: 1,
            backgroundColor: '#34449B',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6"> */}
          {formData.viewMode === 'details' ? 'Detailed Payment Report' : 'Summary Payment Report'}
          {/* </Typography>*/}
          <Box>
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                color: 'white'
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {/* </Box> */}
        </DialogTitle>
        <DialogContent>
          {rowData.length > 0 && (
            <CommonReportTableGrouped
              columns={getColumns()}
              data={rowData}
              fileName={`${formData.viewMode === 'details' ? 'Detailed' : 'Summary'} Payment Report`}
              handleDownloadExcel={handleDownloadExcel}
              sumFields={getSumFields()}
              headerFields={headerFields}
              handleDownloadPDF={async () => {
                const logoBase64 = await getLogo();
                handleDownloadPdf({
                  logo: logoBase64,
                  columns: getColumns(),
                  data: rowData,
                  fileName: 'Payment Report',
                  userName,
                  formData
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PaymentReport;
