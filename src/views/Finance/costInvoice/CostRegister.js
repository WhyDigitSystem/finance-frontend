import React from 'react';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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

function CostRegister() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [listView, setListView] = useState(false);
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [rowData, setRowData] = useState([]);

  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branch: false,
    customer: false,
  });

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    branch: false,
    customer: false,
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
    branchCode: '',
    customer: 'All',
    customerCode:'All'
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: null,
    toDate: null,
    branchCode: '',
    customerCode:'',
    branchCode: '',
  });
  const handleClear = () => {
    setVisibleSections({
      date: false,
      branchCode: false,
      customer: false,
    });
    setSelectedSections({
      date: false,
      branchCode: false,
      customer: false,
    });
    setFormData({
      dateRange: [null, null],
      branchCode: 'All',
      customer: 'All',
      customerCode: 'All',
    });
    setFieldErrors({
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
  };

  const handleInputChange = (e) => {
    const { name, value, type, selectionStart, selectionEnd } = e.target;
  
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  
    if (name === 'branchCode') {
      const selectedBranch = branchCodeList.find((br) => br.branchCode === value);
      setFormData((prevData) => ({
        ...prevData,
        branchCode: selectedBranch ? selectedBranch.branchCode : '', // Avoids undefined error
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
  const handleDateChange = (newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      dateRange: newValue,
    }));
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
      customer: formData.customerCode,
      fromDate: formData.startDate ? dayjs(formData.startDate).format('YYYY-MM-DD') : null,
      toDate: formData.endDate ? dayjs(formData.endDate).format('YYYY-MM-DD') : null
    };
    console.log('THE SAVE FORM DATA IS:', saveFormData);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if(formData.fromDate && formData.toDate){
          response = await apiCalls(
            'get',
            `/taxInvoice/getReportDetailsForSalesRegister?branchCode=${formData.branchCode}&finyear=${finYear}&fromDate=${formData.fromDate}&orgId=${orgId}&partyCode=${formData.customerCode}&toDate=${formData.toDate}`
          );
        }else {
          response = await apiCalls(
            'get',
            `/taxInvoice/getReportDetailsForSalesRegister?branchCode=${formData.branchCode}&finyear=${finYear}&orgId=${orgId}&partyCode=${formData.customerCode}`
          );
        }
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
            <ActionButton title="Search" icon={SearchIcon} isLoading={isLoading} onClick={handleGo} margin="0 10px 0 10px" />
          </div>
        </div>
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
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.customer} onChange={handleCheckboxChange} name="customer" color="secondary" />}
                  label="Customer"
                />
              </div>
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.branchCode}  onChange={handleCheckboxChange} name="branchCode" color="secondary" />}
                  label="Branch Code"
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
              {/* <Button onClick={() => setShowFields(true)} color="secondary">Proceed</Button> */}
             
              {visibleSections.date && (
                <>
                  {/* <div className="col-md-3 mb-3"> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div className="col-md-6 mb-3">
                        <FormControl fullWidth variant="outlined" size="small">
                          <DateRangePicker
                            value={formData.dateRange}
                            onChange={handleDateChange}
                            format="DD-MM-YYYY"
                          />
                        </FormControl>
                      </div>
                    </LocalizationProvider>
                    {/* </div> */}
                  {/* <div className="col-md-3 mb-3">
                    {/* <FormControl fullWidth variant="filled" size="small">
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
                        </DemoItem>
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
                        </DemoItem>
                       </LocalizationProvider>
                    </FormControl> 
                  </div> */}
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
              <div className="col-md-3 mb-3">
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
