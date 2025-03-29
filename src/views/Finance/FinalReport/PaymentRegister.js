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
function PaymentReport() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [partyNameList, setPartyNameList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    vendor: false,
  });

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    vendor: false,
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
    vendorCode:'All'
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    vendor: '',
    vendorCode:'',
  });
  const handleClear = () => {
    setListView(false);
    setFormData({
      // dateRange: [null, null],
      fromDate: null,
      toDate: null,
      vendor: 'All',
      vendorCode: 'All',
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      vendor: '',
      vendorCode: '',
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
    { accessorKey: 'jobOrderNo', header: 'Job No', size: 180 },
    { accessorKey: 'vId', header: 'Invoice No', size: 180 },
    { accessorKey: 'vDate', header: 'Date', size: 140 },
    // { accessorKey: 'voucherNo', header: 'Voucher No', size: 180 },
    // { accessorKey: 'voucherDate', header: 'Voucher Date', size: 140 },
    // { accessorKey: '', header: 'Invoice Type', size: 140 },
    // { accessorKey: 'partyType', header: 'Party Type', size: 140 },
    { accessorKey: 'billToParty', header: 'Billing Party', size: 240 },
    // { accessorKey: 'controllingOff', header: 'Cont Office', size: 140 },
    // { accessorKey: 'billCurrency', header: 'Currency', size: 140 },
    // { accessorKey: 'billCurrencyRate', header: 'Ex. Rate', size: 140 },
    { accessorKey: 'totalTaxAmountBC', header: 'Total Inv Amt', size: 140 },
    { accessorKey: 'totalInvAmountLC', header: 'Total Inv Amt(LC)', size: 140 },
    { accessorKey: 'totalTaxableAmountLC', header: 'Total Taxable Amt', size: 140 },
    { accessorKey: 'gstType', header: 'GST Type', size: 140 },
    { accessorKey: 'totalTaxAmountLC', header: 'GST Amount', size: 140 },
    // { accessorKey: '', header: 'GST Amount(LC)', size: 140 },
    // { accessorKey: 'roundOffAmountLC', header: 'Round Amount', size: 140 },
    // { accessorKey: '', header: 'Amount', size: 140 },
    // { accessorKey: '', header: 'Amount(LC)', size: 140 },
  ];
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
            `/taxInvoice/getReportDetailsForSalesRegister?finyear=${finYear}&fromDate=${formData.fromDate}&orgId=${orgId}&partyCode=${formData.vendorCode}&toDate=${formData.toDate}`
          );
        }else {
          response = await apiCalls(
            'get',
            `/taxInvoice/getReportDetailsForSalesRegister?finyear=${finYear}&orgId=${orgId}&partyCode=${formData.vendorCode}`
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
              {visibleSections.vendor && ( 
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
              {(visibleSections.date || visibleSections.vendor) && (
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

export default PaymentReport;
