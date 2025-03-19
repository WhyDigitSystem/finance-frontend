import React from 'react';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import ClearIcon from '@mui/icons-material/Clear';
import ActionButton from 'utils/ActionButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { showToast } from 'utils/toast-component';
import CommonReportTable from 'utils/CommonReportTable';
function CostRegister() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [filters, setFilters] = useState({
    date: false,
    branchCode: false,
  });
  // const handleSwitchChange = (event) => {
  //   setFilters({ ...filters, [event.target.name]: event.target.checked });
  //   console.log("filter", event.target.checked);
    
  // };
  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };
  
  const handleSubmit = () => {
    const params = {};
    if (filters.startDate) params.startDate = formData.startDate;
    if (filters.endDate) params.endDate = formData.endDate;
    if (filters.branchCode) params.branchCode = formData.branchCode;

    console.log("API Call with Params:", params);
    // Call your API with these params
  };
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    branchCode: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: null,
    toDate: null,
    branchCode: '',
  });
  const handleClear = () => {
    setFilters({
      date: false,
      branchCode: false,
    });
    setFormData({
      fromDate: null,
      toDate: null,
      branchCode: '',
    });

    setFieldErrors({
      fromDate: '',
      toDate: '',
      branchCode: '',
    });
  };
  const handleInputChange = (e) => {
    const { name, value, type, selectionStart, selectionEnd } = e.target;
    const errors={};
    if(errors) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }else if (name === 'branchCode') {
        const selectedBranch = branchCodeList.find((br) => br.branchCode === value);
        setFormData((prevData) => ({
          ...prevData,
          branchCode: selectedBranch.branchCode,
          // branchCode: selectedBranch ? selectedBranch.branchCode : ''
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
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };
  // useEffect(() => {
  //   getAllBranches();
  // }, []);

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchCodeList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const reportColumns = [
    { accessorKey: 'branch', header: 'Branch', size: 140 },
    { accessorKey: 'srName', header: 'Sr Name', size: 140 },
    { accessorKey: 'docId', header: 'Doc No', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'partyType', header: 'Party Type', size: 140 },
    { accessorKey: 'partyName', header: 'Party Name', size: 140 },
    { accessorKey: 'pgstin', header: 'PGSTIN', size: 140 },
    { accessorKey: 'suppBillNo', header: 'Supplier Bill No', size: 140 },
    { accessorKey: 'suppBillDate', header: 'Supplier Bill Date', size: 140 },
    { accessorKey: 'gstType', header: 'GST Type', size: 140 },
    { accessorKey: 'charges', header: 'Charges', size: 140 },
    { accessorKey: 'igstip', header: 'IGST - I/P', size: 140 },
    { accessorKey: 'cgstip', header: 'CGST - I/P', size: 140 },
    { accessorKey: 'sgstip', header: 'SGST - I/P', size: 140 },
    { accessorKey: 'igstop', header: 'IGST - O/P', size: 140 },
    { accessorKey: 'cgstop', header: 'CGST - O/P', size: 140 },
    { accessorKey: 'sgstop', header: 'SGST - O/P', size: 140 }
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
  return(
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Go" icon={CachedIcon} isLoading={isLoading} onClick={handleGo} margin="0 10px 0 10px" />
          </div>
        </div>
        <>
            <div className="row">
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={filters.date} onChange={handleSwitchChange} name="date" color="secondary" />}
                  label="Date"
                />
              </div>
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={filters.branchCode} onChange={handleSwitchChange} name="branchCode" color="secondary" />}
                  label="Branch Code"
                />
              </div>
              {filters.date && (
                <>
                  <div className="col-md-3 mb-3">
                    <FormControl fullWidth variant="filled" size="small">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date of Birth"
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
                          label="Date of Join"
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
              {filters.branchCode && (
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
            </div>
          </>
        {listView && (
          <div className="mt-4">
            <CommonReportTable data={rowData} columns={reportColumns} />
          </div>
        )}
  </div>
    </>
  )
}

export default CostRegister;
