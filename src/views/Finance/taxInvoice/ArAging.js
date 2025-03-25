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
function ArAging() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [partyNameList, setpartyNameList] = useState([]);
  const [branchList, setbranchList] = useState([]);
  const [optionList, setoptionList] = useState([]);
  const [divisionList, setdivisionList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    partyName: false,
    branch: false,
    division: false,
    option: false,
  });

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    partyName: false,
    branch: false,
    division: false,
    option: false,
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
    // fromDate: null,
    asOnDate: null,
    // dateRange: [null, null],
    partyName: 'All',
    branch: 'All',
    division: 'All',
    option: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    // fromDate: '',
    asOnDate: '',
    partyName: '',
    branch: '',
    division: '',
    option: '',
  });
  const handleClear = () => {
    setListView(false);
    setFormData({
      // dateRange: [null, null],
      // fromDate: null,
      asOnDate: null,
      partyName: 'All',
      branch: 'All',
      division: 'All',
      option: '',
    });
    setFieldErrors({
      // fromDate: '',
      asOnDate: '',
      partyName: '',
      branch: '',
      division: '',
      option: '',
    });
    setRowData([]);
  };
  useEffect(() => {
    getAllBranches();
    getpartyName();
  }, []);
  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setbranchList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getpartyName = async () => {
    try {
      const response = await apiCalls('get', `/master/getAllGroupLedgerByOrgId?orgId=${orgId}`);
      setpartyNameList(response.paramObjectsMap.groupLedgerVO);
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
        partyName: "All",
      }));
    } else {
      const selectedEmp = partyNameList.find((emp) => emp.accountGroupName === value);
  
      if (selectedEmp) {
        console.log('Selected party:', selectedEmp);
        setFormData((prevData) => ({
          ...prevData,
          partyName: selectedEmp.accountGroupName,
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
  
    if (name === 'branch') {
      if (value === "All") {
        setFormData((prevData) => ({
          ...prevData,
          branch: "All",
        }));
      } else {
        const selectedBranch = branchList.find((br) => br.branch === value);
        setFormData((prevData) => ({
          ...prevData,
          branch: selectedBranch ? selectedBranch.branch : '',
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
    { accessorKey: 'dueDate', header: 'Due Date', size: 140 },
    { accessorKey: 'partyName', header: 'Inv. Amt', size: 300 },
    { accessorKey: 'opbal', header: 'Outstanding', size: 140 },
    { accessorKey: 'ndAmount', header: 'Total Due', size: 140 },
    { accessorKey: 'ncAmount', header: 'Unadjusted', size: 140 },
    { accessorKey: 'dbAmount', header: 'Below 30 Days', size: 140 },
    { accessorKey: 'dbAmount', header: 'Days 30 - 60', size: 140 },
    { accessorKey: 'dbAmount', header: 'Days 60 - 90', size: 140 },
    { accessorKey: 'dbAmount', header: 'Days 90 - 120', size: 140 },
    { accessorKey: 'dbAmount', header: 'Days 120+', size: 140 },
  ];
  const handleGo = async () => {
    const errors = {};
    // if (!formData.partyName) {
    //   errors.partyName = 'Sub ledger name is required';
    // }
    // if (!formData.branch) {
    //   errors.branch = 'Branch Code is required';
    // }
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if(formData.asOnDate){
          response = await apiCalls(
            'get',
            `/master/getAllLedgerReport?partyName=${formData.partyName}&branch=${formData.branch}&orgId=${orgId}&asOnDate=${formData.asOnDate}`
          );
        }else {
          response = await apiCalls(
            'get',
            `/master/getAllLedgerReport?&partyName=${formData.partyName}&orgId=${orgId}&branch=${formData.branch}`
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
               mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.date} onChange={handleCheckboxChange} name="date" color="secondary" />}
                  label="Date"
                />
              </div>
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.partyName} onChange={handleCheckboxChange} name="partyName" color="secondary" />}
                  label="Party Name"
                />
              </div>
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.branch}  onChange={handleCheckboxChange} name="branch" color="secondary" />}
                  label="Branch"
                />
              </div>
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.division}  onChange={handleCheckboxChange} name="division" color="secondary" />}
                  label="Division"
                />
              </div>
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.option}  onChange={handleCheckboxChange} name="option" color="secondary" />}
                  label="Option"
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
              {visibleSections.date && (
                <>
                  
                  {/* <div className="col-md-3 mb-3">
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
                  </div> */}
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
              {visibleSections.partyName && ( 
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partyName}>
                  <InputLabel id="partyName-label">Party Name</InputLabel>
                  <Select
                  type='text'
                    labelId="partyName-label"
                    label="partyName"
                    value={formData.partyName}
                    onChange={handleSelectAccountChange}
                    name="partyName"
                  >
                    <MenuItem value="All">All</MenuItem>

                    {partyNameList?.map((row) => (
                      <MenuItem key={row.id} value={row.accountGroupName}>
                        {row.accountGroupName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.partyName && <FormHelperText>{fieldErrors.partyName}</FormHelperText>}
                </FormControl>
              </div>
              )}
              {visibleSections.division && ( 
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.division}>
                  <InputLabel id="division-label">Division</InputLabel>
                  <Select
                  type='text'
                    labelId="division-label"
                    label="division"
                    value={formData.division}
                    onChange={handleSelectAccountChange}
                    name="division"
                  >
                    <MenuItem value="All">All</MenuItem>

                    {divisionList?.map((row) => (
                      <MenuItem key={row.id} value={row.accountGroupName}>
                        {row.accountGroupName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.division && <FormHelperText>{fieldErrors.division}</FormHelperText>}
                </FormControl>
              </div>
              )}
              {visibleSections.option && ( 
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.option}>
                  <InputLabel id="option-label">Option</InputLabel>
                  <Select
                  type='text'
                    labelId="option-label"
                    label="option"
                    value={formData.option}
                    onChange={handleSelectAccountChange}
                    name="option"
                  >
                    <MenuItem value="All">All</MenuItem>

                    {optionList?.map((row) => (
                      <MenuItem key={row.id} value={row.accountGroupName}>
                        {row.accountGroupName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.option && <FormHelperText>{fieldErrors.option}</FormHelperText>}
                </FormControl>
              </div>
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

                    {branchList?.map((row) => (
                      <MenuItem key={row.id} value={row.branch}>
                        {row.branch}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.branch && <FormHelperText>{fieldErrors.branch}</FormHelperText>}
                </FormControl>
              </div>
              )}
              {(visibleSections.date || visibleSections.partyName || visibleSections.branch) && (
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
            <CommonReportTable data={rowData} columns={reportColumns} />
          </div>
        )}
  </div>
    </>
  )
}

export default ArAging;
