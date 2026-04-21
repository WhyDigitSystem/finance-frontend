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
// import CommonReportTableGrouped from '../../../utils/CommonReportTableGrouped';
import CMRT2 from 'utils/CMRT2';

import ActionButton from 'utils/ActionButton';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastContainer } from 'react-toastify';

// import { useNavigate } from 'react-router-dom';
import { Scale } from '@mui/icons-material';
function CostEstimateReport() {
  // const navigate = useNavigate();
  const [userName] = useState(localStorage.getItem('userName'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [logo, setLogo] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [employeeNameList, setEmployeeNameList] = useState([]);
  const [headerFields, setHeaderFields] = useState([]);
  useEffect(() => {
    getAllBranches();
    employeeName();
  }, []);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branchCode: false,
    category: false,
    employeeName: false
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
    category: 'All',
    employeeName: 'All',
    viewMode: 'details'
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branchCode: '',
    category: '',
    employeeName: ''
  });
  const handleClear = () => {
    setFormData({
      fromDate: null,
      toDate: null,
      branchCode: 'All',
      category: 'All',
      viewMode: 'details',
      employeeName: 'All'
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      category: '',
      branchCode: '',
      employeeName: ''
    });
    setSelectedSections({});
    setRowData([]);
  };
  const handleCloseModal = () => {
    setOpen(false);
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
  const categoryOptions = [
    { category: 'All' },
    { category: 'Wages' },
    { category: 'Cleaning' },
    { category: 'Repair & Maintanance' },
    { category: 'Asset Purchase' },
    { category: 'Transport' },
    { category: 'Material Purchase' },
    { category: 'Admin' },
    { category: 'Insurance' },
    { category: 'Professional Services' },
    { category: 'Marketing & Advertising' },
    { category: 'Miscellaneous' }
  ];
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
    setFieldErrors((prevData) => ({
      ...prevData,
      [field]: ''
    }));
  };

  const employeeName = async () => {
    try {
      const employeeData = await apiCalls('get', `costEstimation/getAllEmployees?orgId=${orgId}`);
      setEmployeeNameList(employeeData.paramObjectsMap.EmployeeVO);
    } catch (error) {
      console.error('Error fetching employee data:', error);
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
  const getLogo = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      return response.paramObjectsMap.companyVO[0]?.companyLogo || null;
    } catch (error) {
      console.error('Error fetching logo:', error);
      return null;
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
    if (selectedSections.category) {
      if (!formData.category) {
        errors.category = 'Category is required';
      }
    }
    if (selectedSections.employeeName) {
      if (!formData.employeeName) {
        errors.employeeName = 'Employee Name is required';
      }
    }
    console.log('go error', errors);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if (formData.viewMode === 'details') {
          if (selectedSections.date) {
            response = await apiCalls(
              'get',
              `/costEstimation/getCostEstimationDetails?branchCode=${formData.branchCode}&category=${formData.category}&employeeName=${formData.employeeName}&finYear=${finYear}&orgId=${orgId}&fromDate=${formData.fromDate}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/costEstimation/getCostEstimationDetails?branchCode=${formData.branchCode}&employeeName=${formData.employeeName}&finYear=${finYear}&orgId=${orgId}`
            );
          }
        } else {
          if (selectedSections.date) {
            response = await apiCalls(
              'get',
              `/costEstimation/getCostEstimationSummary?branchCode=${formData.branchCode}&category=${formData.category}&employeeName=${formData.employeeName}&finYear=${finYear}&orgId=${orgId}&fromDate=${formData.fromDate}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/costEstimation/getCostEstimationSummary?branchCode=${formData.branchCode}&employeeName=${formData.employeeName}&finYear=${finYear}&orgId=${orgId}`
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
          // if (selectedSections.category) {
          newHeaderFields.push({
            label: 'Category',
            value: formData.category
          });
          newHeaderFields.push({
            label: formData.viewMode === 'details' ? 'Details' : 'Summary',
            value: formData.viewMode
          });

          // }
          setHeaderFields(newHeaderFields);
        } else {
          showToast('error', response.paramObjectsMap.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Report fetch Failed');
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
          { accessorKey: 'docId', header: 'Doc ID', size: 80 },
          // {
          //   accessorKey: 'docId',
          //   header: 'Doc ID',
          //   size: 80,
          //   Cell: ({ row }) => {
          //     const [hovered, setHovered] = React.useState(false);

          //     return (
          //       <span
          //         style={{
          //           color: 'red',
          //           cursor: 'pointer',
          //           display: 'inline-block',
          //           transform: hovered ? 'scale(1.1)' : 'scale(1)',
          //           transition: 'transform 0.2s ease-in-out'
          //         }}
          //         onMouseEnter={() => setHovered(true)}
          //         onMouseLeave={() => setHovered(false)}
          //         onClick={() => navigate(`/finance/CostEstimate`)}
          //       >
          //         {row.original.docId}
          //       </span>
          //     );
          //   }
          // },
          { accessorKey: 'docdate', header: 'Doc Date', size: 80 },
          // { accessorKey: 'Vid', header: 'Invoice No', size: 80 },
          // { accessorKey: 'Vdate', header: 'Invoice Date', size: 120 },
          { accessorKey: 'employeeName', header: 'Emp Name', size: 80 },
          { accessorKey: 'category', header: 'Category', size: 120 },
          // { accessorKey: 'amount', header: 'Amount', size: 120 }
          // { accessorKey: 'placeofsupply', header: 'Place Of Supply', size: 80 },
          // { accessorKey: 'gsttype', header: 'Tax Type', size: 80 },
          // { accessorKey: 'gstpercent', header: 'Tax %', size: 80 },
          // { accessorKey: 'currency', header: 'Currency', size: 50 },
          {
            accessorKey: 'amount',
            header: 'Amount',
            size: 50,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%',color: 'red'}}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'totalAmount',
            header: 'Total Amount',
            size: 50,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          }
          // {
          //   accessorKey: 'rate',
          //   header: 'Rate',
          //   size: 80,
          //   Cell: ({ cell }) => (
          //     <div style={{ textAlign: 'right', width: '100%' }}>
          //       {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
          //     </div>
          //   ),
          //   muiTableHeadCellProps: {
          //     align: 'right'
          //   }
          // },
          // {
          //   accessorKey: 'billAmount',
          //   header: 'Bill Amt',
          //   size: 80,
          //   Cell: ({ cell }) => (
          //     <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
          //       {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
          //     </div>
          //   ),
          //   muiTableHeadCellProps: {
          //     align: 'right'
          //   }
          // },
          // {
          //   accessorKey: 'gstamount',
          //   header: 'Tax Amt',
          //   size: 80,
          //   Cell: ({ cell }) => (
          //     <div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
          //       {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
          //     </div>
          //   ),
          //   muiTableHeadCellProps: {
          //     align: 'right'
          //   }
          // },
          // {
          //   accessorKey: 'totalLcAmount',
          //   header: 'Total Amt',
          //   size: 80,
          //   Cell: ({ cell }) => (
          //     <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
          //       {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
          //     </div>
          //   ),
          //   muiTableHeadCellProps: {
          //     align: 'right'
          //   }
          // },
          // {
          //   accessorKey: 'totalchargeamountlc',
          //   header: 'Bill Amt(Base)',
          //   size: 80,
          //   Cell: ({ cell }) => (
          //     <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
          //       {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
          //     </div>
          //   ),
          //   muiTableHeadCellProps: {
          //     align: 'right'
          //   }
          // },
          // {
          //   accessorKey: 'totaltaxamountlc',
          //   header: 'Tax Amt(Base)',
          //   size: 80,
          //   Cell: ({ cell }) => (
          //     <div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
          //       {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
          //     </div>
          //   ),
          //   muiTableHeadCellProps: {
          //     align: 'right'
          //   }
          // },
          // {
          //   accessorKey: 'totalinvamountlc',
          //   header: 'Total Amt(Base)',
          //   size: 80,
          //   Cell: ({ cell }) => (
          //     <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
          //       {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
          //     </div>
          //   ),
          //   muiTableHeadCellProps: {
          //     align: 'right'
          //   }
          // },
          // { accessorKey: 'chargetype', header: 'Charge Type', size: 80 },
          // { accessorKey: 'chargename', header: 'Charge Name', size: 80 },
          // { accessorKey: 'chargecode', header: 'Charge Code', size: 80 },

          // { accessorKey: '', header: 'Particulars', size: 80 },
          // { accessorKey: 'remarks', header: 'Remarks', size: 80 },
          // { accessorKey: 'approvestatus', header: 'Approve Status', size: 80 }
        ]
      : [
          { accessorKey: 'docId', header: 'Doc Id', size: 100 },
          { accessorKey: 'docDate', header: 'Date', size: 100 },
          // { accessorKey: 'vId', header: 'Invoice No', size: 100 },
          // { accessorKey: 'vDate', header: 'Date', size: 100 },
          // { accessorKey: 'partyName', header: 'Category', size: 200 },
          // { accessorKey: 'placeofsupply', header: 'Place Of Supply', size: 100 },
          // {
          //   accessorKey: 'totalchargeamountlc',
          //   header: 'Bill Amt',
          //   size: 80,
          //   Cell: ({ cell }) => (
          //     <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
          //       {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
          //     </div>
          //   ),
          //   muiTableHeadCellProps: {
          //     align: 'right'
          //   }
          // },
          // {
          //   accessorKey: 'totaltaxamountlc',
          //   header: 'Tax Amt',
          //   size: 80,
          //   Cell: ({ cell }) => (
          //     <div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
          //       {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
          //     </div>
          //   ),
          //   muiTableHeadCellProps: {
          //     align: 'right'
          //   }
          // },
          // {
          //   accessorKey: 'totalinvamountlc',
          //   header: 'Total Amt',
          //   size: 80,
          //   Cell: ({ cell }) => (
          //     <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
          //       {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
          //     </div>
          //   ),
          //   muiTableHeadCellProps: {
          //     align: 'right'
          //   }
          // }
          { accessorKey: 'fromDate', header: 'From Date', size: 100 },
          { accessorKey: 'toDate', header: 'To Date', size: 100 },
          { accessorKey: 'employeeName', header: 'Employee Name', size: 100 },
          {
            accessorKey: 'totalAmount',
            header: 'Total Amount',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
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
    return formData.viewMode === 'details' ? ['amount', 'totalAmount'] : ['totalAmount'];
  };
  // const handleDownloadExcel = async () => {
  //   try {
  //     const logoBase64 = await getLogo();
  //     const workbook = new ExcelJS.Workbook();
  //     const reportType = formData.viewMode === 'details' ? 'Detailed Sales Report' : 'Summary Sales Report';

  //     const sheet = workbook.addWorksheet(reportType);
  //     let currentRow = 1;

  //     // Add logo if available
  //     if (logoBase64) {
  //       try {
  //         const logoId = workbook.addImage({
  //           base64: logoBase64,
  //           extension: 'png'
  //         });
  //         sheet.mergeCells('A1:A2');
  //         // No merging — place and size logo in A1 neatly
  //         sheet.addImage(logoId, {
  //           tl: { col: 0, row: 0 }, // top-left corner
  //           ext: { width: 90, height: 50 } // Logo size: adjust to your needs
  //         });

  //         // Optional: set row height and column width for better fit
  //         sheet.getRow(1).height = 28; // 20-30 is good
  //         sheet.getColumn(1).width = 18; // Only Column A (index 1)
  //       } catch (logoError) {
  //         console.error('Error adding logo:', logoError);
  //       }
  //     }
  //     sheet.mergeCells('B1:P1');
  //     // Company Name (Row 1, centered)
  //     const companyCell = sheet.getCell('B1');
  //     companyCell.value = companyName;
  //     companyCell.font = { bold: true, size: 14, color: { argb: '1F4E78' } };
  //     companyCell.alignment = {
  //       horizontal: 'center',
  //       vertical: 'middle',
  //       wrapText: true
  //     };
  //     sheet.mergeCells('B2:P2');
  //     // Report Title (Row 2, centered)
  //     const titleCell = sheet.getCell('B2');
  //     titleCell.value = reportType;
  //     titleCell.font = { size: 14, bold: true };
  //     titleCell.alignment = {
  //       horizontal: 'center',
  //       vertical: 'middle',
  //       wrapText: true
  //     };
  //     currentRow = 3;
  //     const formatDate = (dateString) => {
  //       if (!dateString) return '';
  //       const date = new Date(dateString);
  //       const day = String(date.getDate()).padStart(2, '0');
  //       const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  //       const year = date.getFullYear();
  //       return `${day}-${month}-${year}`;
  //     };
  //     // New parameters section
  //     const parameters = [];
  //     if (selectedSections.date) {
  //       parameters.push(`Date Range: ${formatDate(formData.fromDate)} to ${formatDate(formData.toDate)}`);
  //     }
  //     if (formData.branchCode) parameters.push(`Branch: ${formData.branchCode}`);
  //     if (formData.category) parameters.push(`Category: ${formData.category}`);

  //     if (parameters.length > 0) {
  //       //  Parameters heading
  //       // const paramHeading = sheet.addRow(['Report Parameters']);
  //       // paramHeading.font = { bold: true, color: { argb: '1F4E78' } };
  //       sheet.mergeCells(`A${currentRow}:P${currentRow}`);
  //       currentRow++;

  //       // Parameters values
  //       const paramsRow = sheet.addRow([parameters.join(' | ')]);
  //       paramsRow.font = { bold: true, color: { argb: 'black' } };
  //       sheet.mergeCells(`A${currentRow}:P${currentRow}`);
  //       currentRow++;

  //       // Empty row for spacing
  //       sheet.addRow([]);
  //       currentRow++;
  //     }

  //     // Timestamp
  //     const timestamp = `Generated on: ${dayjs().format('DD-MM-YYYY HH:mm:ss')}`;
  //     const timeRow = sheet.addRow([timestamp]);
  //     timeRow.font = { color: { argb: '7F7F7F' } };
  //     timeRow.alignment = { horizontal: 'right' };
  //     sheet.mergeCells(`A${currentRow}:P${currentRow}`);
  //     currentRow++;
  //     sheet.eachRow((row, currentRow) => {
  //       if (currentRow <= 6) return;
  //       row.eachCell((cell) => {
  //         cell.border = {
  //           top: { style: 'thin' },
  //           left: { style: 'thin' },
  //           bottom: { style: 'thin' },
  //           right: { style: 'thin' }
  //         };
  //       });
  //     });

  //     // Headers
  //     const headers =
  //       formData.viewMode === 'details'
  //         ? ['Doc ID', 'Doc Date', 'Emp Name', 'Category', 'Amount', 'Total Amount']
  //         : ['Doc ID', 'Doc Date', 'From Date', 'To Date', 'Emp Name', 'Total Amount'];

  //     const headerRow = sheet.addRow(headers);
  //     headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  //     headerRow.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: '1F4E78' }
  //     };
  //     headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  //     headerRow.height = 25;
  //     currentRow++;

  //     // Data Rows
  //     let dataStartRow = currentRow; // Remember where data starts

  //     // Details Report
  //     if (formData.viewMode === 'details') {
  //       const groups = rowData.reduce((acc, item) => {
  //         const key = item.docid;
  //         if (!acc[key]) acc[key] = [];
  //         acc[key].push(item);
  //         return acc;
  //       }, {});

  //       Object.entries(groups).forEach(([docid, items], groupIndex) => {
  //         const startRow = currentRow;

  //         items.forEach((item, idx) => {
  //           const row = [
  //             // groupIndex + 1,
  //             item.docId,
  //             dayjs(item.docdate).format('DD-MM-YYYY'),
  //             item.employeeName,
  //             item.category,
  //             item.amount,
  //             item.totalamount
  //           ];
  //           const dataRow = sheet.addRow(row);

  //           // Apply zebra striping
  //           dataRow.fill = {
  //             type: 'pattern',
  //             pattern: 'solid',
  //             fgColor: { argb: groupIndex % 2 === 0 ? 'F2F2F2' : 'FFFFFF' }
  //           };

  //           // Color coding
  //           dataRow.getCell('O').font = { color: { argb: 'FFFF0000' } }; // Tax - Red
  //           dataRow.getCell('P').font = { color: { argb: 'FF00B050' } }; // Total - Green

  //           // Format numbers
  //           dataRow.getCell('L').numFmt = '#,##0';
  //           dataRow.getCell('M').numFmt = '#,##0.00';
  //           dataRow.getCell('N').numFmt = '#,##0.00';
  //           dataRow.getCell('O').numFmt = '#,##0.00';
  //           dataRow.getCell('P').numFmt = '#,##0';

  //           currentRow++;
  //         });

  //         // Only merge if group has >1 row
  //         if (items.length > 1) {
  //           const endRow = currentRow - 1;
  //           for (let col = 1; col <= 6; col++) {
  //             const colChar = String.fromCharCode(64 + col);
  //             sheet.mergeCells(`${colChar}${startRow}:${colChar}${endRow}`);
  //             const cell = sheet.getCell(`${colChar}${startRow}`);
  //             cell.alignment = { vertical: 'middle', horizontal: 'center' };
  //           }
  //         }
  //       });
  //     }
  //     // Summary Report
  //     else {
  //       rowData.forEach((item, index) => {
  //         const row = sheet.addRow([
  //           // index + 1,
  //           item.docId,
  //           dayjs(item.docDate).format('DD-MM-YYYY'),
  //           dayjs(item.fromDate).format('DD-MM-YYYY'),
  //           dayjs(item.toDate).format('DD-MM-YYYY'),
  //           item.employeeName,
  //           item.totalAmount
  //         ]);

  //         // Apply zebra striping
  //         row.fill = {
  //           type: 'pattern',
  //           pattern: 'solid',
  //           fgColor: { argb: index % 2 === 0 ? 'F2F2F2' : 'FFFFFF' }
  //         };

  //         // Color coding
  //         row.getCell('I').font = { color: { argb: 'FFFF0000' } }; // Tax - Red
  //         row.getCell('J').font = { color: { argb: 'FF00B050' } }; // Total - Green

  //         // Format numbers
  //         row.getCell('H').numFmt = '#,##0.00'; // Amount
  //         row.getCell('I').numFmt = '#,##0.00'; // Total
  //         row.getCell('J').numFmt = '#,##0.00'; // Tax

  //         currentRow++;
  //       });
  //     }

  //     // Add totals
  //     const totals = rowData.reduce(
  //       (acc, item) => {
  //         acc.amount += Number(item.amount || 0);
  //         acc.totalAmount += Number(item.totalAmount || 0);
  //         // acc.totalCharge += Number(item.billAmount || 0);
  //         // acc.totalTax += Number(item.gstamount || 0);
  //         // acc.totalInvoice += Number(item.totalLcAmount || 0);
  //         return acc;
  //       },
  //       { amount: 0, totalAmount: 0 }
  //     );
  //     const totalSummary = rowData.reduce(
  //       (acc, item) => {
  //         acc.totalAmount += Number(item.totalAmount || 0);
  //         // acc.totaltaxamountlc += Number(item.totaltaxamountlc || 0);
  //         // acc.totalinvamountlc += Number(item.totalinvamountlc || 0);
  //         return acc;
  //       },
  //       { totalAmount: 0 }
  //     );
  //     const totalRow = sheet.addRow([]);

  //     if (formData.viewMode === 'details') {
  //       totalRow.values = ['Grand Total', '', '', '', totals.amount, totals.totalAmount];
  //       sheet.mergeCells(`A${currentRow}:J${currentRow}`);
  //     } else {
  //       totalRow.values = ['Grand Total', '', '', '', '', totalSummary.totalAmount];
  //       sheet.mergeCells(`A${currentRow}:H${currentRow}`);
  //     }

  //     // Style totals row
  //     totalRow.font = { bold: true };
  //     totalRow.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: 'DDEBF7' } // Light blue background
  //     };
  //     totalRow.getCell(1).alignment = { horizontal: 'right' };

  //     // Format totals numbers
  //     if (formData.viewMode === 'details') {
  //       totalRow.getCell('K').numFmt = '#,##0';
  //       totalRow.getCell('K').alignment = { horizontal: 'right' };
  //       ['P', 'L', 'M', 'N', 'O'].forEach((col) => {
  //         const cell = totalRow.getCell(col);
  //         cell.numFmt = '#,##0.00';
  //         cell.alignment = { horizontal: 'right' };
  //       });
  //       totalRow.getCell('L').font = { color: { argb: 'FFFF0000' } };
  //       totalRow.getCell('M').font = { color: { argb: 'FFFF0000' } };
  //       totalRow.getCell('N').font = { color: { argb: 'FFFF0000' } };
  //       totalRow.getCell('O').font = { color: { argb: 'FFFF0000' } };
  //       totalRow.getCell('P').font = { color: { argb: 'FF00B050' } };
  //     } else {
  //       ['I', 'J', 'H'].forEach((col) => {
  //         const cell = totalRow.getCell(col);
  //         cell.numFmt = '#,##0.00';
  //         cell.alignment = { horizontal: 'right' };
  //       });
  //       totalRow.getCell('I').font = { color: { argb: 'FFFF0000' } };
  //       totalRow.getCell('J').font = { color: { argb: 'FF00B050' } };
  //       // totalRow.getCell('L').font = { color: { argb: 'FF00B050' } };
  //     }
  //     currentRow++;

  //     // Set column widths and borders
  //     sheet.columns.forEach((column) => {
  //       column.width = 18;
  //       column.alignment = { vertical: 'middle' };
  //     });
  //     const buffer = await workbook.xlsx.writeBuffer();
  //     saveAs(new Blob([buffer]), `${reportType.replace(/\s+/g, '_')}.xlsx`);
  //   } catch (error) {
  //     console.error('Excel generation failed:', error);
  //     showToast('error', 'Failed to generate Excel file');
  //   }
  // };

  // handleDownoadPdf
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
    const { fromDate, toDate, branchCode, category, viewMode } = formData;
    doc.setFontSize(9);
    doc.setTextColor('#000000');
    doc.setFillColor(231, 235, 235);
    doc.roundedRect(2, 35, 206, 12, 2, 2, 'F');

    // Row 1: Labels
    doc.setFont(undefined, 'bold');
    doc.text('From Date', 8, 40);
    doc.text('To Date', 37, 40);
    doc.text('Category', 58, 40);
    doc.text('Branch Code', 153, 40);
    doc.text('View Mode', 184, 40);

    // Row 2: Values
    doc.setFont(undefined, 'normal');
    doc.text(dayjs(fromDate).format('DD-MM-YYYY'), 8, 45);
    doc.text(dayjs(toDate).format('DD-MM-YYYY'), 37, 45);
    doc.text(String(category ?? '-'), 58, 45);
    doc.text(String(branchCode ?? '-'), 153, 45);
    doc.text(String(viewMode.toUpperCase() ?? '-'), 184, 45);

    // 4) Build Table Body
    const headerLabels = columns.map((c) => c.header);

    const numericFields = columns.map((c) => c.accessorKey).filter((k) => k && /amount|totalAmount/i.test(k));

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
    // const totalFields = viewMode === 'details' ? ['amount', 'totalAmount'] : ['amount'];

    // const totalRow = columns.map((col, index) => {
    //   const key = col.accessorKey;
    //   if (index === 0) return 'Total';
    //   if (totalFields.includes(key)) {
    //     const sum = data.reduce((acc, row) => acc + (parseFloat(row[key]) || 0), 0);
    //     return sum.toLocaleString('en-IN');
    //   }
    //   return '';
    // });
    // body.push(totalRow);

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

        // Skip color change for total row
        // if (section === 'body' && row.raw !== totalRow) {
        //   if (['amount', 'totalAmount'].includes(key)) {
        //     cell.styles.textColor = [0, 128, 0];
        //   } else if (['gstamount', 'totaltaxamountlc'].includes(key)) {
        //     cell.styles.textColor = [255, 0, 0];
        //   } else if (['totalLcAmount', 'totalinvamountlc'].includes(key)) {
        //     cell.styles.textColor = [0, 128, 0];
        //   }
        // }

        if (section === 'body') {
          if (['amount'].includes(key)) {
            cell.styles.textColor = [0, 128, 0];
          } else if (['totalAmount'].includes(key)) {
            cell.styles.textColor = [255, 0, 0];
          } else if (['totalLcAmount', 'totalinvamountlc'].includes(key)) {
            cell.styles.textColor = [0, 128, 0];
          }
        }

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

  // const handleDownloadExcel = async () => {
  const handleDownloadExcel = async () => {
    try {
      const logoBase64 = await getLogo();
      const workbook = new ExcelJS.Workbook();
      const reportType = formData.viewMode === 'details' ? 'Detailed Cost Estimate Report' : 'Summary Cost Estimate Report';

      const sheet = workbook.addWorksheet(reportType);
      let currentRow = 1;

      // === LOGO ===
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

      // === COMPANY NAME ===
      sheet.mergeCells('B1:G1');
      const companyCell = sheet.getCell('B1');
      companyCell.value = companyName;
      companyCell.font = { bold: true, size: 14, color: { argb: '1F4E78' } };
      companyCell.alignment = { horizontal: 'center', vertical: 'middle' };

      // === REPORT TITLE ===
      sheet.mergeCells('B2:G2');
      const titleCell = sheet.getCell('B2');
      titleCell.value = reportType;
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

      currentRow = 3;

      // === PARAMETERS ===
      const formatDate = (d) => (d ? dayjs(d).format('DD-MM-YYYY') : '-');

      const parameters = [];
      if (selectedSections.date) {
        parameters.push(`Date Range: ${formatDate(formData.fromDate)} to ${formatDate(formData.toDate)}`);
      }
      if (formData.branchCode) parameters.push(`Branch: ${formData.branchCode}`);
      if (formData.category) parameters.push(`Category: ${formData.category}`);

      if (parameters.length > 0) {
        sheet.mergeCells(`A${currentRow}:G${currentRow}`);
        const paramRow = sheet.addRow([parameters.join(' | ')]);
        paramRow.font = { bold: true, color: { argb: '000000' } };
        currentRow += 2; // space after params
      }

      // === TIMESTAMP ===
      sheet.mergeCells(`A${currentRow}:G${currentRow}`);
      const timeRow = sheet.addRow([`Generated on: ${dayjs().format('DD-MM-YYYY HH:mm:ss')}`]);
      timeRow.font = { color: { argb: '7F7F7F' } };
      timeRow.alignment = { horizontal: 'right' };
      currentRow += 2;

      // === HEADERS ===
      const headers =
        formData.viewMode === 'details'
          ? ['Doc ID', 'Doc Date', 'Emp Name', 'Category', 'Amount', 'Total Amount']
          : ['Doc ID', 'Doc Date', 'From Date', 'To Date', 'Emp Name', 'Total Amount'];

      const headerRow = sheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1F4E78' }
      };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
      headerRow.height = 25;

      // === DATA ROWS ===
      rowData.forEach((item, index) => {
        const row =
          formData.viewMode === 'details'
            ? [item.docId, dayjs(item.docdate).format('DD-MM-YYYY'), item.employeeName, item.category, item.amount, item.totalAmount]
            : [
                item.docId,
                dayjs(item.docDate).format('DD-MM-YYYY'),
                dayjs(item.fromDate).format('DD-MM-YYYY'),
                dayjs(item.toDate).format('DD-MM-YYYY'),
                item.employeeName,
                item.totalAmount
              ];

        const dataRow = sheet.addRow(row);

        // Zebra striping
        dataRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: index % 2 === 0 ? 'F9F9F9' : 'FFFFFF' }
        };

        // Format numbers (last 1-2 columns are numeric)
        const amountCol = formData.viewMode === 'details' ? 5 : 6;
        const totalCol = formData.viewMode === 'details' ? 6 : 6;

        if (item.amount !== undefined) {
          dataRow.getCell(amountCol).numFmt = '#,##0.00';
          dataRow.getCell(amountCol).alignment = { horizontal: 'right' };
        }
        if (item.totalAmount !== undefined) {
          dataRow.getCell(totalCol).numFmt = '#,##0.00';
          dataRow.getCell(totalCol).alignment = { horizontal: 'right' };
        }
      });

      // === TOTALS ===
      // const totals = rowData.reduce(
      //   (acc, item) => {
      //     acc.amount += Number(item.amount || 0);
      //     acc.totalAmount += Number(item.totalAmount || 0);
      //     return acc;
      //   },
      //   { amount: 0, totalAmount: 0 }
      // );

      // const totalRow =
      //   formData.viewMode === 'details'
      //     ? sheet.addRow(['Grand Total', '', '', '', totals.amount, totals.totalAmount])
      //     : sheet.addRow(['Grand Total', '', '', '', '', totals.totalAmount]);

      // totalRow.font = { bold: true };
      // totalRow.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: 'DDEBF7' }
      // };

      // const lastCol = formData.viewMode === 'details' ? 6 : 6;
      // totalRow.getCell(lastCol).numFmt = '#,##0.00';
      // totalRow.getCell(lastCol).alignment = { horizontal: 'right' };

      // === FINAL FORMATTING ===
      sheet.columns.forEach((col) => {
        col.width = 18;
        col.alignment = { vertical: 'middle' };
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
     <ToastContainer />
      <div className="card w-full bg-base-100 shadow-xl" style={{ padding: '10px', borderRadius: '10px' }}>
        <>
          <div className="row">
            <div className="row">
              <div
                className="col-md-2
               mb-1"
              >
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.date} onChange={handleCheckboxChange} name="date" color="secondary" />}
                  label="Date"
                />
              </div>
              <div className="col-md-2 mb-1">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSections.employeeName}
                      onChange={handleCheckboxChange}
                      name="employeeName"
                      color="secondary"
                    />
                  }
                  label="Emp Name"
                />
              </div>
              <div className="col-md-2 mb-1">
                <FormControlLabel
                  control={
                    <Checkbox checked={selectedSections.category} onChange={handleCheckboxChange} name="category" color="secondary" />
                  }
                  label="Category"
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
              {/* <div className="col-md-3 mb-2">
                <div className="row d-flex ml">
                  <div className="d-flex flex-wrap justify-content-start mb-3 mt-1" style={{ marginBottom: '20px' }}>
                    <ActionButton title="Search" icon={SearchIcon} onClick={handleGo} isLoading={isLoading} />
                    <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
                  </div>
                </div>
              </div> */}
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
            {selectedSections.employeeName && (
              <div className="col-md-3 mb-2">
                <FormControl size="small" fullWidth error={!!fieldErrors.employeeName}>
                  <Autocomplete
                    size="small"
                    // Add "All" manually to the beginning of the list
                    options={['All', ...(employeeNameList?.map((e) => e.employeeName) || [])]}
                    getOptionLabel={(option) => option || ''}
                    value={formData.employeeName || 'All'}
                    onChange={(event, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        employeeName: newValue || 'All'
                      }));
                      setFieldErrors((prev) => ({
                        ...prev,
                        employeeName: ''
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Emp Name"
                        name="employeeName"
                        error={!!fieldErrors.employeeName}
                        helperText={fieldErrors.employeeName}
                      />
                    )}
                    isOptionEqualToValue={(option, value) => option === value}
                  />
                </FormControl>
              </div>
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
            {selectedSections.category && (
              <div className="col-md-3 mb-2">
                <Autocomplete
                  options={categoryOptions}
                  getOptionLabel={(option) => option.category || ''}
                  value={categoryOptions.find((option) => option.category === formData.category) || null}
                  onChange={(event, newValue) => {
                    const newCategory = newValue?.category || '';

                    // Update formData object
                    setFormData({
                      ...formData,
                      category: newCategory
                    });

                    // Update fieldErrors object
                    setFieldErrors({
                      ...fieldErrors,
                      category: newCategory ? '' : 'Category is required'
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Category"
                      label="Category"
                      size="small"
                      error={!!fieldErrors?.category}
                      helperText={fieldErrors?.category}
                    />
                  )}
                />
              </div>
            )}
            <div className="col-md-3 mb-2">
              {/* <div className="row d-flex ml"> */}
              {/* <div className="d-flex flex-wrap justify-content-start mb-3 mt-1" style={{ marginBottom: '20px' }}> */}
              <ActionButton title="Search" icon={SearchIcon} onClick={handleGo} isLoading={isLoading} />
              <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
              {/* </div> */}
              {/* </div> */}
            </div>
          </div>
        </>
      </div>
      <Dialog
        open={open}
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
          {formData.viewMode === 'details' ? 'Detailed Cost Estimate Report' : 'Summary Cost Estimate Report'}
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
        {/* <DialogContent>
          {rowData.length > 0 && (
            <CommonReportTableGrouped
              columns={getColumns()}
              data={rowData}
              fileName={`${formData.viewMode === 'details' ? 'Detailed' : 'Summary'} Cost Estimate Report`}
              handleDownloadExcel={handleDownloadExcel}
              // sumFields={getSumFields()}
              headerFields={headerFields}
              handleDownloadPDF={async () => {
                const logoBase64 = await getLogo();
                handleDownloadPdf({
                  logo: logoBase64,
                  columns: getColumns(),
                  data: rowData,
                  fileName: 'Cost Estimate Report',
                  userName,
                  formData
                });
              }}
            />
          )}
        </DialogContent> */}
        <DialogContent>
  {rowData.length > 0 ? (
    <CMRT2
      columns={getColumns()}
      data={rowData}
      fileName={`${formData.viewMode === 'details' ? 'Detailed' : 'Summary'} Cost Estimate Report`}
      handleDownloadExcel={handleDownloadExcel}
      // sumFields={getSumFields()}
      headerFields={headerFields}
      handleDownloadPdf={async () => {
        const logoBase64 = await getLogo();
        handleDownloadPdf({
          logo: logoBase64,
          columns: getColumns(),
          data: rowData,
          fileName: 'Cost Estimate Report',
          userName,
          formData
        });
      }}
    />
  ) : (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      No data found
    </div>
  )}
</DialogContent>

      </Dialog>
    </>
  );
}

export default CostEstimateReport;
