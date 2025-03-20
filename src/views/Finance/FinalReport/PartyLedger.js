import React from 'react';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import ActionButton from 'utils/ActionButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
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
    branchCode: false,
    customer: false,
    withDetails: false
  });

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    branchCode: false,
    customer: false,
    withDetails: false
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
    branchCode: 'All',
    partyName: 'All',
    partyType: 'All'
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branchCode: '',
    partyName: '',
    partyType: ''
  });
  const handleClear = () => {
    setListView(false);
    setVisibleSections({
      date: false,
      branchCode: false,
      customer: false,
      withDetails: false
    });
    setSelectedSections({
      date: false,
      branchCode: false,
      customer: false,
      withDetails: false
    });
    setFormData({
      // dateRange: [null, null],
      fromDate: null,
      toDate: null,
      branchCode: 'All',
      partyName: 'All',
      partyType: 'All'
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      partyName: '',
      partyType: '',
      branchCode: ''
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
      partyName: 'All' // Reset partyName when partyType changes
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

    if (name === 'branchCode') {
      const selectedBranch = branchCodeList.find((br) => br.branchCode === value);
      setFormData((prevData) => ({
        ...prevData,
        branchCode: selectedBranch ? selectedBranch.branchCode : '' // Avoids undefined error
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
    { accessorKey: 'branchCode', header: 'Branch', size: 140 },
    { accessorKey: 'jobOrderNo', header: 'Job No', size: 140 },
    { accessorKey: 'docId', header: 'Doc No', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'voucherNo', header: 'Voucher No', size: 140 },
    { accessorKey: 'voucherDate', header: 'Voucher Date', size: 140 },
    // { accessorKey: '', header: 'Invoice Type', size: 140 },
    { accessorKey: 'partyType', header: 'Party Type', size: 140 },
    { accessorKey: 'billToParty', header: 'Billing Party', size: 140 },
    { accessorKey: 'controllingOff', header: 'Cont Office', size: 140 },
    { accessorKey: 'billCurrency', header: 'Currency', size: 140 },
    { accessorKey: 'billCurrencyRate', header: 'Ex. Rate', size: 140 },
    { accessorKey: 'totalTaxAmountBC', header: 'Total Inv Amt', size: 140 },
    { accessorKey: 'totalInvAmountLC', header: 'Total Inv Amt(LC)', size: 140 },
    { accessorKey: 'totalTaxableAmountLC', header: 'Total Taxable Amt', size: 140 },
    { accessorKey: 'gstType', header: 'GST Type', size: 140 },
    { accessorKey: 'totalTaxAmountLC', header: 'GST Amount', size: 140 },
    // { accessorKey: '', header: 'GST Amount(LC)', size: 140 },
    { accessorKey: 'roundOffAmountLC', header: 'Round Amount', size: 140 }
    // { accessorKey: '', header: 'Amount', size: 140 },
    // { accessorKey: '', header: 'Amount(LC)', size: 140 },
  ];
  const handleGo = async () => {
    const errors = {};
    // if (!formData.partyName) {
    //   errors.partyName = 'Sub ledger name is required';
    // }
    // if (!formData.branchCode) {
    //   errors.branchCode = 'Branch Code is required';
    // }
    const saveFormData = {
      branchCode: formData.branchCode,
      partyName: formData.partyName,
      partyType: formData.partyType,
      fromDate: formData.startDate ? dayjs(formData.startDate).format('YYYY-MM-DD') : null,
      toDate: formData.endDate ? dayjs(formData.endDate).format('YYYY-MM-DD') : null
    };
    console.log('THE SAVE FORM DATA IS:', saveFormData);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if (formData.fromDate && formData.toDate) {
          response = await apiCalls(
            'get',
            `/master/getAllPartyLedgerReport?branchCode=${formData.branchCode}&finyear=${finYear}&fromDate=${formData.fromDate}&orgId=${orgId}&partyName=${formData.partyName}&toDate=${formData.toDate}`
          );
        } else {
          response = await apiCalls(
            'get',
            `/master/getAllPartyLedgerReport?branchCode=${formData.branchCode}&finyear=${finYear}&orgId=${orgId}&partyName=${formData.partyName}`
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
                  <Checkbox checked={selectedSections.branchCode} onChange={handleCheckboxChange} name="branchCode" color="secondary" />
                }
                label="Branch"
              />
            </div>
            <div className="col-md-2 mb-3">
              <FormControlLabel
                control={
                  <Checkbox checked={selectedSections.withDetails} onChange={handleCheckboxChange} name="withDetails" color="secondary" />
                }
                label="With Details"
              />
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
            {visibleSections.branchCode && (
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
            {visibleSections.withDetails && (
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
            )}
            {(visibleSections.date || visibleSections.branchCode || visibleSections.customer || visibleSections.withDetails) && (
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

// import ClearIcon from '@mui/icons-material/Clear';
// import SearchIcon from '@mui/icons-material/Search';
// import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
// import { Button, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
// import Autocomplete from '@mui/material/Autocomplete';
// import FormControl from '@mui/material/FormControl';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormGroup from '@mui/material/FormGroup';
// import { DatePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import apiCalls from 'apicall';
// import dayjs from 'dayjs';
// import { useEffect, useState } from 'react';
// import { ToastContainer } from 'react-toastify';
// import ActionButton from 'utils/ActionButton';
// import { getAllActiveBranches } from 'utils/CommonFunctions';
// import CommonReportTable from 'utils/CommonReportTable';

// import { showToast } from 'utils/toast-component';

// export const PartyLedger = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
//   const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
//   const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
//   const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
//   const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
//   const [branch, setLoginBranch] = useState(localStorage.getItem('branch'));
//   //   const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
//   const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
//   const [branchList, setBranchList] = useState([]);
//   const [partyList, setPartyList] = useState([]);
//   const [partyTypeList, setPartyTypeList] = useState([]);

//   const [formData, setFormData] = useState({
//     startDate: dayjs(),
//     endDate: dayjs(),
//     partyType: '',
//     partyName: '',
//     branchCode: ''
//   });
//   const [fieldErrors, setFieldErrors] = useState({
//     startDate: '',
//     endDate: '',
//     partyType: '',
//     partyName: '',
//     branchCode: ''
//   });
//   const [listView, setListView] = useState(false);
//   const [rowData, setRowData] = useState([]);

//   const [selectedSections, setSelectedSections] = useState({
//     date: false,
//     branch: false,
//     customer: false,
//     withDetails: false
//   });

//   const [visibleSections, setVisibleSections] = useState({
//     date: false,
//     branch: false,
//     customer: false,
//     withDetails: false
//   });

//   const handleCheckboxChange = (event) => {
//     const { name, checked } = event.target;
//     setSelectedSections((prevState) => ({
//       ...prevState,
//       [name]: checked
//     }));
//   };

//   const handleProceed = () => {
//     setVisibleSections({ ...selectedSections });
//   };

//   //   const handleProceed = () => {
//   //     setVisibleSections({
//   //       date: visibleSections.date,
//   //       branch: visibleSections.branch,
//   //       customer: visibleSections.customer,
//   //       withDetails: visibleSections.withDetails
//   //     });
//   //   };

//   const reportColumns = [
//     { accessorKey: 'docId', header: 'Part No', size: 140 },
//     { accessorKey: 'docDate', header: 'Part Desc', size: 140 },
//     { accessorKey: 'refNo', header: 'Ref No', size: 140 },
//     { accessorKey: 'bankCash', header: 'Bank/Cash A/C', size: 140 },
//     { accessorKey: 'receiptAmount', header: 'Receipt Amount', size: 140 },
//     { accessorKey: 'bankCharges', header: 'Bank Charges', size: 140 },
//     // { accessorKey: 'sTaxAmount', header: 'S. Tax Amount', size: 140 },
//     { accessorKey: 'tdsAmount', header: 'TDS Amount', size: 140 },
//     { accessorKey: 'invoiceNo', header: 'Invoice No', size: 140 },
//     { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 140 },
//     { accessorKey: 'refNo', header: 'Ref No', size: 140 },
//     { accessorKey: 'refDate', header: 'Ref Date', size: 140 },
//     { accessorKey: 'chequeBank', header: 'Cheque Bank', size: 140 },
//     { accessorKey: 'chequeNo', header: 'Cheque No', size: 140 },
//     { accessorKey: 'amount', header: 'Amount', size: 140 },
//     { accessorKey: 'outstanding', header: 'Outstanding', size: 140 },
//     { accessorKey: 'setteled', header: 'Settled', size: 140 },
//     { accessorKey: 'createdOn', header: 'Created On', size: 140 },
//     { accessorKey: 'createdBy', header: 'Created By', size: 140 }
//   ];
//   useEffect(() => {
//     getAllBranches();
//     getAllPartyName();
//     getAllPartyMasterByOrgId();
//   }, []);

//   // const getAllPartNo = async () => {
//   //   try {
//   //     const partData = await getAllActivePartDetails(loginBranchCode, loginClient, orgId);
//   //     console.log('THE PART DATA ARE:', partData);
//   //     const allParts = [{ partno: 'ALL', partDesc: 'All Parts', id: null }, ...partData];

//   //     setPartList(allParts);
//   //   } catch (error) {
//   //     console.error('Error fetching part data:', error);
//   //   }
//   // };
//   //   const handleInputChange = (fieldName) => (event, value) => {
//   //     if (value) {
//   //       setFormData((prevData) => ({
//   //         ...prevData,
//   //         [fieldName]: value[fieldName] // Dynamically set the correct field
//   //       }));
//   //     } else {
//   //       setFormData((prevData) => ({
//   //         ...prevData,
//   //         [fieldName]: '' // Clear the field if no value is selected
//   //       }));
//   //     }

//   //     setFieldErrors((prevErrors) => ({
//   //       ...prevErrors,
//   //       [fieldName]: '' // Reset error for the field
//   //     }));
//   //   };

//   //   const handleInputChange = (field) => (event, newValue) => {
//   //     if (field === 'partyType') {
//   //       const selectedPartyType = newValue ? newValue.partyType : '';
//   //       setFormData((prevData) => ({
//   //         ...prevData,
//   //         partyType: selectedPartyType,
//   //         partyName: '' // Reset partyName when partyType changes
//   //       }));

//   //       if (selectedPartyType) {
//   //         getPartyNameByPartyType(selectedPartyType);
//   //       }
//   //     } else {
//   //       setFormData((prevData) => ({
//   //         ...prevData,
//   //         [field]: newValue || (event?.target ? event.target.value : '')
//   //       }));
//   //     }
//   //   };

//   const handleInputChange = (event, newValue) => {
//     const { name, value } = event?.target || {}; // For standard input/select fields

//     setFormData((prevData) => {
//       if (name) {
//         // Handling Select and TextField Inputs
//         return { ...prevData, [name]: value };
//       } else if (newValue) {
//         // Handling Autocomplete Inputs
//         const fieldName = event?.currentTarget?.getAttribute('data-field'); // Custom attribute to detect field name
//         if (fieldName === 'partyType') {
//           getPartyNameByPartyType(newValue.partyType); // Fetch party names on selection
//           return { ...prevData, partyType: newValue.partyType, partyName: '' }; // Reset partyName when partyType changes
//         } else if (fieldName === 'partyName') {
//           return { ...prevData, partyName: newValue.partyName };
//         } else if (fieldName === 'branchCode') {
//           return { ...prevData, branchCode: newValue.branchCode };
//         }
//       }
//       return prevData;
//     });
//   };

//   //   const handleInputChange = (event) => {
//   //     const { name, checked } = event.target;
//   //     setVisibleSections((prevState) => ({
//   //       ...prevState,
//   //       [name]: checked
//   //     }));
//   //   };

//   //   const handleInputChange = (event) => {
//   //     if (!event || !event.target) return; // Prevents crashing if event or event.target is undefined
//   //     const { name, checked } = event.target;
//   //     setVisibleSections((prevState) => ({
//   //       ...prevState,
//   //       [name]: checked
//   //     }));
//   //   };

//   const handleDateChange = (field, date) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [field]: date ? dayjs(date).format('YYYY-MM-DD') : null // Format to 'YYYY-MM-DD'
//     }));
//   };

//   const handleSearch = async () => {
//     const errors = {};
//     if (!formData.partyName) {
//       errors.partyName = 'Party Name is required';
//     }
//     // if (!formData.branchCode) {
//     //   errors.branchCode = 'Branch Code is required';
//     // }
//     const saveFormData = {
//       subLedgerName: formData.partyName,
//       branchCode: formData.branchCode,
//       fromDate: formData.startDate ? dayjs(formData.startDate).format('YYYY-MM-DD') : null,
//       toDate: formData.endDate ? dayjs(formData.endDate).format('YYYY-MM-DD') : null
//     };
//     console.log('THE SAVE FORM DATA IS:', saveFormData);

//     if (Object.keys(errors).length === 0) {
//       setIsLoading(true);
//       try {
//         const response = await apiCalls(
//           'get',
//           `/payable/getAllPaymentRegister?orgId=${orgId}&fromDate=${saveFormData.fromDate}&toDate=${saveFormData.toDate}&subLedgerName=${saveFormData.subLedgerName}`
//         );
//         if (response.status === true) {
//           console.log('Response:', response);
//           setRowData(response.paramObjectsMap.PartyMasterVO);
//           setIsLoading(false);
//           setListView(true);
//         } else {
//           showToast('error', response.paramObjectsMap.errorMessage || 'Report Fetch failed');
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         showToast('error', 'Report Fetch failed');
//         setIsLoading(false);
//       }
//     } else {
//       setFieldErrors(errors);
//     }
//   };

//   const handleClear = () => {
//     setFormData({
//       startDate: dayjs(),
//       endDate: dayjs(),
//       partyType: '',
//       partyName: '',
//       branchCode: ''
//     });
//     setFieldErrors({
//       startDate: '',
//       partyType: '',
//       partyName: '',
//       branchCode: ''
//     });
//     setListView(false);
//   };

//   const handleView = () => {
//     setListView(!listView);
//   };

//   const getAllBranches = async () => {
//     try {
//       const branchData = await getAllActiveBranches(orgId);
//       setBranchList(branchData);
//     } catch (error) {
//       console.error('Error fetching country data:', error);
//     }
//   };

//   const getAllPartyName = async () => {
//     try {
//       const response = await apiCalls('get', `/payable/getPartyNameAndCodeForPayment?orgId=${orgId}`);
//       console.log('API Response:', response);

//       if (response.status === true) {
//         setPartyList(response.paramObjectsMap.PartyMasterVO);
//         console.log('Test===>', response.paramObjectsMap.PartyMasterVO);
//       } else {
//         // Handle error
//         console.error('API Error:', response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const getAllPartyMasterByOrgId = async () => {
//     try {
//       const result = await apiCalls('get', `/master/getAllPartyTypeByOrgId?orgid=${orgId}`);
//       setPartyTypeList(result.paramObjectsMap.partyTypeVO || []);
//       console.log('Test', result);
//     } catch (err) {
//       console.log('error', err);
//     }
//   };

//   const getPartyNameByPartyType = async (partType) => {
//     try {
//       const response = await apiCalls('get', `/costInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=${partType}`);
//       setPartyList(response.paramObjectsMap.partyMasterVO);
//     } catch (error) {
//       console.error('Error fetching gate passes:', error);
//     }
//   };

//   return (
//     <>
//       <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
//         <div className="row mb-3">
//           <div className="col-md-2 mb-3">
//             <FormGroup>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={selectedSections.date}
//                     onChange={handleCheckboxChange}
//                     name="date"
//                     sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
//                   />
//                 }
//                 label="Date"
//               />
//             </FormGroup>
//           </div>
//           <div className="col-md-2 mb-3">
//             <FormGroup>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={selectedSections.branch}
//                     onChange={handleCheckboxChange}
//                     name="branch"
//                     sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
//                   />
//                 }
//                 label="Branch"
//               />
//             </FormGroup>
//           </div>
//           <div className="col-md-2 mb-3">
//             <FormGroup>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={selectedSections.customer}
//                     onChange={handleCheckboxChange}
//                     name="customer"
//                     sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
//                   />
//                 }
//                 label="Customer"
//               />
//             </FormGroup>
//           </div>

//           <div className="col-md-2 mb-3">
//             <FormGroup>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={selectedSections.withDetails}
//                     onChange={handleCheckboxChange}
//                     name="withDetails"
//                     sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
//                   />
//                 }
//                 label="Details"
//               />
//             </FormGroup>
//           </div>
//           <div className="col-md-2 mb-3">
//             <Button
//               onClick={handleProceed}
//               color="secondary"
//               variant="contained"
//               style={{ textTransform: 'none', padding: '4px 8px', marginTop: '6px' }}
//               disabled={isLoading}
//             >
//               Proceed
//             </Button>
//           </div>
//         </div>

//         <div className="row">
//           {visibleSections.date && (
//             <>
//               <div className="col-md-3 mb-3">
//                 <FormControl fullWidth variant="filled" size="small">
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DatePicker
//                       label="Start Date"
//                       value={formData.startDate ? dayjs(formData.startDate, 'YYYY-MM-DD') : null}
//                       onChange={(date) => handleDateChange('startDate', date)}
//                       slotProps={{
//                         textField: { size: 'small', clearable: true }
//                       }}
//                       format="DD-MM-YYYY"
//                       error={fieldErrors.startDate}
//                       helperText={fieldErrors.startDate && 'Required'}
//                       maxDate={dayjs()}
//                     />
//                   </LocalizationProvider>
//                 </FormControl>
//               </div>

//               <div className="col-md-3 mb-3">
//                 <FormControl fullWidth variant="filled" size="small">
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DatePicker
//                       label="End Date"
//                       value={formData.endDate ? dayjs(formData.endDate, 'YYYY-MM-DD') : null}
//                       slotProps={{
//                         textField: { size: 'small', clearable: true }
//                       }}
//                       format="DD-MM-YYYY"
//                       // disabled
//                     />
//                   </LocalizationProvider>
//                 </FormControl>
//               </div>
//             </>
//           )}
//           {visibleSections.branch && (
//             <>
//               <div className="col-md-3 mb-3">
//                 <Autocomplete
//                   disablePortal
//                   options={branchList}
//                   getOptionLabel={(option) => option.branchCode}
//                   sx={{ width: '100%' }}
//                   size="small"
//                   value={
//                     branchList.length === 1
//                       ? branchList[0]
//                       : formData.branchCode
//                         ? branchList.find((p) => p.branchCode === formData.branchCode)
//                         : null
//                   }
//                   onChange={(event, newValue) => handleInputChange(event, newValue)}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Branch Code"
//                       error={!!fieldErrors.branchCode}
//                       helperText={fieldErrors.branchCode}
//                       InputProps={{
//                         ...params.InputProps,
//                         style: { height: 40 }
//                       }}
//                     />
//                   )}
//                 />
//               </div>

//               {/* <div className="col-md-3 mb-3"></div> */}
//             </>
//           )}
//           {visibleSections.customer && (
//             <>
//               <div className="col-md-3 mb-3">
//                 <Autocomplete
//                   disablePortal
//                   options={partyTypeList}
//                   getOptionLabel={(option) => option.partyType}
//                   sx={{ width: '100%' }}
//                   size="small"
//                   value={
//                     partyTypeList.length === 1
//                       ? partyTypeList[0]
//                       : formData.partyType
//                         ? partyTypeList.find((p) => p.partyType === formData.partyType)
//                         : null
//                   }
//                   onChange={handleInputChange('partyType')}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Party Type"
//                       error={!!fieldErrors.partyType}
//                       helperText={fieldErrors.partyType}
//                       InputProps={{
//                         ...params.InputProps,
//                         style: { height: 40 }
//                       }}
//                     />
//                   )}
//                 />
//               </div>
//               <div className="col-md-3 mb-3">
//                 <Autocomplete
//                   disablePortal
//                   options={partyList}
//                   getOptionLabel={(option) => option.partyName}
//                   sx={{ width: '100%' }}
//                   size="small"
//                   value={
//                     partyList.length === 1
//                       ? partyList[0]
//                       : formData.partyName
//                         ? partyList.find((p) => p.partyName === formData.partyName)
//                         : null
//                   }
//                   onChange={(event, newValue) => handleInputChange(event, newValue)}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Party Name"
//                       error={!!fieldErrors.partyName}
//                       helperText={fieldErrors.partyName}
//                       InputProps={{
//                         ...params.InputProps,
//                         style: { height: 40 }
//                       }}
//                     />
//                   )}
//                 />
//               </div>
//             </>
//           )}
//           {visibleSections.withDetails && (
//             <div className="col-md-3 mb-3">
//               <FormControl fullWidth size="small">
//                 <InputLabel id="withDetails">With Details</InputLabel>
//                 <Select
//                   labelId="withDetails"
//                   name="withDetails"
//                   value={formData.withDetails || ''}
//                   onChange={handleInputChange}
//                   label="With Details"
//                   error={!!fieldErrors.withDetails}
//                 >
//                   <MenuItem value="YES">YES</MenuItem>
//                   <MenuItem value="NO">NO</MenuItem>
//                 </Select>
//                 {fieldErrors.withDetails && <FormHelperText style={{ color: 'red' }}>{fieldErrors.withDetails}</FormHelperText>}
//               </FormControl>
//             </div>
//           )}
//           {(visibleSections.date || visibleSections.branch || visibleSections.customer || visibleSections.withDetails) && (
//             <div className="col-md-3 mb-3">
//               <div className="row d-flex ml">
//                 <div className="d-flex flex-wrap justify-content-start mb-4 mt-1" style={{ marginBottom: '20px' }}>
//                   <ActionButton title="Search" icon={SearchIcon} onClick={handleSearch} isLoading={isLoading} />
//                   <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//         {listView && (
//           <div className="mt-4">
//             <CommonReportTable data={rowData} columns={reportColumns} />
//           </div>
//         )}
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default PartyLedger;
