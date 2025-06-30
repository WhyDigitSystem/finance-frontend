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
  DialogTitle
} from '@mui/material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import SearchIcon from '@mui/icons-material/Search';
import FileDownload from '@mui/icons-material/FileDownload';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function ReceiptReport() {
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
  const [logo, setLogo] = useState([]);
  useEffect(() => {
    getPartyName();
    getAllBranches();
  }, []);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branchCode: false,
    customer: false
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
    customer: 'All',
    viewMode: 'details'
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branchCode: '',
    customer: ''
  });
  const handleClear = () => {
    setFormData({
      fromDate: null,
      toDate: null,
      branchCode: 'All',
      customer: 'All',
      viewMode: 'details'
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      customer: '',
      branchCode: ''
    });
    setSelectedSections({});
    setRowData([]);
  };
  const handleSelectPartyChange = (e) => {
    const value = e.target.value;
    console.log('Selected employeeCode value:', value);
    const selectedEmp = partyNameList.find((emp) => emp.partyName === value);
    if (value === 'All') {
      setFormData((prevData) => ({
        ...prevData,
        customer: 'All'
      }));
    } else {
      if (selectedEmp) {
        console.log('Selected party:', selectedEmp);
        setFormData((prevData) => ({
          ...prevData,
          customer: selectedEmp.partyName
        }));
      } else {
        console.log('No party found with the given code:', value);
      }
    }
  };
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
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=customer`);
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
    if (selectedSections.customer) {
      if (!formData.customer) {
        errors.customer = 'Customer name is required';
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
              `/arreceivable/getReceiptDetails?branchCode=${formData.branchCode}&fromDate=${formData.fromDate}&finYear=${finYear}&orgId=${orgId}&partyname=${formData.customer}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/arreceivable/getReceiptDetails?branchCode=${formData.branchCode}&orgId=${orgId}&partyname=${formData.customer}&finYear=${finYear}`
            );
          }
        } else {
          if (formData.fromDate && formData.toDate) {
            response = await apiCalls(
              'get',
              `/arreceivable/getReceiptSummary?branchCode=${formData.branchCode}&fromDate=${formData.fromDate}&finYear=${finYear}&orgId=${orgId}&partyname=${formData.customer}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/arreceivable/getReceiptSummary?branchCode=${formData.branchCode}&orgId=${orgId}&partyname=${formData.customer}&finYear=${finYear}`
            );
          }
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.mapp || []);
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

          // if (selectedSections.customer) {
          newHeaderFields.push({
            label: 'Customer',
            value: formData.customer
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
          { accessorKey: 'chequeNo', header: 'Cheque No', size: 80 },
          { accessorKey: 'chequeDate', header: 'Cheque Date', size: 120 },
          { accessorKey: 'customerName', header: 'Customer', size: 120 },
          {
            accessorKey: 'receiptAmount',
            header: 'Receipt Amt',
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
            accessorKey: 'onAccount',
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
            accessorKey: 'netAmount',
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
          { accessorKey: 'invoiceNo', header: 'Invoice No', size: 80 },
          { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 120 },
          { accessorKey: 'refNo', header: 'Ref No', size: 80 },
          { accessorKey: 'refDate', header: 'Ref Date', size: 80 },
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
            accessorKey: 'gstAmount',
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
            accessorKey: 'tdsAmount1',
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
            accessorKey: 'chargeamount',
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
            accessorKey: 'settledAmount',
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
            accessorKey: 'outStanding',
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
          { accessorKey: 'docId', header: 'Doc Id', size: 100 },
          { accessorKey: 'docDate', header: 'Date', size: 100 },
          { accessorKey: 'chequeNo', header: 'UTI No', size: 100 },
          { accessorKey: 'chequeDate', header: 'UTI Date', size: 100 },
          { accessorKey: 'customerName', header: 'Customer Name', size: 200 },
          { accessorKey: 'bankAccount', header: 'Bank Account', size: 100 },
          {
            accessorKey: 'receiptAmount',
            header: 'Receipt Amt',
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
            accessorKey: 'tdsAmount',
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
            accessorKey: 'onAccount',
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
            accessorKey: 'netAmount',
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
      ? ['tdsAmount', 'settledAmount', 'outStanding']
      : ['receiptAmount', 'tdsAmount', 'onAccount', 'netAmount'];
  };
  const handleClose = () => {
    setOpen(false);
    setRowData([]);
  };
  const handleDownloadExcel = async () => {
    try {
      const logoBase64 = await getLogo();
      const workbook = new ExcelJS.Workbook();
      const reportType = formData.viewMode === 'details' ? 'Detailed Receipt Report' : 'Summary Receipt Report';

      const sheet = workbook.addWorksheet(reportType);
      let currentRow = 1;

      // Add logo if available
      if (logoBase64) {
        try {
          const logoId = workbook.addImage({
            base64: logoBase64,
            extension: 'png'
          });
          sheet.mergeCells('A1:A2');
          // No merging — place and size logo in A1 neatly
          sheet.addImage(logoId, {
            tl: { col: 0, row: 0 }, // top-left corner
            ext: { width: 90, height: 50 } // Logo size: adjust to your needs
          });

          // Optional: set row height and column width for better fit
          sheet.getRow(1).height = 28; // 20-30 is good
          sheet.getColumn(1).width = 18; // Only Column A (index 1)
        } catch (logoError) {
          console.error('Error adding logo:', logoError);
        }
      }
      sheet.mergeCells('B1:P1');
      // Company Name (Row 1, centered)
      const companyCell = sheet.getCell('B1');
      companyCell.value = companyName;
      companyCell.font = { bold: true, size: 14, color: { argb: '1F4E78' } };
      companyCell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
      sheet.mergeCells('B2:P2');
      // Report Title (Row 2, centered)
      const titleCell = sheet.getCell('B2');
      titleCell.value = reportType;
      titleCell.font = { size: 14, bold: true };
      titleCell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
      currentRow = 3;
      // === Parameters ===
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      };

      const parameters = [];
      if (selectedSections.date) {
        parameters.push(`Date Range: ${formatDate(formData.fromDate)} to ${formatDate(formData.toDate)}`);
      }
      if (formData.branchCode) parameters.push(`Branch: ${formData.branchCode}`);
      if (formData.customer) parameters.push(`Customer: ${formData.customer}`);

      if (parameters.length > 0) {
        const paramsRow = sheet.addRow([parameters.join(' | ')]);
        paramsRow.font = { size: 11 };
        sheet.mergeCells(`A${currentRow}:O${currentRow}`);
        currentRow++;
      }

      // === Timestamp ===
      const timestamp = `Generated on: ${dayjs().format('DD-MM-YYYY HH:mm:ss')}`;
      const timeRow = sheet.addRow([timestamp]);
      timeRow.font = { size: 10, color: { argb: '7F7F7F' } };
      timeRow.alignment = { horizontal: 'right' };
      sheet.mergeCells(`A${currentRow}:O${currentRow}`);
      currentRow++;

      // === Header Row ===
      const headers =
        formData.viewMode === 'details'
          ? [
              'Doc ID',
              'Date',
              'Cheque No',
              'Cheque Date',
              'Customer',
              'Receipt Amt',
              'On Account',
              'Net Amt',
              'Invoice No',
              'Invoice Date',
              'Ref No',
              'Ref Date',
              'Bill Amt',
              'Tax Amt',
              'Tds Amt',
              'Total Amt',
              'Settled Amt',
              'Outstanding Amt'
            ]
          : ['Doc ID', 'Date', 'UTI No', 'UTI Date', 'Customer', 'Bank Account', 'Received Amt', 'Tds Amount', 'On Account', 'Net Amount'];

      const headerRow = sheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1F4E78' }
      };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
      headerRow.height = 25;
      currentRow++;

      // === Data Rows ===
      rowData.forEach((item, index) => {
        const rowValues =
          formData.viewMode === 'details'
            ? [
                item.docid,
                formatDate(item.docdate),
                item.chequeNo || '-',
                formatDate(item.chequeDate),
                item.customerName || '-',
                item.receiptAmount,
                item.onAccount,
                item.netAmount,
                item.invoiceNo,
                formatDate(item.invoiceDate),
                item.refNo,
                formatDate(item.refDate),
                item.amount,
                item.gstAmount,
                item.tdsAmount,
                item.chargeamount,
                item.settledAmount,
                item.outStanding
              ]
            : [
                item.docId,
                formatDate(item.docDate),
                item.chequeNo,
                formatDate(item.chequeDate),
                item.customerName,
                item.bankAccount,
                item.receiptAmount,
                item.tdsAmount,
                item.onAccount,
                item.netAmount
              ];

        const dataRow = sheet.addRow(rowValues);

        // Zebra striping
        dataRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: index % 2 === 0 ? 'F2F2F2' : 'FFFFFF' }
        };

        // Right-align amounts
        for (let i = 6; i <= rowValues.length; i++) {
          dataRow.getCell(i).alignment = { horizontal: 'right' };
          dataRow.getCell(i).numFmt = '#,##0.00';
        }
      });

      // === Column formatting ===
      sheet.columns.forEach((col) => {
        col.width = 18;
        col.alignment = { vertical: 'middle' };
      });

      // === Borders ===
      // sheet.eachRow(row => {
      //   row.eachCell(cell => {
      //     cell.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' }
      //     };
      //   });
      // });

      // === Download file ===
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `${reportType.replace(/\s+/g, '_')}.xlsx`);
    } catch (error) {
      console.error('Excel generation failed:', error);
      showToast('error', 'Failed to generate Excel file');
    }
  };
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
    const { fromDate, toDate, branchCode, customer, viewMode } = formData;
    doc.setFontSize(9);
    doc.setTextColor('#000000');
    doc.setFillColor(231, 235, 235);
    doc.roundedRect(2, 35, 206, 12, 2, 2, 'F');

    // Row 1: Labels
    doc.setFont(undefined, 'bold');
    doc.text('From Date', 8, 40);
    doc.text('To Date', 37, 40);
    doc.text('Customer', 58, 40);
    doc.text('Branch Code', 153, 40);
    doc.text('View Mode', 184, 40);

    // Row 2: Values
    doc.setFont(undefined, 'normal');
    doc.text(dayjs(fromDate).format('DD-MM-YYYY'), 8, 45);
    doc.text(dayjs(toDate).format('DD-MM-YYYY'), 37, 45);
    doc.text(String(customer ?? '-'), 58, 45);
    doc.text(String(branchCode ?? '-'), 153, 45);
    doc.text(String(viewMode ?? '-'), 184, 45);

    // 4) Build Table Body
    const headerLabels = columns.map((c) => c.header);
    const numericFields = columns
      .map((c) => c.accessorKey)
      .filter((k) => k && /(gstAmount|amount|netAmount|settledAmount|receiptAmount|onAccount|tdsAmount|)/i.test(k));

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
      viewMode === 'details' ? ['chargeamount', 'settledAmount', 'outStanding'] : ['receiptAmount', 'tdsAmount', 'onAccount', 'netAmount'];

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
                  control={
                    <Checkbox checked={selectedSections.customer} onChange={handleCheckboxChange} name="customer" color="secondary" />
                  }
                  label="Customer"
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
            {selectedSections.customer && (
              <div className="col-md-3 mb-2">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customer}>
                  <InputLabel id="customer-label">Customer</InputLabel>
                  <Select
                    labelId="customer-label"
                    label="customer"
                    value={formData.customer}
                    onChange={handleSelectPartyChange}
                    name="customer"
                  >
                    <MenuItem value="All">All</MenuItem>

                    {partyNameList?.map((row) => (
                      <MenuItem key={row.id} value={row.partyName}>
                        {row.partyName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.customer && <FormHelperText>{fieldErrors.customer}</FormHelperText>}
                </FormControl>
              </div>
            )}
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
          {formData.viewMode === 'details' ? 'Detailed Receipt Report' : 'Summary Receipt Report'}
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
                  fileName: 'Receipt Report',
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

export default ReceiptReport;
