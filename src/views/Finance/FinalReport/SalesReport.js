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

function SalesReport() {
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
    setOpen(false);
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
    console.log("go error", errors);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if (formData.viewMode === 'details') {
          if (selectedSections.date) {
            response = await apiCalls(
              'get',
              `/taxInvoice/getTaxinvoiceDetails?branchCode=${formData.branchCode}&finYear=${finYear}&fromDate=${formData.fromDate}&orgId=${orgId}&partyname=${formData.customer}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/taxInvoice/getTaxinvoiceDetails?branchCode=${formData.branchCode}&finYear=${finYear}&orgId=${orgId}&partyname=${formData.customer}`
            );
          }
        } else {
          if (selectedSections.date) {
            response = await apiCalls(
              'get',
              `/taxInvoice/getTaxinvoiceSummary?branchCode=${formData.branchCode}&finYear=${finYear}&fromDate=${formData.fromDate}&orgId=${orgId}&partyname=${formData.customer}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/taxInvoice/getTaxinvoiceSummary?branchCode=${formData.branchCode}&finYear=${finYear}&orgId=${orgId}&partyname=${formData.customer}`
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
          setHeaderFields(newHeaderFields)
        } else {
          showToast('error', response.paramObjectsMap.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', "Report fetch Failed");
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
        { accessorKey: 'placeofsupply', header: 'Place Of Supply', size: 80 },
        { accessorKey: 'gsttype', header: 'Tax Type', size: 80 },
        { accessorKey: 'chargetype', header: 'Charge Type', size: 80 },
        { accessorKey: 'chargename', header: 'Charge Name', size: 80 },
        { accessorKey: 'chargecode', header: 'Charge Code', size: 80 },
        { accessorKey: 'gstpercent', header: 'Tax %', size: 80 },
        { accessorKey: 'currency', header: 'Currency', size: 80 },
        {
          accessorKey: 'qty', header: 'Qty', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'rate', header: 'Rate', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'billAmount', header: 'Bill Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'gstamount', header: 'Tax Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'totalLcAmount', header: 'Total Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
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
        { accessorKey: 'vId', header: 'Invoice No', size: 100 },
        { accessorKey: 'vDate', header: 'Date', size: 100 },
        { accessorKey: 'partyName', header: 'Customer', size: 200 },
        { accessorKey: 'placeofsupply', header: 'Place Of Supply', size: 100 },
        {
          accessorKey: 'totalchargeamountlc', header: 'Bill Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'totaltaxamountlc', header: 'Tax Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        },
        {
          accessorKey: 'totalinvamountlc', header: 'Total Amt', size: 80, Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN')
              : '-'}
          </div>),
          muiTableHeadCellProps: {
            align: 'right'
          }
        }
      ];
  };

  const getSumFields = () => {
    return formData.viewMode === 'details'
      ? ['billAmount', 'gstamount', 'totalLcAmount']
      : ['totalchargeamountlc', 'totaltaxamountlc', 'totalinvamountlc'];
  };
  const handleDownloadExcel = async () => {
    try {
      const logoBase64 = await getLogo();
      const workbook = new ExcelJS.Workbook();
      const reportType = formData.viewMode === 'details'
        ? 'Detailed Sales Report'
        : 'Summary Sales Report';

      const sheet = workbook.addWorksheet(reportType);
      let currentRow = 1;

      // Add logo if available
      if (logoBase64) {
        try {
          const logoId = workbook.addImage({
            base64: logoBase64,
            extension: 'png',
          });
          sheet.mergeCells('A1:A2');
          // No merging — place and size logo in A1 neatly
          sheet.addImage(logoId, {
            tl: { col: 0, row: 0 },  // top-left corner
            ext: { width: 90, height: 50 },  // Logo size: adjust to your needs
          });

          // Optional: set row height and column width for better fit
          sheet.getRow(1).height = 28;   // 20-30 is good
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
        wrapText: true,
      };
      sheet.mergeCells('B2:P2');
      // Report Title (Row 2, centered)
      const titleCell = sheet.getCell('B2');
      titleCell.value = reportType;
      titleCell.font = { size: 14, bold: true };
      titleCell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      currentRow = 3;
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
      if (selectedSections.date) {
        parameters.push(
          `Date Range: ${formatDate(formData.fromDate)} to ${formatDate(formData.toDate)}`
        );
      }
      if (formData.branchCode) parameters.push(`Branch: ${formData.branchCode}`);
      if (formData.customer) parameters.push(`Customer: ${formData.customer}`);

      if (parameters.length > 0) {
        //  Parameters heading
        // const paramHeading = sheet.addRow(['Report Parameters']);
        // paramHeading.font = { bold: true, color: { argb: '1F4E78' } };
        sheet.mergeCells(`A${currentRow}:P${currentRow}`);
        currentRow++;

        // Parameters values
        const paramsRow = sheet.addRow([parameters.join(' | ')]);
        paramsRow.font = { bold: true, color: { argb: 'black' } };
        sheet.mergeCells(`A${currentRow}:P${currentRow}`);
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
      sheet.mergeCells(`A${currentRow}:P${currentRow}`);
      currentRow++;
      sheet.eachRow((row, currentRow) => {
        if (currentRow <= 6) return;
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // Headers
      const headers = formData.viewMode === 'details'
        ? [
          'Doc ID', 'Date', 'Customer', 'Invoice No',
          'Invoice Date', 'Supply Place', 'Charge Type',
          'Charge Code', 'Charge Name', 'Tax Type', 'Tax Percent', 'Qty', 'Rate',
          'Amount', 'Tax', 'Total'
        ]
        : [
          'Doc ID', 'Date', 'Invoice No', 'Invoice Date',
          'Tax Type', 'Customer', 'Supply Place',
          'Amount', 'Tax', 'Total'
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
          const key = item.docid;
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

        Object.entries(groups).forEach(([docid, items], groupIndex) => {
          const startRow = currentRow;

          items.forEach((item, idx) => {
            const row = [
              // groupIndex + 1,
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

            // Format numbers
            dataRow.getCell('L').numFmt = '#,##0';
            dataRow.getCell('M').numFmt = '#,##0.00';
            dataRow.getCell('N').numFmt = '#,##0.00';
            dataRow.getCell('O').numFmt = '#,##0.00';
            dataRow.getCell('P').numFmt = '#,##0';

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
            // index + 1,
            item.docId,
            dayjs(item.docdate).format('DD-MM-YYYY'),
            item.vId || '-',
            dayjs(item.vDate).format('DD-MM-YYYY'),
            item.gstType,
            item.partyName,
            item.placeofsupply,
            item.totalchargeamountlc,
            item.totaltaxamountlc,
            item.totalinvamountlc
          ]);

          // Apply zebra striping
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: index % 2 === 0 ? 'F2F2F2' : 'FFFFFF' }
          };

          // Color coding
          row.getCell('I').font = { color: { argb: 'FFFF0000' } }; // Tax - Red
          row.getCell('J').font = { color: { argb: 'FF00B050' } }; // Total - Green

          // Format numbers
          row.getCell('H').numFmt = '#,##0.00'; // Amount
          row.getCell('I').numFmt = '#,##0.00'; // Total
          row.getCell('J').numFmt = '#,##0.00'; // Tax

          currentRow++;
        });
      }

      // Add totals
      const totals = rowData.reduce((acc, item) => {
        acc.qty += Number(item.qty || 0);
        acc.rate += Number(item.rate || 0);
        acc.totalCharge += Number(item.billAmount || 0);
        acc.totalTax += Number(item.gstamount || 0);
        acc.totalInvoice += Number(item.totalLcAmount || 0);
        return acc;
      }, { qty: 0, rate: 0, totalCharge: 0, totalTax: 0, totalInvoice: 0 });
      const totalSummary = rowData.reduce((acc, item) => {
        acc.totalchargeamountlc += Number(item.totalchargeamountlc || 0);
        acc.totaltaxamountlc += Number(item.totaltaxamountlc || 0);
        acc.totalinvamountlc += Number(item.totalinvamountlc || 0);
        return acc;
      }, { totalchargeamountlc: 0, totaltaxamountlc: 0, totalinvamountlc: 0 });
      const totalRow = sheet.addRow([]);

      if (formData.viewMode === 'details') {
        totalRow.values = [
          'Grand Total', '', '', '', '', '', '', '', '', '', '',
          totals.qty,
          totals.rate,
          totals.totalCharge,
          totals.totalTax,
          totals.totalInvoice
        ];
        sheet.mergeCells(`A${currentRow}:J${currentRow}`);
      } else {
        totalRow.values = [
          'Grand Total', '', '', '', '', '', '',
          totalSummary.totalchargeamountlc,
          totalSummary.totaltaxamountlc,
          totalSummary.totalinvamountlc
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
        ['P', 'L', 'M', 'N', 'O'].forEach(col => {
          const cell = totalRow.getCell(col);
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
        });
        totalRow.getCell('L').font = { color: { argb: 'FFFF0000' } };
        totalRow.getCell('M').font = { color: { argb: 'FFFF0000' } };
        totalRow.getCell('N').font = { color: { argb: 'FFFF0000' } };
        totalRow.getCell('O').font = { color: { argb: 'FFFF0000' } };
        totalRow.getCell('P').font = { color: { argb: 'FF00B050' } };
      } else {
        ['I', 'J', 'H'].forEach(col => {
          const cell = totalRow.getCell(col);
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
        });
        totalRow.getCell('I').font = { color: { argb: 'FFFF0000' } };
        totalRow.getCell('J').font = { color: { argb: 'FF00B050' } };
        // totalRow.getCell('L').font = { color: { argb: 'FF00B050' } };
      }
      currentRow++;

      // Set column widths and borders
      sheet.columns.forEach(column => {
        column.width = 18;
        column.alignment = { vertical: 'middle' };
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
          {formData.viewMode === 'details' ? 'Detailed Sales Report' : 'Summary Sales Report'}
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
              fileName={`${formData.viewMode === 'details' ? 'Detailed' : 'Summary'} Sales Report`}
              handleDownloadExcel={handleDownloadExcel}
              sumFields={getSumFields()}
              headerFields={headerFields}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SalesReport;