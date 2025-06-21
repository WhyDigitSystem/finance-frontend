import React, { useEffect, useState } from 'react';
import {
  TextField, Checkbox, Box, Typography, Button,
  FormControlLabel, FormHelperText, FormControl,
  InputLabel, MenuItem, Select, ButtonGroup,
  Dialog, DialogContent, IconButton, DialogTitle
} from '@mui/material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import SearchIcon from '@mui/icons-material/Search';
import FileDownload from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import CommonReportTableGrouped from '../../../utils/CommonReportTableGrouped';
import ActionButton from 'utils/ActionButton';

function ReceiptReport() {
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
  }, [])
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branchCode: false,
    customer: false,
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    branchCode: 'All',
    customer: 'All',
    viewMode: 'details',
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branchCode: '',
    customer: '',
  });
  const handleClear = () => {
    setFormData({
      fromDate: null,
      toDate: null,
      branchCode: 'All',
      customer: 'All',
      viewMode: 'details',
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      customer: '',
      branchCode: '',
    });
    setSelectedSections({});
    setRowData([]);
  };
  const handleSelectPartyChange = (e) => {
    const value = e.target.value;
    console.log('Selected employeeCode value:', value);
    const selectedEmp = partyNameList.find((emp) =>
      emp.partyName === value
    );
    if (value === "All") {
      setFormData((prevData) => ({
        ...prevData,
        customer: "All",
      }));
    } else {
      if (selectedEmp) {
        console.log('Selected party:', selectedEmp);
        setFormData((prevData) => ({
          ...prevData,
          customer: selectedEmp.partyName,
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
      [name]: '',
    }));
    if (name === 'branchCode') {
      if (value === "All") {
        setFormData((prevData) => ({
          ...prevData,
          branchCode: "All",
        }));
      } else {
        const selectedBranch = branchCodeList.find((br) => br.branchCode === value);
        setFormData((prevData) => ({
          ...prevData,
          branchCode: selectedBranch ? selectedBranch.branchCode : '',
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
    }))
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
    console.log("go error", errors);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      setOpenModal(true);
      try {
        let response;
        if (formData.viewMode === 'details') {
          if (formData.fromDate && formData.toDate) {
            response = await apiCalls(
              'get',
              `/arreceivable/getReceiptDetails?branchCode=${formData.branchCode}&finYear=${finYear}&fromDate=${formData.fromDate}&orgId=${orgId}&partyname=${formData.customer}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/payable/getPaymentDetails?branchCode=${formData.branchCode}&finYear=${finYear}&orgId=${orgId}&partyname=${formData.customer}`
            );
          }
        } else {
          if (formData.fromDate && formData.toDate) {
            response = await apiCalls(
              'get',
              `/arreceivable/getReceiptSummary?branchCode=${formData.branchCode}&finYear=${finYear}&fromDate=${formData.fromDate}&orgId=${orgId}&partyname=${formData.customer}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/arreceivable/getReceiptSummary?branchCode=${formData.branchCode}&finYear=${finYear}&orgId=${orgId}&partyname=${formData.customer}`
            );
          }
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.mapp || []);
          setIsLoading(false);
          setOpen(true);
          const newHeaderFields = [
            { label: 'Financial Year', value: finYear },
            { label: 'Company', value: companyName },
          ];
          if (selectedSections.date) {
            newHeaderFields.push({
              label: 'Date Range',
              value: `${formatDate(formData.fromDate)} to ${formatDate(formData.toDate)}`
            });
          }

          if (selectedSections.branchCode) {
            newHeaderFields.push({
              label: 'Branch',
              value: formData.branchCode
            });
          }

          if (selectedSections.customer) {
            newHeaderFields.push({
              label: 'Customer',
              value: formData.customer
            });
          }

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
          accessorKey: 'receiptAmount', header: 'Receipt Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'onAccount', header: 'On Account', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'netAmount', header: 'Net Amount', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        { accessorKey: 'invoiceNo', header: 'Invoice No', size: 80 },
        { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 120 },
        { accessorKey: 'refNo', header: 'Ref No', size: 80 },
        { accessorKey: 'refDate', header: 'Ref Date', size: 80 },
        {
          accessorKey: 'amount', header: 'Bill Amount', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'gstAmount', header: 'Tax Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'tdsAmount', header: 'Tds Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'chargeamount', header: 'Total Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'settledAmount', header: 'Settled Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'outStanding', header: 'Outstanding Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
      ]
      : [
        { accessorKey: 'docId', header: 'Doc Id', size: 100 },
        { accessorKey: 'docDate', header: 'Date', size: 100 },
        { accessorKey: 'chequeNo', header: 'UTI No', size: 100 },
        { accessorKey: 'chequeDate', header: 'UTI Date', size: 100 },
        { accessorKey: 'customerName', header: 'Customer Name', size: 200 },
        { accessorKey: 'bankAccount', header: 'Bank Account', size: 100 },
        {
          accessorKey: 'receiptAmount', header: 'Receipt Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'tdsAmount', header: 'Tds Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'onAccount', header: 'On Account', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'netAmount', header: 'Net Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
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
      const workbook = new ExcelJS.Workbook();
      const reportType = formData.viewMode === 'details'
        ? 'Detailed Receipt Report'
        : 'Summary Receipt Report';

      const sheet = workbook.addWorksheet(reportType);
      let currentRow = 1; // Track current row position

      // Title
      const titleRow = sheet.addRow([reportType]);
      titleRow.font = { size: 16, bold: true, color: { argb: '1F4E78' } };
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.mergeCells(`A${currentRow}:O${currentRow}`);
      currentRow++;
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      // New parameters section
      const parameters = [];
      if (finYear) parameters.push(`Financial Year: ${finYear}`);
      if (companyName) parameters.push(`Company: ${companyName}`);
      if (selectedSections.date) {
        parameters.push(
          `Date Range: ${formatDate(formData.fromDate)} to ${formatDate(formData.toDate)}`
        );
      }
      if (selectedSections.branchCode) parameters.push(`Branch: ${formData.branchCode}`);
      if (selectedSections.customer) parameters.push(`Customer: ${formData.customer}`);

      if (parameters.length > 0) {
        //  Parameters heading
        // const paramHeading = sheet.addRow(['Report Parameters']);
        // paramHeading.font = { bold: true, color: { argb: '1F4E78' } };
        sheet.mergeCells(`A${currentRow}:O${currentRow}`);
        currentRow++;

        // Parameters values
        const paramsRow = sheet.addRow([parameters.join(' | ')]);
        paramsRow.font = { bold: true, color: { argb: 'black' } };
        sheet.mergeCells(`A${currentRow}:O${currentRow}`);
        currentRow++;

        // Empty row for spacing
        sheet.addRow([]);
        currentRow++;
      }

      // Timestamp
      const timestamp = `Generated on: ${dayjs().format('DD-MM-YYYY HH:mm:ss')}`;
      const timeRow = sheet.addRow([timestamp]);
      timeRow.font = { color: { argb: '7F7F7F' } };
      timeRow.alignment = { horizontal: 'right' };
      sheet.mergeCells(`A${currentRow}:O${currentRow}`);
      currentRow++;

      // Headers
      const headers = formData.viewMode === 'details'
        ? [
          '#', 'Doc ID', 'Date', 'Cheque No', 'Date','Customer','Receipt Amt', 'On Account', 'Net Amt', 'Invoice No',
          'Date', 'Ref No', 'Ref Date', 'Bill Amt', 'Tax Amt', 'Tds Amt', 'Total Amt', 'Settled Amt', 'Outstanding Amt'
        ]
        : [
          '#', 'Doc ID', 'Date', 'UTI No', 'UTI Date',
          'Customer', 'Bank Account',
          'Received Amt', 'Tds Amount', 'On Account', 'Net Amount'
        ];

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

      // Data Rows
      let dataStartRow = currentRow; // Remember where data starts

      // Details Report
      if (formData.viewMode === 'details') {
        const groups = rowData.reduce((acc, item) => {
          const key = item.docId;
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

        Object.entries(groups).forEach(([docid, items], groupIndex) => {
          const startRow = currentRow;

          items.forEach((item, idx) => {
            const row = [
              groupIndex + 1,
              item.docId,
              dayjs(item.docDate).format('DD-MM-YYYY'),
              item.jobNo,
              item.supplierName,
              item.vId || '-',
              dayjs(item.vDate).format('DD-MM-YYYY'),
              item.chargeCode,
              item.chargerName,
              item.ledger,
              item.gstType,
              item.gstPercentage,
              item.qty,
              item.rate,
              item.lcAmt,
              item.gst,
              item.totalTds,
              item.netAmount,
            ];
            const dataRow = sheet.addRow(row);

            // Apply zebra striping
            dataRow.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: groupIndex % 2 === 0 ? 'F2F2F2' : 'FFFFFF' }
            };

            // Color coding
            dataRow.getCell('O').font = { color: { argb: 'FFFF0000' } }; // Tax - Red
            dataRow.getCell('P').font = { color: { argb: 'FF00B050' } }; // Total - Green
            dataRow.getCell('Q').font = { color: { argb: 'FF00B050' } }; // Total - Green
            dataRow.getCell('R').font = { color: { argb: 'FFFF0000' } }; // Tax - Red

            // Format numbers
            dataRow.getCell('N').numFmt = '#,##0.00';
            dataRow.getCell('O').numFmt = '#,##0.00';
            dataRow.getCell('P').numFmt = '#,##0.00';
            dataRow.getCell('Q').numFmt = '#,##0.00';
            dataRow.getCell('R').numFmt = '#,##0.00';

            currentRow++;
          });

          // Only merge if group has >1 row
          if (items.length > 1) {
            const endRow = currentRow - 1;
            for (let col = 1; col <= 6; col++) {
              const colChar = String.fromCharCode(64 + col);
              sheet.mergeCells(`${colChar}${startRow}:${colChar}${endRow}`);
              const cell = sheet.getCell(`${colChar}${startRow}`);
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            }
          }
        });
      }
      // Summary Report
      else {
        rowData.forEach((item, index) => {
          const row = sheet.addRow([
            index + 1,
            item.docId,
            dayjs(item.docdate).format('DD-MM-YYYY'),
            item.vId || '-',
            dayjs(item.vDate).format('DD-MM-YYYY'),
            item.gstType,
            item.supplierName,
            item.supplierPlace,
            item.totChargeLcAmt,
            item.gstAmount,
            item.tdsAmount,
            item.totalLcAmount
          ]);

          // Apply zebra striping
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: index % 2 === 0 ? 'F2F2F2' : 'FFFFFF' }
          };

          // Color coding
          row.getCell('I').font = { color: { argb: 'FFFF0000' } }; // Tax - Red
          row.getCell('J').font = { color: { argb: 'FF00B050' } };
          row.getCell('K').font = { color: { argb: 'FF00B050' } }; // Total - Green
          row.getCell('L').font = { color: { argb: 'FFFF0000' } };

          // Format numbers
          row.getCell('I').numFmt = '#,##0.00'; // Amount
          row.getCell('J').numFmt = '#,##0.00'; // Tax
          row.getCell('K').numFmt = '#,##0.00'; // Total
          row.getCell('L').numFmt = '#,##0.00';

          currentRow++;
        });
      }

      // Add totals
      const totals = rowData.reduce((acc, item) => {
        acc.totalCharge += Number(item.lcAmt || 0);
        acc.totalTax += Number(item.gst || 0);
        acc.totalTds += Number(item.totalTds || 0);
        acc.totalInvoice += Number(item.netAmount || 0);
        return acc;
      }, { totalCharge: 0, totalTax: 0, totalInvoice: 0, totalTds: 0 });

      const totalSummary = rowData.reduce((acc, item) => {
        acc.totChargeLcAmt += Number(item.totChargeLcAmt || 0);
        acc.gstAmount += Number(item.gstAmount || 0);
        acc.tdsAmount += Number(item.tdsAmount || 0);
        acc.totalLcAmount += Number(item.totalLcAmount || 0);
        return acc;
      }, { totChargeLcAmt: 0, gstAmount: 0, tdsAmount: 0, totalLcAmount: 0, });
      const totalRow = sheet.addRow([]);

      if (formData.viewMode === 'details') {
        totalRow.values = [
          'Grand Total', '', '', '', '', '', '', '', '', '', '', '', '', '',
          totals.totalCharge,
          totals.totalTax,
          totals.totalTds,
          totals.totalInvoice,
        ];
        sheet.mergeCells(`A${currentRow}:J${currentRow}`);
      } else {
        totalRow.values = [
          'Grand Total', '', '', '', '', '', '', '',
          totalSummary.totChargeLcAmt,
          totalSummary.gstAmount,
          totalSummary.tdsAmount,
          totalSummary.totalLcAmount,
        ];
        sheet.mergeCells(`A${currentRow}:H${currentRow}`);
      }

      // Style totals row
      totalRow.font = { bold: true };
      totalRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'DDEBF7' } // Light blue background
      };
      totalRow.getCell(1).alignment = { horizontal: 'right' };

      // Format totals numbers
      if (formData.viewMode === 'details') {
        totalRow.getCell('K').numFmt = '#,##0';
        totalRow.getCell('K').alignment = { horizontal: 'right' };
        ['O', 'P', 'Q', 'R'].forEach(col => {
          const cell = totalRow.getCell(col);
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
        });
        totalRow.getCell('O').font = { color: { argb: 'FFFF0000' } };
        totalRow.getCell('P').font = { color: { argb: 'FF00B050' } };
        totalRow.getCell('Q').font = { color: { argb: 'FF00B050' } };
        totalRow.getCell('R').font = { color: { argb: 'FFFF0000' } };
      } else {
        ['I', 'J', 'K', 'L'].forEach(col => {
          const cell = totalRow.getCell(col);
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
        });
        totalRow.getCell('I').font = { color: { argb: 'FFFF0000' } };
        totalRow.getCell('J').font = { color: { argb: 'FF00B050' } };
        totalRow.getCell('K').font = { color: { argb: 'FF00B050' } };
        totalRow.getCell('L').font = { color: { argb: 'FFFF0000' } };
      }
      currentRow++;

      // Set column widths and borders
      sheet.columns.forEach(column => {
        column.width = 18;
        column.alignment = { vertical: 'middle' };
      });

      sheet.eachRow(row => {
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `${reportType.replace(/\s+/g, '_')}.xlsx`);
    } catch (error) {
      console.error('Excel generation failed:', error);
      showToast('error', 'Failed to generate Excel file');
    }
  };

  return (
    <>
      <div className="card w-full bg-base-100 shadow-xl" style={{ padding: '10px', borderRadius: '10px' }}>
        <>
          <div className="row">
            <div className="row">
              <div className="col-md-2
               mb-2">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.date} onChange={handleCheckboxChange} name="date" color="secondary" />}
                  label="Date"
                />
              </div>
              <div className="col-md-2 mb-1">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.customer} onChange={handleCheckboxChange} name="customer" color="secondary" />}
                  label="Customer"
                />
              </div>
              <div className="col-md-2 mb-1">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.branchCode} onChange={handleCheckboxChange} name="branchCode" color="secondary" />}
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
                        viewMode: 'details',
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
                        viewMode: 'summary',
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
        <DialogTitle sx={{
          m: 0,
          p: 1,
          backgroundColor: '#34449B',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6"> */}
          {formData.viewMode === 'details' ? 'Detailed Receipt Report' : 'Summary Receipt Report'}
          {/* </Typography>*/}
          <Box>
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                color: 'white',
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
              headerFields={headerFields} // Pass headerFields
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReceiptReport;