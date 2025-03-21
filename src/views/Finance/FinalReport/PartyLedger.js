import React from 'react';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
function PartyLedger() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [partyTypeList, setPartyTypeList] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branch: false,
    customer: false,
    // withDetails: false
  });

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    branch: false,
    customer: false,
    // withDetails: false
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
    branch: 'All',
    partyName: 'All',
    partyType: 'All'
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branch: '',
    partyName: '',
    partyType: ''
  });
  const handleClear = () => {
    setListView(false);
    setVisibleSections({
      date: false,
      branch: false,
      customer: false,
      // withDetails: false
    });
    setSelectedSections({
      date: false,
      branch: false,
      customer: false,
      // withDetails: false
    });
    setFormData({
      // dateRange: [null, null],
      fromDate: null,
      toDate: null,
      branch: 'All',
      partyName: 'All',
      partyType: 'All'
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      partyName: '',
      partyType: '',
      branch: '',
    });
    setRowData([]);
  };
  //   const handleSelectPartyChange = (e) => {
  //     const value = e.target.value;
  //     console.log('Selected employeeCode value:', value);
  //     const selectedEmp = partyNameList.find((emp) => emp.partyName === value);

  //     if (selectedEmp) {
  //       console.log('Selected party:', selectedEmp);
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         partyName: selectedEmp.partyName,
  //         partyType: selectedEmp.partyType
  //       }));
  //     } else {
  //       console.log('No party found with the given code:', value);
  //     }
  //   };

  const handleSelectPartyChange = async (event) => {
    const { value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      partyType: value,
      partyName: 'All'
    }));

    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=${value}`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO || []);
    } catch (error) {
      console.error('Error fetching party names:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, selectionStart, selectionEnd } = e.target;

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));

    if (name === 'branch') {
      const selectedBranch = branchCodeList.find((br) => br.branch === value);
      setFormData((prevData) => ({
        ...prevData,
        branch: selectedBranch ? selectedBranch.branch : ''
      }));
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
    getAllPartyMasterByOrgId();
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
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=${formData.partyType}`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getAllPartyMasterByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllPartyTypeByOrgId?orgid=${orgId}`);
      setPartyTypeList(result.paramObjectsMap.partyTypeVO || []);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };
  const reportColumns = [
    { accessorKey: 'vId', header: 'Invoice No', size: 140 },
    { accessorKey: 'vdate', header: 'Invoice Date', size: 140 },
    { accessorKey: 'refno', header: 'Reference No', size: 140 },
    { accessorKey: 'refdate', header: 'Reference Date', size: 140 },
    { accessorKey: 'supplierrefno', header: 'Supp Reference No', size: 140 },
    { accessorKey: 'supplierrefdate', header: 'Supp Reference Date', size: 140 },
    // { accessorKey: 'partyType', header: 'Particulars', size: 140 },
    { accessorKey: 'dbAmount', header: 'Debit(INR)', size: 140 },
    { accessorKey: 'cramount', header: 'Credit(INR)', size: 140 },
    { accessorKey: 'currency', header: 'Currency', size: 140 },
    { accessorKey: 'billdbamount', header: 'Debit', size: 140 },
    { accessorKey: 'billcramount', header: 'Credit', size: 140 },
  ];
  const handleGo = async () => {
    const errors = {};

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if (formData.fromDate && formData.toDate) {
          response = await apiCalls(
            'get',
            `/master/getAllPartyLedgerReport?branch=${formData.branch}&fromDate=${formData.fromDate}&orgId=${orgId}&partyName=${formData.partyName}&partyType=${formData.partyType}&toDate=${formData.toDate}`
          );
        } else {
          response = await apiCalls(
            'get',
            `/master/getAllPartyLedgerReport?branch=${formData.branch}&orgId=${orgId}&partyName=${formData.partyName}&partyType=${formData.partyType}`
          );
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.partyMasterVO || []);
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
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        {/* <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Search" icon={SearchIcon} isLoading={isLoading} onClick={handleGo} margin="0 10px 0 10px" />
          </div>
        </div> */}
        <>
          <div className="row mb-2">
            <div
              className="col-md-2
               mb-3"
            >
              <FormControlLabel
                control={<Checkbox checked={selectedSections.date} onChange={handleCheckboxChange} name="date" color="secondary" />}
                label="Date"
              />
            </div>
            <div className="col-md-2 mb-3">
              <FormControlLabel
                control={<Checkbox checked={selectedSections.customer} onChange={handleCheckboxChange} name="customer" color="secondary" />}
                label="Customer"
              />
            </div>
            <div className="col-md-2 mb-3">
              <FormControlLabel
                control={
                  <Checkbox checked={selectedSections.branch} onChange={handleCheckboxChange} name="branch" color="secondary" />
                }
                label="Branch"
              />
            </div>
            {/* <div className="col-md-2 mb-3">
              <FormControlLabel
                control={
                  <Checkbox checked={selectedSections.withDetails} onChange={handleCheckboxChange} name="withDetails" color="secondary" />
                }
                label="With Details"
              />
            </div> */}
            <div className="col-md-2 mb-3">
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
          <div className="row">
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
            {visibleSections.branch && (
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branch}>
                  <InputLabel id="branch-label">Branch</InputLabel>
                  <Select
                    labelId="branch-label"
                    label="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    name="branch"
                  >
                    <MenuItem value="All">All</MenuItem>

                    {branchCodeList?.map((row) => (
                      <MenuItem key={row.id} value={row.branch}>
                        {row.branch}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.branch && <FormHelperText>{fieldErrors.branch}</FormHelperText>}
                </FormControl>
              </div>
            )}
            {visibleSections.customer && (
              <>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partyType}>
                    <InputLabel id="partyType-label">Party Type</InputLabel>
                    <Select
                      labelId="partyType-label"
                      label="partyType"
                      value={formData.partyType}
                      onChange={handleSelectPartyChange}
                      name="partyType"
                    >
                      <MenuItem value="All">All</MenuItem>

                      {partyTypeList?.map((row) => (
                        <MenuItem key={row.id} value={row.partyType}>
                          {row.partyType}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.partyType && <FormHelperText>{fieldErrors.partyType}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partyName}>
                    <InputLabel id="partyName-label">Party Name</InputLabel>
                    <Select
                      labelId="partyName-label"
                      label="partyName"
                      value={formData.partyName}
                      onChange={handleInputChange}
                      name="partyName"
                    >
                      <MenuItem value="All">All</MenuItem>

                      {partyNameList?.map((row) => (
                        <MenuItem key={row.id} value={row.partyName}>
                          {row.partyName}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.partyName && <FormHelperText>{fieldErrors.partyName}</FormHelperText>}
                  </FormControl>
                </div>
              </>
            )}
            {/* {visibleSections.withDetails && (
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="withDetails">With Details</InputLabel>
                  <Select
                    labelId="withDetails"
                    name="withDetails"
                    value={formData.withDetails || ''}
                    onChange={handleInputChange}
                    label="With Details"
                    error={!!fieldErrors.withDetails}
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {fieldErrors.withDetails && <FormHelperText style={{ color: 'red' }}>{fieldErrors.withDetails}</FormHelperText>}
                </FormControl>
              </div>
            )} */}
            {(visibleSections.date || visibleSections.branch || visibleSections.customer) && (
              <div className="col-md-3 mb-3">
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
          <div className="mt-2">
            <CommonReportTable data={rowData} columns={reportColumns} />
          </div>
        )}
      </div>
    </>
  );
}

export default PartyLedger;