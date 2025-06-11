import React from 'react';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ClearIcon from '@mui/icons-material/Clear';
import ActionButton from 'utils/ActionButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import { TabContext } from '@mui/lab';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Button, Chip, Stack } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { showToast } from 'utils/toast-component';
import CommonReportTable from 'utils/CommonReportTable';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
function TaxRegister() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [fillGridData, setFillGridData] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('1');
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branchCode: false,
    customer: false,
  });

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    branchCode: false,
    customer: false,
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };
    const handleCloseModal = () => {
      setModalOpen(false);
    };
    const handleModal = () => {
      setOpen(false);
    };
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    // dateRange: [null, null],
    branchCode: 'All',
    customer: 'All',
    customerCode:'All'
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branchCode: '',
    customer: '',
    customerCode:'',
  });
  const handleClear = () => {
    setListView(false);
    // setVisibleSections({
    //   date: false,
    //   branchCode: false,
    //   customer: false,
    // });
    // setSelectedSections({
    //   date: false,
    //   branchCode: false,
    //   customer: false,
    // });
    setFormData({
      // dateRange: [null, null],
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
    const selectedEmp = partyNameList.find((emp) => emp.partyName === value);
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
        customerCode: selectedEmp.partyCode,
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
    getAllBranches();
    getPartyName();
  }, []);

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
  const reportColumns = [
    { accessorKey: 'JobOrderNo', header: 'Job No', size: 100 },
{
  accessorKey: 'docId',
  header: 'Doc Id',
  size: 100,
  Cell: ({ row }) => {
    const docId = row.original.docId;
    const screenCode = row.original.screenCode;

    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleDocClick(docId, screenCode);
        }}
        style={{
          color: 'crimson',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'color 0.2s, text-shadow 0.2s',
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
    { accessorKey: 'docDate', header: 'Date', size: 100 },
    { accessorKey: 'screenCode', header: 'Screen', size: 100 },
    { accessorKey: 'Vid', header: '# Invoice', size: 100 },
    { accessorKey: 'Vdate', header: 'Date', size: 100 },
    { accessorKey: 'BillToParty', header: 'Customer', size: 140 },
    { accessorKey: 'BillAmount', header: 'Amount', size: 80,     Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
      {cell.getValue() !== undefined && cell.getValue() !== null 
        ? Number(cell.getValue()).toLocaleString('en-IN') 
        : '-'}
      </div>),
        muiTableHeadCellProps: {
          align: 'right'
    }},
    { accessorKey: 'TotalTaxAmountLC', header: 'TAX Amount', size: 80,
      Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
       {cell.getValue() !== undefined && cell.getValue() !== null 
         ? Number(cell.getValue()).toLocaleString('en-IN') 
         : '-'}
       </div>)}, 
    {
      accessorKey: 'TotalInvAmountLC',
      header: 'Total Amount',
      size: 80,
      Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
        {cell.getValue() !== undefined && cell.getValue() !== null 
        ? Number(cell.getValue()).toLocaleString('en-IN') 
        : '-'}
      </div>)},    
    ];
  const handleGo = async () => {
    const errors = {};
    // if (!formData.partyName) {
    //   errors.partyName = 'Sub ledger name is required';
    // }
    // if (!formData.branchCode) {
    //   errors.branchCode = 'Branch Code is required';
    // }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      setListView(false);
      try {
        let response;
        if(formData.fromDate && formData.toDate){
          response = await apiCalls(
            'get',
            `/taxInvoice/getReportDetailsForSalesRegister?finYear=${finYear}&branchCode=${formData.branchCode}&fromDate=${formData.fromDate}&orgId=${orgId}&partyCode=${formData.customerCode}&toDate=${formData.toDate}`
          );
        }else {
          response = await apiCalls(
            'get',
            `/taxInvoice/getReportDetailsForSalesRegister?finYear=${finYear}&branchCode=${formData.branchCode}&orgId=${orgId}&partyCode=${formData.customerCode}`
          );
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.taxInvoiceVO);
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
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
const handleDocClick = async (docId, screenCode) => {
  setModalOpen(true);
  try {
    let response;
    if(screenCode === 'TI'){
    response = await apiCalls(
      'get',
      `/taxInvoice/getTaxInvoiceByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`
    );}
    else{
    response = await apiCalls(
      'get',
      `/taxInvoice/getCreditNoteByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`
    );}

    if (response.status === true) {
    // const dataKey = screenCode === 'TI' ? 'taxIn
      {screenCode === 'TI' ? setFillGridData(response.paramObjectsMap.taxInvoiceVO) : setFillGridData(response.paramObjectsMap.irnCreditNoteVO);}
    } else {
      console.error('API Error:', response);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
  return(
    <>
      <div className="card w-full bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
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
                  control={<Checkbox checked={selectedSections.branchCode}  onChange={handleCheckboxChange} name="branchCode" color="secondary" />}
                  label="Branch Code"
                />
              </div>
              {/* <div className="col-md-2 mb-1">
                <Button
                  onClick={handleProceed}
                  color="secondary"
                  variant="contained"
                  style={{ textTransform: 'none', padding: '4px 8px', marginTop: '6px' }}
                  disabled={isLoading}
                >
                  Proceed
                </Button>
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
              {(selectedSections.date || selectedSections.branchCode || selectedSections.customer) && (
                <div className="col-md-3 mb-2">
                  <div className="row d-flex ml">
                    <div className="d-flex flex-wrap justify-content-start mb-3 mt-1" style={{ marginBottom: '20px' }}>
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
            <CommonReportTable data={rowData} columns={reportColumns} isListView={listView} fileName={"Sales Register"} sumFields={['TotalInvAmountLC', 'TotalTaxAmountLC', 'BillAmount']}/>
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
                      <DialogTitle textAlign="center" style={{ cursor: 'move' }} id="draggable-dialog-title">
                        <h6>Report Details</h6>
                      </DialogTitle>
                      <DialogContent className="pb-0">
                                        <div className="row mb-2 mb-1">
                                        <div className="col-md-3 mb-1"><strong>Doc ID:</strong> {fillGridData.docId}</div>
                                        <div className="col-md-3 mb-1"><strong>Doc Date:</strong> {fillGridData.docDate ? dayjs(fillGridData.docDate).format('DD-MM-YYYY') : ''}</div>
                                        <div className="col-md-3 mb-1"><strong>Invoice No:</strong> {fillGridData.vid}</div>
                                        <div className="col-md-3 mb-1"><strong>Invoice Date:</strong> {fillGridData.vdate ? dayjs(fillGridData.vdate).format('DD-MM-YYYY') : ''}</div>
                                        <div className="col-md-3 mb-1"><strong>Customer:</strong> {fillGridData.partyName}</div>
                                        <div className="col-md-3 mb-1"><strong>Job No:</strong> {fillGridData.jobOrderNo}</div>
                                        <div className="col-md-3 mb-1"><strong>Gst In:</strong> {fillGridData.recipientGSTIN}</div>
                                        <div className="col-md-3 mb-1"><strong>Tax Type:</strong> {fillGridData.gstType}</div>
                                        <div className="col-md-3 mb-1"><strong>Charge Amount:</strong> ₹{Number(fillGridData.totalChargeAmountLc || 0).toLocaleString('en-IN')}</div>
                                        <div className="col-md-3 mb-1"><strong>Tax Amount:</strong> ₹{Number(fillGridData.totalTaxAmountLc || 0).toLocaleString('en-IN')}</div>
                                        <div className="col-md-3 mb-1"><strong>Amount:</strong> ₹{Number(fillGridData.totalInvAmountLc || 0).toLocaleString('en-IN')}</div>
                                      </div>
                      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3">
                      <Box sx={{ width: '100%', typography: 'body1' }}>
                      <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
                            <Tab label="Charge Particulars" value="1" />
                            {/* {fillGridData.taxInvoiceAnnexureVO.length > 0 && <Tab label="Annexure" value="2" />} */}
                            <Tab label="Gst" value="2" />
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
                                              S.No
                                            </th>
                                            <th className="table-header">Charge Type</th>
                                            <th className="table-header">Charge Code</th>
                                            <th className="table-header">SAC Code</th>
                                            <th className="table-header">ledger</th>
                                            <th className="table-header">Charge Name</th>
                                            <th className="table-header">Qty</th>
                                            <th className="table-header">Rate</th>
                                            <th className="table-header">Currency</th>
                                            <th className="table-header">Ex Rate</th>
                                            <th className="table-header">GST Percent</th>
                                            <th className="table-header">GST Amount</th>
                                            <th className="table-header">FC Amount</th>
                                            <th className="table-header">LC Amount</th>
                                            <th className="table-header">Bill Amount</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                        {fillGridData.taxInvoiceDetailsVO && fillGridData.taxInvoiceDetailsVO.length > 0 ? (
                                          fillGridData.taxInvoiceDetailsVO.map((row, index) => (
                                            <tr key={row.id}>
                                              <td className="text-center">{index + 1}</td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.chargeType || ''}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.chargeCode || ''}
                                              </td> 
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.govChargeCode || ''}
                                              </td> 
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.ledger || ''}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.chargeName || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.qty || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.rate || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.currency || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.exRate || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstpercent || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstAmount || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.fcAmount || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.lcAmount || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.billAmount || 0}
                                              </td>
                                            </tr>
                                          ))
                                          ) : (
                                            fillGridData.irnCreditNoteDetailsVO?.map((row, index) => (
                                            <tr key={row.id}>
                                              <td className="text-center">{index + 1}</td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.chargeType || ''}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.chargeCode || ''}
                                              </td> 
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.govChargeCode || ''}
                                              </td> 
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.ledger || ''}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.chargeName || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.qty || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.rate || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.currency || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.exRate || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstpercent || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstAmount || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.fcAmount || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.lcAmount || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.billAmount || 0}
                                              </td>
                                            </tr>
                                            ))
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                        </TabPanel>
                        <TabPanel value="2">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <div className="table-responsive">
                                      <table className="table table-bordered">
                                        <thead>
                                          <tr style={{ backgroundColor: '#673AB7' }}>
                                            <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                              S.No
                                            </th>
                                            <th className="table-header">GST Charge Acc</th>
                                            <th className="table-header">GST Subledger Code</th>
                                            <th className="table-header">GST Db BillAmount</th>
                                            <th className="table-header">GST Cr Bill Amount</th>
                                            <th className="table-header">GST Db Lc Amount</th>
                                            <th className="table-header">GST Cr Lc Amount</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {fillGridData.irnCreditNoteGstVO && fillGridData.irnCreditNoteGstVO.length > 0 ? (
                                          fillGridData.irnCreditNoteGstVO.map((row, index) => (                
                                            <tr key={row.id}>
                                              <td className="text-center">{index + 1}</td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstChargeAcc || ''}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstSubledgerCode || ''}
                                              </td> 
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstDbBillAmount || ''}
                                              </td> 
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstCrBillAmount || ''}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstDbLcAmount || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstCrLcAmount || 0}
                                              </td>
                                            </tr>
                                              ))
                                            ) : (
                                              fillGridData.taxInvoiceGstVO?.map((row, index) => (
                                            <tr key={row.id}>
                                              <td className="text-center">{index + 1}</td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstChargeAcc || ''}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstSubledgerCode || ''}
                                              </td> 
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstDbBillAmount || ''}
                                              </td> 
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstCrBillAmount || ''}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstDbLcAmount || 0}
                                              </td>
                                              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {row.gstCrLcAmount || 0}
                                              </td>
                                            </tr>
                                            ))
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
  )
}

export default TaxRegister;
