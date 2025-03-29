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
import Button from '@mui/material/Button';
function TaxRegister() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [accountNameList, setAccountNameList] = useState([]);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    accountName: false,
    branchCode: false,
  });

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    accountName: false,
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
    accountName: 'All',
    branchCode: 'All',
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    accountName: '',
    branchCode: '',
  });
  const handleClear = () => {
    setListView(false);
    // setVisibleSections({
    //   date: false,
    //   accountName: false,
    //   branchCode: false,
    // });
    // setSelectedSections({
    //   date: false,
    //   accountName: false,
    //   branchCode: false,
    // });
    setFormData({
      // dateRange: [null, null],
      fromDate: null,
      toDate: null,
      accountName: 'All',
      branchCode: 'All',
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      accountName: '',
      branchCode: '',
    });
    setRowData([]);
  };
  useEffect(() => {
    getAllBranches();
    getAccountName();
  }, []);
  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchCodeList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAccountName = async () => {
    try {
      const response = await apiCalls('get', `/master/getAllGroupLedgerByOrgId?orgId=${orgId}`);
      setAccountNameList(response.paramObjectsMap.groupLedgerVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const handleSelectAccountChange = (e) => {
    const value = e.target.value;
    console.log('Selected Account value:', value);
  
    if (value === "All") {
      setFormData((prevData) => ({
        ...prevData,
        accountName: "All",
      }));
    } else {
      const selectedEmp = accountNameList.find((emp) => emp.accountGroupName === value);
  
      if (selectedEmp) {
        console.log('Selected party:', selectedEmp);
        setFormData((prevData) => ({
          ...prevData,
          accountName: selectedEmp.accountGroupName,
        }));
      } else {
        console.log('No Account found with the given code:', value);
      }
    }
  };
  
  // const handleSelectAccountChange = (e) => {
  //   const value = e.target.value;
  //   console.log('Selected Account value:', value);
  //   const selectedEmp = accountNameList.find((emp) => emp.accountGroupName === value);

  //   if (selectedEmp) {
  //     console.log('Selected party:', selectedEmp);
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       accountName: selectedEmp.accountGroupName,
  //     }));
  //   } else {
  //     console.log('No Account found with the given code:', value);
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
  
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
    }
  };
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };
  const reportColumns = [
    { accessorKey: 'vId', header: 'Invoice No', size: 140 },
    { accessorKey: 'vDate', header: 'Date', size: 140 },
    { accessorKey: 'partyName', header: 'Particulars', size: 300 },
    { accessorKey: 'opbal', header: 'Opening Balance', size: 140 },
    { accessorKey: 'ndAmount', header: 'Debit(INR)', size: 140 },
    { accessorKey: 'ncAmount', header: 'Credit(INR)', size: 140 },
    { accessorKey: 'dbAmount', header: 'Debit', size: 140 },
    { accessorKey: 'crAmount', header: 'Credit', size: 140 },
    { accessorKey: 'clBal', header: 'Closing Balance', size: 140 },
    // { accessorKey: 'currency', header: 'Currency', size: 140 },
    // { accessorKey: '', header: 'Narration', size: 140 },
  ];
  const handleGo = async () => {
    const errors = {};
    if (!formData.accountName) {
      errors.accountName = 'Account Name is required';
    }
      if (!formData.fromDate) {
        errors.fromDate = 'From Date is required';
        showToast('error', errors.fromDate);
      }
      if (!formData.toDate) {
        errors.toDate = 'To Date is required';
        showToast('error', errors.toDate);
      }
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if(formData.fromDate && formData.toDate){
          response = await apiCalls(
            'get',
            `/master/getAllLedgerReport?accountName=${formData.accountName}&branchCode=${formData.branchCode}&fromDate=${formData.fromDate}&orgId=${orgId}&toDate=${formData.toDate}`
          );
        }else {
          response = await apiCalls(
            'get',
            `/master/getAllLedgerReport?&accountName=${formData.accountName}&orgId=${orgId}&branchCode=${formData.branchCode}`
          );
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.partyMasterVO || '');
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
        {/* <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Search" icon={SearchIcon} isLoading={isLoading} onClick={handleGo} margin="0 10px 0 10px" />
          </div>
        </div> */}
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
                  control={<Checkbox checked={selectedSections.accountName} onChange={handleCheckboxChange} name="accountName" color="secondary" />}
                  label="Account Name"
                />
              </div>
              {/* <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.withDetails}  onChange={handleCheckboxChange} name="withDetails" color="secondary" />}
                  label="With Details"
                />
              </div> */}
              <div className="col-md-2 mb-1">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.branchCode}  onChange={handleCheckboxChange} name="branchCode" color="secondary" />}
                  label="Branch Code"
                />
              </div>
              <div className="col-md-2 mb-1">
                <Button
                  onClick={handleProceed}
                  color="secondary"
                  variant="contained"
                  style={{ textTransform: 'none', padding: '4px 8px', marginTop: '6px' }}
                  disabled={isLoading}
                >
                  Proceed
                </Button>
              </div>
              </div>
              {visibleSections.date && (
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
              {visibleSections.accountName && ( 
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.accountName}>
                  <InputLabel id="accountName-label">Account Name</InputLabel>
                  <Select
                  type='text'
                    labelId="accountName-label"
                    label="accountName"
                    value={formData.accountName}
                    onChange={handleSelectAccountChange}
                    name="accountName"
                  >
                    <MenuItem value="All">All</MenuItem>

                    {accountNameList?.map((row) => (
                      <MenuItem key={row.id} value={row.accountGroupName}>
                        {row.accountGroupName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.accountName && <FormHelperText>{fieldErrors.accountName}</FormHelperText>}
                </FormControl>
              </div>
              )}
              {/* {visibleSections.withDetails && ( 
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.withDetails}>
                  <InputLabel id="withDetails-label">With Details</InputLabel>
                  <Select
                  type='text'
                    labelId="withDetails-label"
                    label="withDetails"
                    value={formData.withDetails}
                    onChange={handleInputChange}
                    name="withDetails"
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {fieldErrors.withDetails && <FormHelperText>{fieldErrors.withDetails}</FormHelperText>}
                </FormControl>
              </div>
              )} */}
              {visibleSections.branchCode && ( 
              <div className="col-md-3 mb-2">
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
              {(visibleSections.date || visibleSections.accountName || visibleSections.branchCode) && (
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
            <CommonReportTable data={rowData} columns={reportColumns} isListView={listView} />
          </div>
        )}
  </div>
    </>
  )
}

export default TaxRegister;
