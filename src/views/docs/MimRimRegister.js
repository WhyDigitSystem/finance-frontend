import React from 'react';
import { TextField, Checkbox, Box, Typography, Button, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select, Radio, TableContainer, Switch, ButtonGroup } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  Table,
  TableBody,
  TableCell,
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

function MimRimRegister() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [open, setOpen] = useState(false);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branchCode: false,
    customer: false,
    mim: true,
    rim: false,
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (name === "mim" || name === "rim") {
      const selectedType = name.toUpperCase();

      setSelectedSections((prev) => ({
        ...prev,
        mim: name === "mim" ? checked : false,
        rim: name === "rim" ? checked : false,
      }));

      setFormData((prev) => ({
        ...prev,
        mim: name === "mim" ? checked : false,
        rim: name === "rim" ? checked : false,
        type: checked ? selectedType : "",
      }));
    } else {
      setSelectedSections((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    }
  };

  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    mim: true,
    rim: false,
    type: 'MIM',
    branchCode: 'All',
    customer: 'All',
    customerCode: 'All',
    viewMode: 'details',
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branchCode: '',
    customer: '',
    customerCode: '',
  });
  const handleClear = () => {
    setListView(false);
    setFormData({
      mim: true,
      rim: false,
      fromDate: null,
      toDate: null,
      branchCode: 'All',
      customer: 'All',
      customerCode: 'All',
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      customer: '',
      customerCode: '',
      branchCode: '',
    });
    setRowData([]);
  };
  const handleSelectPartyChange = (e) => {
    const value = e.target.value;
    console.log('Selected employeeCode value:', value);
    const selectedEmp = partyNameList.find((emp) =>
      formData.type === 'MIM' ? emp.partyShortName === value : emp.name === value
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
          customer: formData.type === 'MIM' ? selectedEmp.partyShortName : selectedEmp.name,
          // customerCode: selectedEmp.partyCode,
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
  };
  useEffect(() => {
    getAllBranches();
    if (formData.type === 'MIM') {
      setPartyNameList([]);
      getPartyName();
    } else if (formData.type === 'RIM') {
      setPartyNameList([]);
      getAllCustomerDetails();
    }
  }, [formData.type]);

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
  const getAllCustomerDetails = async () => {
    try {
      const response = await apiCalls('get', `/warehouser/getAllWarehouseByOrgId?orgId=${orgId}`);
      setPartyNameList(response.paramObjectsMap.warehouseVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const handleGo = async () => {
    const errors = {};
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      setOpen(true);
      setListView(false);
      try {
        let response;
        if (formData.viewMode === 'details') {
          if (formData.type === 'MIM')
            if (formData.fromDate && formData.toDate) {
              response = await apiCalls(
                'get',
                `/reportController/findMIMReports?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}&fromDate=${formData.fromDate}&toDate=${formData.toDate}`
              );
            } else {
              response = await apiCalls(
                'get',
                `/reportController/findMIMReports?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}`
              );
            }
          else {
            if (formData.fromDate && formData.toDate) {
              response = await apiCalls(
                'get',
                `/reportController/findRIMReports?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}&fromDate=${formData.fromDate}&toDate=${formData.toDate}`
              );
            } else {
              response = await apiCalls(
                'get',
                `/reportController/findRIMReports?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}`
              );
            }
          }
        } else {
          if (formData.type === 'MIM')
            if (formData.fromDate && formData.toDate) {
              response = await apiCalls(
                'get',
                `/reportController/findMimSummaryReport?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}&fromDate=${formData.fromDate}&toDate=${formData.toDate}`
              );
            } else {
              response = await apiCalls(
                'get',
                `/reportController/findMimSummaryReport?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}`
              );
            }
          else {
            if (formData.fromDate && formData.toDate) {
              response = await apiCalls(
                'get',
                `/reportController/findRimSummaryReport?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}&fromDate=${formData.fromDate}&toDate=${formData.toDate}`
              );
            } else {
              response = await apiCalls(
                'get',
                `/reportController/findRimSummaryReport?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}`
              );
            }
          }
        }


        if (response.status === true) {
          console.log('Response:', response);
          { formData.type === 'MIM' && setRowData(response.paramObjectsMap.mimReportFillGrid || []); }
          { formData.type === 'RIM' && setRowData(response.paramObjectsMap.rimReportFillGrid || []); }
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
              // assetIndex === 0 ? (transaction.amount ? `₹${Number(transaction.amount).toLocaleString('en-IN')}` : '-') : '',
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
              <div className="col-md-1 mb-1">
                <FormControlLabel
                  control={<Radio checked={selectedSections.mim} onChange={handleCheckboxChange} name="mim" color="secondary" />}
                  label="MIM"
                />
              </div>
              <div className="col-md-1 mb-1">
                <FormControlLabel
                  control={<Radio checked={selectedSections.rim} onChange={handleCheckboxChange} name="rim" color="secondary" />}
                  label="RIM"
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
                      <MenuItem
                        key={row.id}
                        value={formData.type === 'MIM' ? row.partyShortName : row.name}
                      >
                        {formData.type === 'MIM' ? row.partyShortName : row.name}
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
                      startIcon={<FileDownloadIcon />}
                      onClick={handleDownloadExcel}
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
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>#</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '8%' }}>Trans No</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '8%' }}>Date</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '13%' }}>Sender</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '10%' }}>Receiver</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '6%' }}>Kit No</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '15%' }}>Kit Name</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '6%' }}>Kit Qty</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '8%' }}>Product Code</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '15%' }}>Product Name</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '10%' }}>Product Qty</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell style={{ textAlign: 'center', width: '2%' }}>#</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '8%' }}>Trans No</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '8%' }}>Date</TableCell>
                              {
                                formData.mim ?
                                  <TableCell style={{ textAlign: 'center', width: '10%' }}>Receiver</TableCell> :
                                  <TableCell style={{ textAlign: 'center', width: '10%' }}>Sender</TableCell>
                              }
                              <TableCell style={{ textAlign: 'center', width: '6%' }}>HSN Code</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '15%' }}>Transporter Name</TableCell>
                              <TableCell style={{ textAlign: 'center', width: '6%' }}>Kit Qty</TableCell>
                              {
                                formData.mim ?
                                  <TableCell style={{ textAlign: 'center', width: '8%' }}>Amount</TableCell> :
                                  ''
                              }
                            </>
                          )
                        }

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.viewMode === 'details' ? (
                        rowData.map((transaction, trxIndex) => {
                          const details = formData.type === 'MIM'
                            ? transaction.issueManifestProviderDetailsVOs
                            : transaction.retrievalManifestProviderDetailsVOs;

                          if (!details) return null;

                          const kitGroups = details.reduce((groups, item) => {
                            const kitId = item.kitId;
                            if (!groups[kitId]) {
                              groups[kitId] = {
                                kitId,
                                kitName: item.kitName,
                                kitQty: item.kitQty,
                                assets: []
                              };
                            }
                            groups[kitId].assets.push(item);
                            return groups;
                          }, {});

                          const kitGroupsArray = Object.values(kitGroups);
                          const totalAssetsInTransaction = details.length;

                          return (
                            <React.Fragment key={transaction.id}>
                              {kitGroupsArray.map((kitGroup, kitIndex) =>
                                kitGroup.assets.map((asset, assetIndex) => (
                                  <TableRow key={`${transaction.id}-${kitGroup.kitId}-${asset.id}`}>
                                    {/* Transaction-level data */}
                                    {kitIndex === 0 && assetIndex === 0 && (
                                      <>
                                        <TableCell rowSpan={totalAssetsInTransaction} align="center">
                                          {trxIndex + 1}
                                        </TableCell>
                                        <TableCell rowSpan={totalAssetsInTransaction} align="center">
                                          {transaction.transactionNo}
                                        </TableCell>
                                        <TableCell rowSpan={totalAssetsInTransaction} align="center">
                                          {dayjs(transaction.transactionDate).format('DD-MM-YYYY')}
                                        </TableCell>
                                        <TableCell rowSpan={totalAssetsInTransaction}>
                                          {formData.type === 'MIM' ? transaction.fromWarehouse : transaction.sender}
                                        </TableCell>
                                        <TableCell rowSpan={totalAssetsInTransaction}>
                                          {transaction.receiver}
                                        </TableCell>
                                      </>
                                    )}

                                    {/* Kit-level data */}
                                    {assetIndex === 0 && (
                                      <>
                                        <TableCell rowSpan={kitGroup.assets.length} align="center">
                                          {kitGroup.kitId}
                                        </TableCell>
                                        <TableCell rowSpan={kitGroup.assets.length}>
                                          {kitGroup.kitName}
                                        </TableCell>
                                        <TableCell rowSpan={kitGroup.assets.length} align='center'>
                                          {kitGroup.kitQty}
                                        </TableCell>
                                      </>
                                    )}

                                    {/* Asset-level data */}
                                    <TableCell align="center">{asset.assetCode}</TableCell>
                                    <TableCell>{asset.asset}</TableCell>
                                    <TableCell align="center">{asset.assetQty}</TableCell>
                                  </TableRow>
                                ))
                              )}

                              {/* Separator */}
                              {trxIndex < rowData.length - 1 && (
                                <TableRow>
                                  <TableCell colSpan={11} sx={{ borderBottom: '1px groove #000', height: '1px' }} />
                                </TableRow>
                              )}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        rowData.map((transaction, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="center">{transaction.transactionNo}</TableCell>
                            <TableCell align="center">{dayjs(transaction.transactionDate).format('DD-MM-YYYY')}</TableCell>
                            {
                              formData.mim ?
                                <TableCell>{transaction.receiver}</TableCell> :
                                <TableCell>{transaction.sender}</TableCell>
                            }
                            <TableCell align="center">{transaction.hsnCode}</TableCell>
                            <TableCell>{transaction.transporterName || '-'}</TableCell>
                            <TableCell align="center">{transaction.kitQty}</TableCell>
                            {
                              formData.mim ?
                                <TableCell align="right">
                                  ₹{transaction.amount ? Number(transaction.amount).toLocaleString('en-IN') : '0'}
                                </TableCell> :
                                ''
                            }
                          </TableRow>
                        ))
                      )}
                    </TableBody>

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

export default MimRimRegister;
