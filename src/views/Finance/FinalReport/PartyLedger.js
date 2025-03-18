import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Button, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import CommonReportTable from 'utils/CommonReportTable';

import { showToast } from 'utils/toast-component';

export const PartyLedger = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [branch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [branchList, setBranchList] = useState([]);
  const [partyList, setPartyList] = useState([]);

  const [formData, setFormData] = useState({
    startDate: dayjs(),
    endDate: dayjs(),
    partyName: '',
    branchCode: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    startDate: '',
    endDate: '',
    partyName: '',
    branchCode: ''
  });
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    branch: false,
    customer: false,
    withDetails: false
  });

  const handleProceed = () => {
    setVisibleSections({
      date: visibleSections.date,
      branch: visibleSections.branch,
      customer: visibleSections.customer,
      withDetails: visibleSections.withDetails
    });
  };

  const reportColumns = [
    { accessorKey: 'docId', header: 'Part No', size: 140 },
    { accessorKey: 'docDate', header: 'Part Desc', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'bankCash', header: 'Bank/Cash A/C', size: 140 },
    { accessorKey: 'receiptAmount', header: 'Receipt Amount', size: 140 },
    { accessorKey: 'bankCharges', header: 'Bank Charges', size: 140 },
    // { accessorKey: 'sTaxAmount', header: 'S. Tax Amount', size: 140 },
    { accessorKey: 'tdsAmount', header: 'TDS Amount', size: 140 },
    { accessorKey: 'invoiceNo', header: 'Invoice No', size: 140 },
    { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'refDate', header: 'Ref Date', size: 140 },
    { accessorKey: 'chequeBank', header: 'Cheque Bank', size: 140 },
    { accessorKey: 'chequeNo', header: 'Cheque No', size: 140 },
    { accessorKey: 'amount', header: 'Amount', size: 140 },
    { accessorKey: 'outstanding', header: 'Outstanding', size: 140 },
    { accessorKey: 'setteled', header: 'Settled', size: 140 },
    { accessorKey: 'createdOn', header: 'Created On', size: 140 },
    { accessorKey: 'createdBy', header: 'Created By', size: 140 }
  ];
  useEffect(() => {
    getAllBranches();
    getAllPartyName();
  }, []);

  // const getAllPartNo = async () => {
  //   try {
  //     const partData = await getAllActivePartDetails(loginBranchCode, loginClient, orgId);
  //     console.log('THE PART DATA ARE:', partData);
  //     const allParts = [{ partno: 'ALL', partDesc: 'All Parts', id: null }, ...partData];

  //     setPartList(allParts);
  //   } catch (error) {
  //     console.error('Error fetching part data:', error);
  //   }
  // };
  //   const handleInputChange = (fieldName) => (event, value) => {
  //     if (value) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         [fieldName]: value[fieldName] // Dynamically set the correct field
  //       }));
  //     } else {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         [fieldName]: '' // Clear the field if no value is selected
  //       }));
  //     }

  //     setFieldErrors((prevErrors) => ({
  //       ...prevErrors,
  //       [fieldName]: '' // Reset error for the field
  //     }));
  //   };

  //   const handleInputChange = (event) => {
  //     const { name, checked } = event.target;
  //     setVisibleSections((prevState) => ({
  //       ...prevState,
  //       [name]: checked
  //     }));
  //   };

  const handleInputChange = (event) => {
    if (!event || !event.target) return; // Prevents crashing if event or event.target is undefined
    const { name, checked } = event.target;
    setVisibleSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleDateChange = (field, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: date ? dayjs(date).format('YYYY-MM-DD') : null // Format to 'YYYY-MM-DD'
    }));
  };

  const handleSearch = async () => {
    const errors = {};
    if (!formData.partyName) {
      errors.partyName = 'Sub ledger name is required';
    }
    // if (!formData.branchCode) {
    //   errors.branchCode = 'Branch Code is required';
    // }
    const saveFormData = {
      subLedgerName: formData.partyName,
      branchCode: formData.branchCode,
      fromDate: formData.startDate ? dayjs(formData.startDate).format('YYYY-MM-DD') : null,
      toDate: formData.endDate ? dayjs(formData.endDate).format('YYYY-MM-DD') : null
    };
    console.log('THE SAVE FORM DATA IS:', saveFormData);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const response = await apiCalls(
          'get',
          `/payable/getAllPaymentRegister?orgId=${orgId}&fromDate=${saveFormData.fromDate}&toDate=${saveFormData.toDate}&subLedgerName=${saveFormData.subLedgerName}`
        );
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.PartyMasterVO);
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

  const handleClear = () => {
    setFormData({
      startDate: dayjs(),
      endDate: dayjs(),
      partyName: '',
      branchCode: ''
    });
    setFieldErrors({
      startDate: '',
      partyName: '',
      branchCode: ''
    });
    setListView(false);
  };

  const handleView = () => {
    setListView(!listView);
  };

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  const getAllPartyName = async () => {
    try {
      const response = await apiCalls('get', `/payable/getPartyNameAndCodeForPayment?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setPartyList(response.paramObjectsMap.PartyMasterVO);
        console.log('Test===>', response.paramObjectsMap.PartyMasterVO);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row mb-3">
          <div className="col-md-2 mb-3">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleSections.date}
                    onChange={handleInputChange}
                    name="date"
                    sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                  />
                }
                label="Date"
              />
            </FormGroup>
          </div>
          <div className="col-md-2 mb-3">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleSections.branch}
                    onChange={handleInputChange}
                    name="branch"
                    sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                  />
                }
                label="Branch"
              />
            </FormGroup>
          </div>
          <div className="col-md-2 mb-3">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleSections.customer}
                    onChange={handleInputChange}
                    name="customer"
                    sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                  />
                }
                label="Customer"
              />
            </FormGroup>
          </div>

          <div className="col-md-2 mb-3">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleSections.withDetails}
                    onChange={handleInputChange}
                    name="withDetails"
                    sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                  />
                }
                label="Details"
              />
            </FormGroup>
          </div>
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
                      label="Start Date"
                      value={formData.startDate ? dayjs(formData.startDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('startDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.startDate}
                      helperText={fieldErrors.startDate && 'Required'}
                      maxDate={dayjs()}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
                      value={formData.endDate ? dayjs(formData.endDate, 'YYYY-MM-DD') : null}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      // disabled
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
            </>
          )}
          {visibleSections.branch && (
            <>
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={branchList}
                  getOptionLabel={(option) => option.branchCode}
                  sx={{ width: '100%' }}
                  size="small"
                  value={
                    branchList.length === 1
                      ? branchList[0]
                      : formData.branchCode
                        ? branchList.find((p) => p.branchCode === formData.branchCode)
                        : null
                  }
                  onChange={handleInputChange('branchCode')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Branch Code"
                      error={!!fieldErrors.branchCode}
                      helperText={fieldErrors.branchCode}
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                    />
                  )}
                />
              </div>

              <div className="col-md-3 mb-3"></div>
            </>
          )}
          {visibleSections.customer && (
            <>
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={partyList}
                  getOptionLabel={(option) => option.partyName}
                  sx={{ width: '100%' }}
                  size="small"
                  value={
                    partyList.length === 1
                      ? partyList[0]
                      : formData.partyName
                        ? partyList.find((p) => p.partyName === formData.partyName)
                        : null
                  }
                  onChange={handleInputChange('partyName')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="SubLedger Type"
                      error={!!fieldErrors.partyName}
                      helperText={fieldErrors.partyName}
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={partyList}
                  getOptionLabel={(option) => option.partyName}
                  sx={{ width: '100%' }}
                  size="small"
                  value={
                    partyList.length === 1
                      ? partyList[0]
                      : formData.partyName
                        ? partyList.find((p) => p.partyName === formData.partyName)
                        : null
                  }
                  onChange={handleInputChange('partyName')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="SubLedger Name"
                      error={!!fieldErrors.partyName}
                      helperText={fieldErrors.partyName}
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                    />
                  )}
                />
              </div>
            </>
          )}
          {visibleSections.withDetails && (
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">With Details</InputLabel>
                <Select
                  labelId="withDetails"
                  name="withDetails"
                  value={formData.withDetails}
                  onChange={handleInputChange}
                  disabled={formData.mode === 'SUBMIT'}
                  label="With Details"
                  error={!!fieldErrors.withDetails}
                  helperText={fieldErrors.withDetails}
                >
                  <MenuItem value="YES">YES</MenuItem>
                  <MenuItem value="NO">NO</MenuItem>
                </Select>
                {fieldErrors.withDetails && <FormHelperText style={{ color: 'red' }}>{fieldErrors.withDetails}</FormHelperText>}
              </FormControl>
            </div>
          )}
          {(visibleSections.date || visibleSections.branch || visibleSections.customer || visibleSections.withDetails) && (
            <div className="col-md-3 mb-3">
              <div className="row d-flex ml">
                <div className="d-flex flex-wrap justify-content-start mb-4 mt-1" style={{ marginBottom: '20px' }}>
                  <ActionButton title="Search" icon={SearchIcon} onClick={handleSearch} isLoading={isLoading} />
                  <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
                </div>
              </div>
            </div>
          )}
        </div>
        {listView && (
          <div className="mt-4">
            <CommonReportTable data={rowData} columns={reportColumns} />
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default PartyLedger;
