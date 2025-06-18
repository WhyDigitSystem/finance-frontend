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
import { useEffect, useState } from 'react';
import { showToast } from 'utils/toast-component';
import CommonReportTable from 'utils/CommonReportTable';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { IconButton } from '@mui/material';
import { Box, Button, Chip, Stack } from '@mui/material';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function PaymentReport() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [fillGridData, setFillGridData] = useState([]);
  const [value, setValue] = useState('1');
  const [modalOpen, setModalOpen] = useState(false);
  const [partyNameList, setPartyNameList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
    const [branchCodeList, setBranchCodeList] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    vendor: false,
    branchCode: false,
  });

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    vendor: false,
    branchCode: false,
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };
  const handleProceed = () => {
    setVisibleSections({ ...selectedSections });
  };
  
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    // dateRange: [null, null],
    vendor: 'All',
    vendorCode:'All',
    branchCode: 'All',
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    vendor: '',
    vendorCode:'',
    branchCode: '',
  });
  const handleClear = () => {
    setListView(false);
    setFormData({
      // dateRange: [null, null],
      fromDate: null,
      toDate: null,
      vendor: 'All',
      vendorCode: 'All',
      branchCode: 'All',
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      vendor: '',
      vendorCode: '',
      branchCode: '',
    });
    setRowData([]);
  };
  const handleSelectPartyChange = (e) => {
    const value = e.target.value;
    console.log('Selected employeeCode value:', value);
    const selectedEmp = partyNameList.find((emp) => emp.partyName === value);

    if (selectedEmp) {
      console.log('Selected party:', selectedEmp);
      setFormData((prevData) => ({
        ...prevData,
        vendor: selectedEmp.partyName,
        vendorCode: selectedEmp.partyCode,
      }));
    } else {
      console.log('No party found with the given code:', value);
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
  const handleInputChange = (e) => {
    const { name, value, type, selectionStart, selectionEnd } = e.target;
  
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
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
    getPartyName();
    getAllBranches();
  }, []);

  const getPartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=vendor`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const reportColumns = [
    // { accessorKey: 'docId', header: 'Doc No', size: 100 },
    {
      accessorKey: 'docId',
      header: 'Doc Id',
      size: 100,
      Cell: ({ row }) => {
        const docId = row.original.docId;
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleDocClick(docId);
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
    { accessorKey: 'subLedgerName', header: 'Vendor Name', size: 100 },
    { accessorKey: 'chequeNo', header: 'Cheque No', size: 100 },
    { accessorKey: 'chequeDate', header: 'Cheque Date', size: 100 },
    { accessorKey: 'bankCashAcc', header: 'Bank Account', size: 100 },
    {
      accessorKey: 'PaymentAmount',
      header: 'Payment Amt',
      size: 70,
      Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
        {cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : 0}</div>
      )
    },
    {
      accessorKey: 'chargeamt',
      header: 'Payable Amt',
      size: 70,
      Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
        {cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : 0}</div>
      )
    },
    {
      accessorKey: 'arApOutstanding',
      header: 'OutStanding',
      size: 70,
      Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
        {cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : 0}</div>
      )
    },
    {
      accessorKey: 'arapSettled',
      header: 'Settled',
      size: 70,
      Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
        {cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : 0}</div>
      )
    },
    {
      accessorKey: 'onaccount',
      header: 'On Account',
      size: 70,
      Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
        {cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : 0}</div>
      )
    }
  ];
  const handleDocClick = async (docId) => {
    setModalOpen(true);
    try {
      const response = await apiCalls(
        'get',
        `/payable/getPaymentByDocId?docId=${docId}&orgId=${orgId}`
      );
      if (response.status === true) {
        setFillGridData(response.paramObjectsMap.PaymentVO)
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatAmount = (value) => {
    if (value == null || value === '') return '0';
    return Number(value).toLocaleString('en-IN'); // For Indian numbering system
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleGo = async () => {
    const errors = {};
    // if (!formData.partyName) {
    //   errors.partyName = 'Sub ledger name is required';
    // }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if(formData.fromDate && formData.toDate){
          response = await apiCalls(
            'get',
            `/reportController/getPaymentRegisterReport?branchCode=${formData.branchCode}&finYear=${finYear}&orgId=${orgId}&partyCode=${formData.vendorCode}toDate=${formData.toDate}&fromDate=${formData.fromDate}`
          );
        }else {
          response = await apiCalls(
            'get',
            `/reportController/getPaymentRegisterReport?branchCode=${formData.branchCode}&finYear=${finYear}&orgId=${orgId}&partyCode=${formData.vendorCode}`
          );
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.paymentReport);
          console.log("Payment Report",response.paramObjectsMap.paymentReport);
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
  return(
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <>
            <div className="row">
              <div className="row">
              <div className="col-md-2
               mb-3">
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
                  label="Branch Code"
                />
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
              {selectedSections.vendor && ( 
              <div className="col-md-3 mb-2">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.vendor}>
                  <InputLabel id="vendor-label">Vendor</InputLabel>
                  <Select
                    labelId="vendor-label"
                    label="Vendor"
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
              {selectedSections.branchCode && ( 
              <div className="col-md-3 mb-2">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branchCode}>
                  <InputLabel id="branchCode-label">Branch Code</InputLabel>
                  <Select
                    labelId="branchCode-label"
                    label="Branch Code"
                    value={formData.branchCode}
                    onChange={handleSelectPartyChange}
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
              {(selectedSections.date || selectedSections.vendor || selectedSections.branchCode) && (
                <div className="col-md-3 mb-2">
                  <div className="row d-flex ml">
                    <div className="d-flex flex-wrap justify-content-start mb-4 mt-1" style={{ marginBottom: '20px' }}>
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
            <CommonReportTable data={rowData} columns={reportColumns} isListView={listView} fileName={"Payment Register"} />
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
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <h6 style={{ margin: 0, textAlign: "center" }}>Report Details</h6>
                <IconButton onClick={handleCloseModal} color="error">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent className="pb-0">
              <div className="row mb-2 mb-1">
                <div className="col-md-3 mb-1"><strong>Doc ID:</strong> {fillGridData.docId}</div>
                <div className="col-md-3 mb-1"><strong>Date:</strong> {fillGridData.docDate ? dayjs(fillGridData.docDate).format('DD-MM-YYYY') : ''}</div>
                <div className="col-md-3 mb-1"><strong>Payment Type:</strong> {fillGridData.paymentType}</div>
                <div className="col-md-3 mb-1"><strong>UTI No:</strong> {fillGridData.chequeNo}</div>
                <div className="col-md-3 mb-1"><strong>Date:</strong> {fillGridData.chequeDate ? dayjs(fillGridData.chequeDate).format('DD-MM-YYYY') : ''}</div>
                <div className="col-md-3 mb-1"><strong>Payment Amount:</strong> ₹{Number(fillGridData.paymentAmt || 0).toLocaleString('en-IN')}</div>
                <div className="col-md-3 mb-1"><strong>On Account:</strong> ₹{Number(fillGridData.onAccount || 0).toLocaleString('en-IN')}</div>
                <div className="col-md-3 mb-1"><strong>Settled Amount:</strong> ₹{Number(fillGridData.netAmount || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="card w-full p-6 bg-base-100 shadow-xl mb-3">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
                        <Tab label="Details" value="1" />
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
                                    #
                                  </th>
                                  <th className="table-header">Invoice No</th>
                                  <th className="table-header">Invoice Date</th>
                                  <th className="table-header">Ref No</th>
                                  <th className="table-header">Ref Date</th>
                                  <th className="table-header">Currency</th>
                                  <th className="table-header">Ex Rate</th>
                                  <th className="table-header">Bill Amt</th>
                                  <th className="table-header">Tax Amt</th>
                                  <th className="table-header">Payable Amt</th>
                                  
                                  <th className="table-header">Outstanding Amt</th>
                                  <th className="table-header">Settled Amt</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fillGridData.paymentInvDtlsVO && fillGridData.paymentInvDtlsVO.length > 0 ? (
                                  fillGridData.paymentInvDtlsVO.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.invNo || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatDate(row.invDate)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.refNo || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatDate(row.refDate)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.currency || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.exRate)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.amount)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.gstAmount)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.chargeAmt)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.outstanding)}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {formatAmount(row.settled)}
                                      </td>
                                    </tr>

                                  ))
                                ) : (
                                  <div className="text-center">
                                    No Data
                                  </div>
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

export default PaymentReport;
