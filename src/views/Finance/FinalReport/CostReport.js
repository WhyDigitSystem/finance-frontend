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

function CostReport() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
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
    vendor: false,
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
    vendor: 'All',
    viewMode: 'details',
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branchCode: '',
    vendor: '',
  });
  const handleClear = () => {
    setFormData({
      fromDate: null,
      toDate: null,
      branchCode: 'All',
      vendor: 'All',
      viewMode: 'details',
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      vendor: '',
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
        vendor: "All",
      }));
    } else {
      if (selectedEmp) {
        console.log('Selected party:', selectedEmp);
        setFormData((prevData) => ({
          ...prevData,
          vendor: selectedEmp.partyName,
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
    console.log("go error", errors);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if (formData.viewMode === 'details') {
          if (formData.fromDate && formData.toDate) {
            response = await apiCalls(
              'get',
              `/taxInvoice/getTaxinvoiceDetails?branchCode=${formData.branchCode}&finYear=${finYear}&fromDate=${formData.fromDate}&orgId=${orgId}&partyname=${formData.vendor}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/taxInvoice/getTaxinvoiceDetails?branchCode=${formData.branchCode}&finYear=${finYear}&orgId=${orgId}&partyname=${formData.vendor}`
            );
          }
        } else {
          if (formData.fromDate && formData.toDate) {
            response = await apiCalls(
              'get',
              `/taxInvoice/getTaxinvoiceSummary?branchCode=${formData.branchCode}&finYear=${finYear}&fromDate=${formData.fromDate}&orgId=${orgId}&partyname=${formData.vendor}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/taxInvoice/getTaxinvoiceSummary?branchCode=${formData.branchCode}&finYear=${finYear}&orgId=${orgId}&partyname=${formData.vendor}`
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
        showToast('error', rowData.paramObjectsMap.message);
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
      const sheet = workbook.addWorksheet('Report');
      const reportType = formData.type === 'MIM' ? 'MIM Report' : 'RIM Report';

      // Title and headers
      const titleRow = sheet.addRow([reportType]);
      titleRow.font = { size: 16, bold: true };
      titleRow.alignment = { horizontal: 'center' };
      sheet.mergeCells('A1:K1');

      const headers = [
        '#', 'Trans No', 'Date', 'Sender', 'Receiver',
        'Kit No', 'Kit Name', 'Product Code',
        'Product Name', 'Product Qty'
      ];
      const headerRow = sheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };
      headerRow.alignment = { horizontal: 'center' };

      let rowIndex = 3; // Start after header

      rowData.forEach((transaction, trxIndex) => {
        const details = formData.type === 'MIM'
          ? transaction.issueManifestProviderDetailsVOs
          : transaction.retrievalManifestProviderDetailsVOs;

        if (!details) return;

        // Group by kit
        const kitGroups = details.reduce((groups, item) => {
          const kitId = item.kitId;
          if (!groups[kitId]) {
            groups[kitId] = {
              kitId,
              kitName: item.kitName,
              assets: []
            };
          }
          groups[kitId].assets.push(item);
          return groups;
        }, {});

        const kitGroupsArray = Object.values(kitGroups);
        const transactionStartRow = rowIndex;

        kitGroupsArray.forEach((kitGroup) => {
          const kitStartRow = rowIndex;

          kitGroup.assets.forEach((asset, assetIndex) => {
            const row = [
              trxIndex + 1,
              assetIndex === 0 ? transaction.transactionNo : '',
              assetIndex === 0 ? dayjs(transaction.transactionDate).format('DD-MM-YYYY') : '',
              assetIndex === 0 ? transaction.fromWarehouse : transaction.sender,
              assetIndex === 0 ? transaction.receiver : '',
              // assetIndex === 0 ? (transaction.amount ? `${Number(transaction.amount).toLocaleString('en-IN')}` : '-') : '',
              assetIndex === 0 ? kitGroup.kitId : '',
              assetIndex === 0 ? kitGroup.kitName : '',
              asset.assetCode,
              asset.asset,
              asset.assetQty
            ];

            sheet.addRow(row);
            rowIndex++;
          });

          // Merge kit cells
          if (kitGroup.assets.length > 1) {
            for (let i = 1; i <= 7; i++) { // Columns A-G
              if ([6, 7].includes(i)) {
                sheet.mergeCells(kitStartRow, i, kitStartRow + kitGroup.assets.length - 1, i);
              }
            }
          }
        });
        const transactionRowCount = rowIndex - transactionStartRow;
        if (transactionRowCount > 1) {
          for (let i = 1; i <= 5; i++) { // Columns A-E
            sheet.mergeCells(transactionStartRow, i, transactionStartRow + transactionRowCount - 1, i);
          }
        }
      });
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 2) {
          row.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };

            if (colNumber <= 5 || colNumber === 6 || colNumber === 7) {
              cell.alignment = { vertical: 'top' };
            }
          });
        }
      });

      // Auto-fit columns
      sheet.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) =>
          Math.max(max, value ? value.toString().length : 0), 0
        );
        column.width = Math.max(10, maxLength + 2);
      });

      // Save
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `${reportType.replace(' ', '_')}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      showToast('error', 'Failed to generate Excel file');
    }
  };
  const totals = rowData.reduce((acc, item) => {
    acc.qty += Number(item.qty || 0);
    acc.rate += Number(item.rate || 0);
    acc.totalCharge += Number(item.totalchargeamountlc || 0);
    acc.totalTax += Number(item.totaltaxamountlc || 0);
    acc.totalInvoice += Number(item.totalinvamountlc || 0);
    return acc;
  }, { qty: 0, rate: 0, totalCharge: 0, totalTax: 0, totalInvoice: 0 });
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
                  control={<Checkbox checked={selectedSections.vendor} onChange={handleCheckboxChange} name="vendor" color="secondary" />}
                  label="Vendor"
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
            {selectedSections.vendor && (
              <div className="col-md-3 mb-2">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.vendor}>
                  <InputLabel id="vendor-label">Vendor</InputLabel>
                  <Select
                    labelId="vendor-label"
                    label="vendor"
                    value={formData.vendor}
                    onChange={handleSelectPartyChange}
                    name="vendor"
                  >
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
                              <TableCell style={{ textAlign: 'center', width: '5%' }}>Vendor Name</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Invoice No</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Invoice Date</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Place of Supply</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Charge Type</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Charge Code</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>Charge Name</TableCell>
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
                              <TableCell style={{ textAlign: 'center', width: '15%' }}>Vendor Name</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '6%' }}>Place of Supply</TableCell>
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
                                <TableCell align="center">{item.qty}</TableCell>
                                <TableCell align="right" sx={{ pl: '2px' }}>{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right">{item.billAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right">{item.gstamount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right">{item.totalinvamountlc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
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
                            <TableCell align="right">{Number(transaction.billAmount).toLocaleString('en-IN')}</TableCell>
                            <TableCell align="right">{Number(transaction.gstamount).toLocaleString('en-IN')}</TableCell>
                            <TableCell align="right">{Number(transaction.totalinvamountlc).toLocaleString('en-IN')}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                        {formData.viewMode === 'details' ? (
                          <>
                            <TableCell colSpan={10} align="right" sx={{ fontWeight: 700, padding: '10px', pr: '20px' }}>
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
                            <TableCell align="right" style={{color: 'red'}}>{totals.totalCharge.toLocaleString('en-IN')}</TableCell>
                            <TableCell align="right" style={{color: 'red'}}>{totals.totalTax.toLocaleString('en-IN')}</TableCell>
                            <TableCell align="right" style={{color: 'red'}}>{totals.totalInvoice.toLocaleString('en-IN')}</TableCell>
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
export default CostReport;
