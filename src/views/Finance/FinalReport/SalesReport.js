import React from 'react';
import { TextField, Checkbox, Box, Typography, Button, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select, Radio, TableContainer, Switch, ButtonGroup } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownload from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  TableHead,
  Paper,
  Dialog,
  DialogContent,
} from '@mui/material';
import { IconButton } from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ClearIcon from '@mui/icons-material/Clear';
import ActionButton from 'utils/ActionButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { showToast } from 'utils/toast-component';
import { red } from '@mui/material/colors';

function SalesReport() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName'));
  const [open, setOpen] = useState(false);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [rowData, setRowData] = useState([]);
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
      try {
        let response;
        if (formData.viewMode === 'details') {
          if (formData.fromDate && formData.toDate) {
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
          if (formData.fromDate && formData.toDate) {
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
  const handleClose = () => {
    setOpen(false);
    setRowData([]);
  };
const handleDownloadExcel = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const reportType = formData.viewMode === 'details' 
      ? 'Detailed Sales Report' 
      : 'Summary Sales Report';
    
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
          '#', 'Doc ID', 'Date', 'Customer', 'Invoice No', 
          'Invoice Date', 'Supply Place', 'Charge Type',
          'Charge Code', 'Charge Name', 'Tax Type', 'Tax Percent', 'Qty', 'Rate', 
          'Amount', 'Tax', 'Total'
        ]
      : [
          '#', 'Doc ID', 'Date', 'Invoice No', 'Invoice Date', 
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

      Object.entries( groups).forEach(([docid, items], groupIndex) => {
        const startRow = currentRow;
        
        items.forEach((item, idx) => {
          const row = [
            groupIndex + 1,
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
          dataRow.getCell('P').font = { color: { argb: 'FFFF0000' } }; // Tax - Red
          dataRow.getCell('Q').font = { color: { argb: 'FF00B050' } }; // Total - Green
          
          // Format numbers
          dataRow.getCell('P').numFmt = '#,##0';
          dataRow.getCell('Q').numFmt = '#,##0.00';
          dataRow.getCell('M').numFmt = '#,##0.00';
          dataRow.getCell('N').numFmt = '#,##0.00';
          dataRow.getCell('O').numFmt = '#,##0.00'; 
          
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
        row.getCell('J').font = { color: { argb: 'FFFF0000' } }; // Tax - Red
        row.getCell('K').font = { color: { argb: 'FF00B050' } }; // Total - Green
        
        // Format numbers
        row.getCell('I').numFmt = '#,##0.00'; // Amount
        row.getCell('J').numFmt = '#,##0.00'; // Tax
        row.getCell('K').numFmt = '#,##0.00'; // Total
        
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
    }, { qty: 0,rate: 0, totalCharge: 0, totalTax: 0, totalInvoice: 0 });
    const totalSummary = rowData.reduce((acc, item) => {
    acc.totalchargeamountlc += Number(item.totalchargeamountlc || 0);
    acc.totaltaxamountlc += Number(item.totaltaxamountlc || 0);
    acc.totalinvamountlc += Number(item.totalinvamountlc || 0);
    return acc;
  }, { totalchargeamountlc: 0, totaltaxamountlc: 0, totalinvamountlc: 0});
    const totalRow = sheet.addRow([]);
    
    if (formData.viewMode === 'details') {
      totalRow.values = [
        'Grand Total', '', '', '', '', '', '', '', '', '', '','',
        totals.qty, 
        totals.rate,
        totals.totalCharge, 
        totals.totalTax, 
        totals.totalInvoice
      ];
      sheet.mergeCells(`A${currentRow}:J${currentRow}`);
    } else {
      totalRow.values = [
        'Grand Total', '', '', '', '', '', '', '',
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
      ['P','Q','M', 'N', 'O'].forEach(col => {
        const cell = totalRow.getCell(col);
        cell.numFmt = '#,##0.00';
        cell.alignment = { horizontal: 'right' };
      });
      totalRow.getCell('M').font = { color: { argb: 'FFFF0000' } };
      totalRow.getCell('N').font = { color: { argb: 'FFFF0000' } };
      totalRow.getCell('O').font = { color: { argb: 'FFFF0000' } };
      totalRow.getCell('P').font = { color: { argb: 'FFFF0000' } };
      totalRow.getCell('Q').font = { color: { argb: 'FF00B050' } };
    } else {
      ['I', 'J', 'K'].forEach(col => {
        const cell = totalRow.getCell(col);
        cell.numFmt = '#,##0.00';
        cell.alignment = { horizontal: 'right' };
      });
      totalRow.getCell('J').font = { color: { argb: 'FFFF0000' } };
      totalRow.getCell('K').font = { color: { argb: 'FF00B050' } };
      // totalRow.getCell('L').font = { color: { argb: 'FF00B050' } };
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
  }, { totalchargeamountlc: 0, totaltaxamountlc: 0, totalinvamountlc: 0});
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
              {/* )} */}
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
        <>
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xl"
            maxHeight="xl"
            fullScreen
            keepMounted
          // onEntered={() => setTimeout(handleDownloadExcel, 500)}
          >
            <DialogContent>
              <div
                id="main-content"
                style={{
                  padding: '0px',
                  width: '100%',
                  height: '100%',
                  margin: '0',
                  fontFamily: 'Roboto, Arial, sans-serif',
                  position: 'relative'
                }}
              >
                {/* Header buttons */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={0}
                >
                  <Typography variant="h6">Report</Typography>
                  {/* <Typography variant="h6">RIM Report</Typography>} */}

                  <Box display="flex" gap={0}>
                    <Button
                      variant="contained"
                      color="success"
                      disabled={rowData.length === 0}
                      size="small"
                      startIcon={<FileDownload />}
                      onClick={handleDownloadExcel}
                      sx={{
                        borderRadius: '20px',
                        px: 2,
                        textTransform: 'none',
                        bgcolor: '#388E3C',
                        color: '#FFF', // Set text color to white
                        '&:hover': { bgcolor: '#1B5E20', color: '#FFF' } // Ensure text remains white on hover
                      }}
                    >
                      Excel
                    </Button>
                    <IconButton onClick={handleClose} color="error">
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>
                <TableContainer
                  component={Paper}
                  sx={{
                    mt: 1,
                    borderRadius: 0,
                    border: '1px groove #000',
                    maxHeight: '80vh',
                    // maxWidth: 'xl',
                    overflow: 'auto'
                  }}
                >
                  <Table
                    size="large"
                    sx={{
                      '& td, & th': {
                        padding: '0.5px',
                        fontSize: '10px',
                        borderRight: '1px groove #000',
                        borderBottom: '1px groove #000',
                        '&:last-child': { borderRight: 'none' }
                      }
                    }}
                    stickyHeader
                  >
                    <TableHead>
                      <TableRow sx={{
                        borderBottom: '1px groove #000',
                        '& th': {
                          background: '#673ab7',
                          color: 'white',
                          fontWeight: '600',
                          borderRight: '1px groove rgba(0, 0, 0, 0.5)',
                          position: 'sticky',
                          top: 0,
                          zIndex: 10,

                        }
                      }}>
                        {
                          formData.viewMode === 'details' ? (
                            <>
                              <TableCell style={{ textAlign: 'center', width: '1%' }}>#</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Doc ID</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Date</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '4%' }}>Customer Name</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Invoice No</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Invoice Date</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Place of Supply</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Charge Type</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Charge Code</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Charge Name</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Tax Type</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '1%' }}>Tax Percent</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '1%' }}>Qty</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '1%' }}>Rate</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Charge Amount</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '1%' }}>Tax Amount</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '1%' }}>Total Amount</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell style={{ textAlign: 'center', width: '1%' }}>#</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '8%' }}>Doc Id</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '8%' }}>Date</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '6%' }}>Invoice No</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '6%' }}>Invoice Date</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '6%' }}>Tax Type</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '5%' }}>Customer Name</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '4%' }}>Place of Supply</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '6%' }}>Bill Amt</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '6%' }}>Tax Amt</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '6%' }}>Total Amt</TableCell>
                            </>
                          )
                        }
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.viewMode === 'details'
                        ? Object.entries(
                          rowData.reduce((groups, item) => {
                            const { docid } = item;
                            if (!groups[docid]) groups[docid] = [];
                            groups[docid].push(item);
                            return groups;
                          }, {})
                        ).map(([docid, items], groupIndex) => (
                          <React.Fragment key={docid}>
                            {items.map((item, itemIndex) => (
                              <TableRow key={`${docid}-${itemIndex}`}>
                                {/* Group-level (rowSpan) */}
                                {itemIndex === 0 && (
                                  <>
                                    <TableCell rowSpan={items.length} align="center">
                                      {groupIndex + 1}
                                    </TableCell>
                                    <TableCell rowSpan={items.length}>
                                      {item.docid}
                                    </TableCell>
                                    <TableCell rowSpan={items.length}>
                                      {item.docdate
                                        ? dayjs(item.docdate).format('DD-MM-YYYY')
                                        : 'N/A'}
                                    </TableCell>
                                    <TableCell rowSpan={items.length}>{item.partyname}</TableCell>
                                    <TableCell rowSpan={items.length}>
                                      {item.Vid || 'N/A'}
                                    </TableCell>
                                    <TableCell rowSpan={items.length}>
                                      {item.Vdate
                                        ? dayjs(item.Vdate).format('DD-MM-YYYY')
                                        : 'N/A'}
                                    </TableCell>
                                    <TableCell rowSpan={items.length}>{item.placeofsupply}</TableCell>
                                  </>
                                )}

                                {/* Line-level */}
                                <TableCell>{item.chargetype}</TableCell>
                                <TableCell>{item.chargecode}</TableCell>
                                <TableCell>{item.chargename}</TableCell>
                                <TableCell>{item.gsttype}</TableCell>
                                <TableCell>{item.gstpercent}</TableCell>
                                <TableCell align="center">{item.qty}</TableCell>
                                <TableCell align="right" sx={{ pl: '2px' }}>{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right">{item.billAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right">{item.gstamount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right">{item.totalLcAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ))
                        : rowData.map((transaction, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell>{transaction.docId}</TableCell>
                            <TableCell align="center">{dayjs(transaction.docdate).format('DD-MM-YYYY')}</TableCell>
                            <TableCell>{transaction.vId}</TableCell>
                            <TableCell align="center">{dayjs(transaction.vDate).format('DD-MM-YYYY')}</TableCell>
                            <TableCell align="center">{transaction.gstType}</TableCell>
                            <TableCell>{transaction.partyName || '-'}</TableCell>
                            <TableCell>{transaction.placeofsupply || '-'}</TableCell>
                            <TableCell align="right">{Number(transaction.totalchargeamountlc).toLocaleString('en-IN')}</TableCell>
                            <TableCell align="right">{Number(transaction.totaltaxamountlc).toLocaleString('en-IN')}</TableCell>
                            <TableCell align="right">{Number(transaction.totalinvamountlc).toLocaleString('en-IN')}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                        {formData.viewMode === 'details' ? (
                          <>
                            <TableCell colSpan={12} align="right" sx={{ fontWeight: 700, padding: '10px', pr: '20px' }}>
                              Grand Total
                            </TableCell>
                            <TableCell align="center" style={{color: 'red'}}>{totals.qty}</TableCell>
                            <TableCell align="right" style={{color: 'red'}}>{totals.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                            <TableCell align="right" style={{color: 'red'}}>{totals.totalCharge.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                            <TableCell align="right" style={{color: 'red'}}>{totals.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                            <TableCell align="right" style={{color: 'red'}}>{totals.totalInvoice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell colSpan={8} align="right" sx={{ fontWeight: 700 }}>
                              Grand Total
                            </TableCell>
                            <TableCell align="right" style={{color: 'red'}}>{totalSummary.totalchargeamountlc.toLocaleString('en-IN')}</TableCell>
                            <TableCell align="right" style={{color: 'red'}}>{totalSummary.totaltaxamountlc.toLocaleString('en-IN')}</TableCell>
                            <TableCell align="right" style={{color: 'red'}}>{totalSummary.totalinvamountlc.toLocaleString('en-IN')}</TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </div>
            </DialogContent>
          </Dialog>
        </>
      </div>
    </>
  )
}
export default SalesReport;
