import React from 'react';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ClearIcon from '@mui/icons-material/Clear';
import ActionButton from 'utils/ActionButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { showToast } from 'utils/toast-component';
import CommonReportTable from 'utils/CommonReportTable';
import Button from '@mui/material/Button';
function ArAging() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [customerNameList, setcustomerNameList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    customerName: false,
    dueDate: false,
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };
  
  const [formData, setFormData] = useState({
    asOnDate: null,
    customerName: 'All',
    dueDate: null
  });
  const [fieldErrors, setFieldErrors] = useState({
    asOnDate: '',
    customerName: '',
    dueDate: ''
  });
  const handleClear = () => {
    setListView(false);
    setFormData({
      asOnDate: null,
      customerName: 'All',
      dueDate: null
    });
    setFieldErrors({
      asOnDate: '',
      customerName: '',
      dueDate: ''
    });
    setRowData([]);
  };
  useEffect(() => {
    getcustomerName();
  }, []);
  const getcustomerName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=customer`);
      setcustomerNameList(response.paramObjectsMap.partyMasterVO);
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
        customerName: "All",
      }));
    } else {
      const selectedParty = customerNameList.find((emp) => emp.partyName === value);
      if (selectedParty) {
        console.log('Selected party:', selectedParty);
        setFormData((prevData) => ({
          ...prevData,
          customerName: selectedParty.partyName,
        }));
      } else {
        console.log('No Account found with the given code:', value);
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
  
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
      let inputValue = value;
      if (type === 'text' || type === 'textarea') {
        inputValue = value.toUpperCase();
      }
      setFormData((prevData) => ({ ...prevData, [name]: inputValue }));
  };
  const handleDateChange = (field, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };  
  const reportColumns = [
    { accessorKey: 'docid', header: '# Invoice', size: 110 },
    { accessorKey: 'docdate', header: 'Date', size: 90 },
    { accessorKey: 'duedate', header: 'Due Date', size: 90 },
    { accessorKey: 'amount', header: 'Inv. Amt', size: 120 },
    { accessorKey: 'outstanding', header: 'Outstanding', size: 110 },
    { accessorKey: 'totaldue', header: 'Total Due', size: 110 },
    { accessorKey: 'unadjusted', header: 'Unadjusted', size: 110 },
    { accessorKey: 'mslab1', header: 'Below 30 Days', size: 120 },
    { accessorKey: 'mslab2', header: 'Days 30 - 60', size: 120 },
    { accessorKey: 'mslab3', header: 'Days 60 - 90', size: 120 },
    { accessorKey: 'mslab4', header: 'Days 90 - 120', size: 120 },
    { accessorKey: 'mslab5', header: 'Days 120+', size: 120 },
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
        if(formData.dueDate){
          response = await apiCalls(
            'get',
            `/arapAdjustments/GetArapAgeing?asondate=${formData.asOnDate}&orgId=${orgId}&partyname=${formData.customerName}&pdate=${formData.dueDate}`
          );
        }else {
          response = await apiCalls(
            'get',
            `/arapAdjustments/GetArapAgeing?asondate=${formData.asOnDate}&orgId=${orgId}&partyname=${formData.customerName}`
          );
        }
        if (response.status === true) {
          console.log('Response:', response.paramObjectsMap);
          setRowData(response.paramObjectsMap.mapp || '');
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
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.customerName} onChange={handleCheckboxChange} name="customerName" color="secondary" />}
                  label="Customer Name"
                />
              </div>
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.dueDate}  onChange={handleCheckboxChange} name="dueDate" color="secondary" />}
                  label="Due Date"
                />
              </div>
              <div className="col-md-2 mb-3">
                {/* <Button
                  onClick={handleProceed}
                  color="secondary"
                  variant="contained"
                  style={{ textTransform: 'none', padding: '4px 8px', marginTop: '6px' }}
                  disabled={isLoading}
                >
                  Proceed
                </Button> */}
              </div>
              </div>
              {selectedSections.date && (
                <>
                  <div className="col-md-3 mb-3">
                     <FormControl fullWidth variant="filled" size="small">
                      <LocalizationProvider dateAdapter={AdapterDayjs}> 
                         <DatePicker 
                          label="As On Date"
                          value={formData.asOnDate ? dayjs(formData.asOnDate, 'YYYY-MM-DD') : null}
                          onChange={(date) => handleDateChange('asOnDate', date)}
                          slotProps={{
                            textField: { size: 'small', clearable: true, error: fieldErrors.asOnDate, helperText: fieldErrors.asOnDate }
                          }}
                          format="DD-MM-YYYY"
                        />
                       </LocalizationProvider>
                    </FormControl> 
                  </div>
                </>
              )}
              {selectedSections.customerName && ( 
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                  <InputLabel id="customerName-label">Customer Name</InputLabel>
                  <Select
                  type='text'
                    labelId="customerName-label"
                    label="customerName"
                    value={formData.customerName}
                    onChange={handleSelectAccountChange}
                    name="customerName"
                  >
                    <MenuItem value="All">All</MenuItem>

                    {customerNameList?.map((row) => (
                      <MenuItem key={row.id} value={row.partyName}>
                        {row.partyName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.customerName && <FormHelperText>{fieldErrors.customerName}</FormHelperText>}
                </FormControl>
              </div>
              )}           
              {selectedSections.dueDate && ( 
                  <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                   <LocalizationProvider dateAdapter={AdapterDayjs}> 
                      <DatePicker 
                       label="Due Date"
                       value={formData.dueDate ? dayjs(formData.dueDate, 'YYYY-MM-DD') : null}
                       onChange={(date) => handleDateChange('dueDate', date)}
                       slotProps={{
                         textField: { size: 'small', clearable: true, error: fieldErrors.dueDate, helperText: fieldErrors.dueDate }
                       }}
                       format="DD-MM-YYYY"
                     />
                    </LocalizationProvider>
                 </FormControl> 
               </div>
              )}
              {(selectedSections.date || selectedSections.customerName || selectedSections.dueDate) && (
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
          <div className="mt-4">
            <CommonReportTable data={rowData} columns={reportColumns} isListView={listView}/>
          </div>
        )}
  </div>
    </>
  )
}

export default ArAging;
