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
import CommonReportTableGrouped from '../../../utils/CommonReportTableGrouped';
import ActionButton from 'utils/ActionButton';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
function SalesReport() {
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
  const [headerFields, setHeaderFields] = useState([]);
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
  // const handleSelectPartyChange = (e) => {
  //   const value = e.target.value;
  //   console.log('Selected employeeCode value:', value);
  //   const selectedEmp = partyNameList.find((emp) => emp.partyName === value);
  //   if (value === 'All') {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       customer: 'All'
  //     }));
  //   } else {
  //     if (selectedEmp) {
  //       console.log('Selected party:', selectedEmp);
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         customer: selectedEmp.partyName
  //       }));
  //     } else {
  //       console.log('No party found with the given code:', value);
  //     }
  //   }
  // };
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
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
    setFieldErrors((prevData) => ({
      ...prevData,
      [field]: ''
    }));
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
    if (selectedSections.customer) {
      if (!formData.customer) {
        errors.customer = 'Customer name is required';
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
              `/taxInvoice/getTaxinvoiceDetails?branchCode=${formData.branchCode}&fromDate=${formData.fromDate}&finYear=${finYear}&orgId=${orgId}&partyname=${formData.customer}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/taxInvoice/getTaxinvoiceDetails?branchCode=${formData.branchCode}&orgId=${orgId}&partyname=${formData.customer}&finYear=${finYear}`
            );
          }
        } else {
          if (selectedSections.date) {
            response = await apiCalls(
              'get',
              `/taxInvoice/getTaxinvoiceSummary?branchCode=${formData.branchCode}&fromDate=${formData.fromDate}&finYear=${finYear}&orgId=${orgId}&partyname=${formData.customer}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/taxInvoice/getTaxinvoiceSummary?branchCode=${formData.branchCode}&orgId=${orgId}&partyname=${formData.customer}&finYear=${finYear}`
            );
          }
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.mapp.reverse() || []);
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
        { accessorKey: 'docid', header: 'Doc ID', size: 80 },
        { accessorKey: 'docdate', header: 'Date', size: 80 },
        { accessorKey: 'Vid', header: 'Invoice No', size: 80 },
        { accessorKey: 'Vdate', header: 'Invoice Date', size: 120 },
        { accessorKey: 'partyname', header: 'Customer', size: 120 },
        // { accessorKey: 'placeofsupply', header: 'Place Of Supply', size: 80 },
        // { accessorKey: 'gsttype', header: 'Tax Type', size: 80 },
        // { accessorKey: 'gstpercent', header: 'Tax %', size: 80 },
        { accessorKey: 'currency', header: 'Currency', size: 50 },
        {
          accessorKey: 'qty',
          header: 'Qty',
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
          accessorKey: 'rate',
          header: 'Rate',
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
          accessorKey: 'billAmount',
          header: 'Bill Amt',
          size: 80,
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
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
            <div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
              {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
            </div>
          ),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'totalLcAmount',
          header: 'Total Amt',
          size: 80,
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
              {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
            </div>
          ),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'totalchargeamountlc',
          header: 'Bill Amt(Base)',
          size: 80,
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
              {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
            </div>
          ),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'totaltaxamountlc',
          header: 'Tax Amt(Base)',
          size: 80,
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
              {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
            </div>
          ),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'totalinvamountlc',
          header: 'Total Amt(Base)',
          size: 80,
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
              {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
            </div>
          ),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        { accessorKey: 'chargetype', header: 'Charge Type', size: 80 },
        { accessorKey: 'chargename', header: 'Charge Name', size: 80 },
        { accessorKey: 'chargecode', header: 'Charge Code', size: 80 }
      ]
      : [
        { accessorKey: 'docId', header: 'Doc Id', size: 100 },
        { accessorKey: 'docDate', header: 'Date', size: 100 },
        { accessorKey: 'vId', header: 'Invoice No', size: 90 },
        { accessorKey: 'vDate', header: 'Date', size: 90 },
        { accessorKey: 'partyName', header: 'Customer', size: 100 },
        { accessorKey: 'placeofsupply', header: 'Place Of Supply', size: 70 },
        {
          accessorKey: 'totalchargeamountlc',
          header: 'Bill Amt',
          size: 60,
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
              {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
            </div>
          ),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        // {
        //   accessorKey: 'totaltaxamountlc',
        //   header: 'Tax Amt',
        //   size: 60,
        //   Cell: ({ cell }) => (
        //     <div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
        //       {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
        //     </div>
        //   ),
        //   muiTableHeadCellProps: {
        //     align: 'right'
        //   }
        // },
        {
          accessorKey: 'igst',
          header: 'IGST',
          size: 60,
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
              {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
            </div>
          ),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'cgst',
          header: 'CGST',
          size: 60,
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
              {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
            </div>
          ),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'sgst',
          header: 'SGST',
          size: 60,
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
              {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
            </div>
          ),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'totalinvamountlc',
          header: 'Total Amt',
          size: 60,
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
    return formData.viewMode === 'details'
      ? ['totalchargeamountlc', 'totaltaxamountlc', 'totalinvamountlc']
      : ['totalchargeamountlc', 'totaltaxamountlc', 'totalinvamountlc'];
  };
  const handleDownloadExcel = async () => {
    try {
      const logoBase64 = await getLogo();
      const workbook = new ExcelJS.Workbook();
      const reportType = formData.viewMode === 'details' ? 'Detailed Sales Report' : 'Summary Sales Report';
      const sheet = workbook.addWorksheet(reportType);
      let currentRow = 1;

      // ======= HEADER + LOGO =======
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

      sheet.mergeCells('B1:P1');
      const companyCell = sheet.getCell('B1');
      companyCell.value = companyName;
      companyCell.font = { bold: true, size: 14, color: { argb: '1F4E78' } };
      companyCell.alignment = { horizontal: 'center', vertical: 'middle' };

      sheet.mergeCells('B2:P2');
      const titleCell = sheet.getCell('B2');
      titleCell.value = reportType;
      titleCell.font = { size: 14, bold: true };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      currentRow = 3;

      // ======= PARAMETERS & TIMESTAMP =======
      const parameters = [];
      if (selectedSections.date) {
        const formatDate = (d) => (d ? dayjs(d).format('DD-MM-YYYY') : '');
        parameters.push(`Date Range: ${formatDate(formData.fromDate)} to ${formatDate(formData.toDate)}`);
      }
      if (formData.branchCode) parameters.push(`Branch: ${formData.branchCode}`);
      if (formData.customer) parameters.push(`Customer: ${formData.customer}`);
      if (parameters.length > 0) {
        const paramRow = sheet.addRow([parameters.join(' | ')]);
        paramRow.font = { bold: true, color: { argb: '000000' } };
        sheet.mergeCells(`A${currentRow}:P${currentRow}`);
        currentRow++;
        sheet.addRow([]);
        currentRow++;
      }

      const timestamp = `Generated on: ${dayjs().format('DD-MM-YYYY HH:mm:ss')}`;
      const timeRow = sheet.addRow([timestamp]);
      timeRow.font = { color: { argb: '7F7F7F' } };
      timeRow.alignment = { horizontal: 'right' };
      sheet.mergeCells(`A${currentRow}:P${currentRow}`);
      currentRow++;

      // ======= HEADERS =======
      const headers =
        formData.viewMode === 'details'
          ? [
            'Doc ID',
            'Date',
            'Customer',
            'Invoice No',
            'Invoice Date',
            'Supply Place',
            'Charge Type',
            'Charge Code',
            'Charge Name',
            'Tax Type',
            'Tax Percent',
            'Qty',
            'Rate',
            'Amount',
            'Tax',
            'Total'
          ]
          : [
            'Doc ID',
            'Date',
            'Invoice No',
            'Invoice Date',
            'Tax Type',
            'Customer',
            'Supply Place',
            'Amount',
            'IGST',
            'CGST',
            'SGST',
            'Total'
          ];

      const headerRow = sheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
      headerRow.height = 25;
      currentRow++;

      // ======= DATA ROWS =======
      if (formData.viewMode === 'details') {
        rowData.forEach((item, index) => {
          const row = sheet.addRow([
            item.docid,
            dayjs(item.docdate).format('DD-MM-YYYY'),
            item.partyname,
            item.Vid || '-',
            dayjs(item.Vdate).format('DD-MM-YYYY'),
            item.placeofsupply,
            item.chargetype,
            item.chargecode,
            item.chargename,
            item.gsttype,
            item.gstpercent,
            item.qty,
            item.rate,
            item.billAmount,
            item.gstamount,
            item.totalLcAmount
          ]);

          // Zebra striping
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: index % 2 === 0 ? 'F2F2F2' : 'FFFFFF' }
          };

          // ✅ Numeric formatting + color highlight
          ['M', 'N', 'O', 'P'].forEach((col, i) => {
            const cell = row.getCell(col);
            cell.numFmt = '#,##0.00';
            cell.alignment = { horizontal: 'right' };
            if (col === 'O') cell.font = { color: { argb: 'FFFF0000' } }; // Tax - Red
            if (col === 'P') cell.font = { color: { argb: 'FF00B050' } }; // Total - Green
          });
        });
      } else {
        rowData.forEach((item, index) => {
          const row = sheet.addRow([
            item.docId,
            dayjs(item.docdate).format('DD-MM-YYYY'),
            item.vId || '-',
            dayjs(item.vDate).format('DD-MM-YYYY'),
            item.gstType,
            item.partyName,
            item.placeofsupply,
            item.totalchargeamountlc,
            item.igst,
            item.cgst,
            item.sgst,
            item.totalinvamountlc
          ]);

          // Zebra striping
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: index % 2 === 0 ? 'F9F9F9' : 'FFFFFF' }
          };

          // ✅ Numeric formatting + color highlight
          ['H', 'I', 'J', 'K', 'L'].forEach((col) => {
            const cell = row.getCell(col);
            cell.numFmt = '#,##0.00';
            cell.alignment = { horizontal: 'right' };
            if (['I', 'J', 'K'].includes(col)) cell.font = { color: { argb: 'FFFF0000' } }; // Tax fields - Red
            if (col === 'L') cell.font = { color: { argb: 'FF00B050' } }; // Total - Green
          });
        });
      }

      // ======= GRAND TOTAL =======
      const totalRow = sheet.addRow([]);
      totalRow.font = { bold: true };
      totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDEBF7' } };

      if (formData.viewMode === 'details') {
        totalRow.values = [
          'Grand Total',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          rowData.reduce((a, b) => a + (b.billAmount || 0), 0),
          rowData.reduce((a, b) => a + (b.gstamount || 0), 0),
          rowData.reduce((a, b) => a + (b.totalLcAmount || 0), 0)
        ];
        sheet.mergeCells(`A${totalRow.number}:M${totalRow.number}`);
      } else {
        totalRow.values = [
          'Grand Total',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          rowData.reduce((a, b) => a + (b.igst || 0), 0),
          rowData.reduce((a, b) => a + (b.cgst || 0), 0),
          rowData.reduce((a, b) => a + (b.sgst || 0), 0),
          rowData.reduce((a, b) => a + (b.totalinvamountlc || 0), 0)
        ];
        sheet.mergeCells(`A${totalRow.number}:H${totalRow.number}`);
      }

      // Style numeric columns in total
      totalRow.eachCell((cell) => {
        cell.numFmt = '#,##0.00';
        cell.alignment = { horizontal: 'right' };
      });

      totalRow.getCell(1).alignment = { horizontal: 'right' };
      totalRow.getCell(1).font = { bold: true, color: { argb: '1F4E78' } };

      // ======= BORDERS + LAYOUT =======
      sheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'BFBFBF' } },
            left: { style: 'thin', color: { argb: 'BFBFBF' } },
            bottom: { style: 'thin', color: { argb: 'BFBFBF' } },
            right: { style: 'thin', color: { argb: 'BFBFBF' } }
          };
        });
      });

      // Auto column width
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
    doc.text(String(viewMode.toUpperCase() ?? '-'), 184, 45);

    // 4) Build Table Body
    const headerLabels = columns.map((c) => c.header);
    const numericFields = columns
      .map((c) => c.accessorKey)
      .filter((k) => k && /(billAmount|totalchargeamountlc|gstamount|totaltaxamountlc|totalLcAmount|totalinvamountlc)/i.test(k));

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
      viewMode === 'details'
        ? ['billAmount', 'gstamount', 'totalLcAmount']
        : ['totalchargeamountlc', 'igst', 'cgst', 'sgst', 'totalinvamountlc'];

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

        // Skip color change for total row
        if (section === 'body' && row.raw !== totalRow) {
          if (['billAmount', 'totalchargeamountlc'].includes(key)) {
            cell.styles.textColor = [0, 128, 0];
          } else if (['gstamount', 'totaltaxamountlc'].includes(key)) {
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
            {/* {selectedSections.customer && (
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
            )} */}
            {/*  */}
            {selectedSections.customer && (
              <div className="col-md-3 mb-2">
                <FormControl size="small" fullWidth error={!!fieldErrors.customer}>
                  <Autocomplete
                    size="small"
                    options={[{ partyName: 'All' }, ...(partyNameList || [])]}
                    getOptionLabel={(option) => option?.partyName || ''}
                    value={
                      partyNameList?.find((item) => item.partyName === formData.customer) ||
                      (formData.customer === 'All' ? { partyName: 'All' } : null)
                    }
                    onChange={(event, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        customer: newValue ? newValue.partyName : ''
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer"
                        name="customer"
                        error={!!fieldErrors.customer}
                        helperText={fieldErrors.customer}
                      />
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
          {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6"> */}
          {formData.viewMode === 'details' ? 'Detailed Sales Report' : 'Summary Sales Report'}
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
              fileName={`${formData.viewMode === 'details' ? 'Detailed' : 'Summary'} Sales Report`}
              handleDownloadExcel={handleDownloadExcel}
              // sumFields={getSumFields()}
              headerFields={headerFields}
              handleDownloadPDF={async () => {
                const logoBase64 = await getLogo();
                handleDownloadPdf({
                  logo: logoBase64,
                  columns: getColumns(),
                  data: rowData,
                  fileName: 'Sales Report',
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

export default SalesReport;
