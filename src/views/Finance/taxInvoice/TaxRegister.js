import React from 'react';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Card, CardContent } from "@mui/material";
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
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [criteria, setCriteria] = useState({
    date: false,
    customer: false,
    branch: false,
  });
  const [filters, setFilters] = useState({ fromDate: "", toDate: "", customer: "All", branch: "All", customerCode:"All" });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: "",
    toDate: "",
    customer: "",
    branch: "",
    customerCode:""
  });
  const handleCriteriaChange = (event) => {
    setCriteria({ ...criteria, [event.target.name]: event.target.checked });
  };

  const handleInputChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };
  const handleClear = () => {
    setListView(false);
    // setVisibleSections({
    //   date: false,
    //   branchCode: false,
    //   customer: false,
    // });
    setCriteria({
      date: false,
      branch: false,
      customer: false,
    });
    setFilters({
      // dateRange: [null, null],
      fromDate: null,
      toDate: null,
      branch: 'All',
      customer: 'All',
      customerCode: 'All',
    });
    // setFieldErrors({
    //   fromDate: '',
    //   toDate: '',
    //   customer: '',
    //   customerCode: '',
    //   branchCode: '',
    // });
    setRowData([]);
  };
  const handleSelectPartyChange = (e) => {
    const value = e.target.value;
    console.log('Selected employeeCode value:', value);
    const selectedEmp = partyNameList.find((emp) => emp.partyName === value);
    if (value === "All") {
      setFilters((prevData) => ({
        ...prevData,
        customer: "All",
      }));
    } else {
    if (selectedEmp) {
      console.log('Selected party:', selectedEmp);
      setFilters((prevData) => ({
        ...prevData,
        customer: selectedEmp.partyName,
        customerCode: selectedEmp.partyCode,
      }));
    } else {
      console.log('No party found with the given code:', value);
    }
  }
  };
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFilters((prevData) => ({ ...prevData, [field]: formattedDate }));
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
    { accessorKey: 'jobOrderNo', header: 'Job No', size: 100 },
    { accessorKey: 'vId', header: '# Invoice', size: 100 },
    { accessorKey: 'vDate', header: 'Date', size: 100 },
    { accessorKey: 'billToParty', header: 'Customer', size: 240 },
    { accessorKey: 'billAmount', header: 'Amount', size: 80,     Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
      {cell.getValue() !== undefined && cell.getValue() !== null 
        ? Number(cell.getValue()).toLocaleString('en-IN') 
        : '-'}
      </div>)},
    { accessorKey: 'totalTaxAmountLC', header: 'TAX Amount', size: 80,
      Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
       {cell.getValue() !== undefined && cell.getValue() !== null 
         ? Number(cell.getValue()).toLocaleString('en-IN') 
         : '-'}
       </div>)}, 
    {
      accessorKey: 'totalInvAmountLC',
      header: 'Total Amount',
      size: 80,
      Cell: ({ cell }) => (<div style={{ textAlign: 'right', width: '100%' }}>
        {cell.getValue() !== undefined && cell.getValue() !== null 
        ? Number(cell.getValue()).toLocaleString('en-IN') 
        : '-'}
      </div>)},    
    ];
  const handleGo = async () => {
    const errors = {};
    // if (!filters.partyName) {
    //   errors.partyName = 'Sub ledger name is required';
    // }
    // if (!filters.branchCode) {
    //   errors.branchCode = 'Branch Code is required';
    // }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      setListView(false);
      try {
        let response;
        if(filters.fromDate && filters.toDate){
          response = await apiCalls(
            'get',
            `/taxInvoice/getReportDetailsForSalesRegister?branchCode=${filters.branch}&finyear=${finYear}&fromDate=${filters.fromDate}&orgId=${orgId}&partyCode=${filters.customerCode}&toDate=${filters.toDate}`
          );
        }else {
          response = await apiCalls(
            'get',
            `/taxInvoice/getReportDetailsForSalesRegister?branchCode=${filters.branch}&finyear=${finYear}&orgId=${orgId}&partyCode=${filters.customerCode}`
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
      // setFieldErrors(errors);
    }
  };
  return(
    <>
      <Card sx={{ padding: 1, boxShadow: 3 }}>
        <CardContent sx={{ padding: 1}}>
          <div>
            <h5>Select Criteria to Generate Report</h5>
          </div>
          <div className="row align-items-center mb-3">
            <div className="col-md-2">
              <FormControlLabel
                control={<Checkbox checked={criteria.date} onChange={handleCriteriaChange} name="date" />}
                label="Date"
              />
            </div>
            {criteria.date && (
              <>
                <div className="col-md-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="From Date"
                        value={filters.fromDate ? dayjs(filters.fromDate, 'YYYY-MM-DD', true) : null}
                        onChange={(date) => handleDateChange('fromDate', date)}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: { 
                            size: 'small', 
                            error: fieldErrors.fromDate, 
                            helperText: fieldErrors.fromDate 
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="To Date"
                        value={filters.toDate ? dayjs(filters.toDate, 'YYYY-MM-DD', true) : null}
                        onChange={(date) => handleDateChange('toDate', date)}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: { 
                            size: 'small', 
                            error: fieldErrors.toDate, 
                            helperText: fieldErrors.toDate 
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
              </>
            )}
          </div>

          {/* Customer Selection */}
          <div className="row align-items-center mb-3">
            <div className="col-md-2">
              <FormControlLabel
                control={<Checkbox checked={criteria.customer} onChange={handleCriteriaChange} name="customer" />}
                label="Customer"
              />
            </div>
            {criteria.customer && (
              <div className="col-md-3">
              <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customer}>
                <InputLabel id="customer-label">Customer</InputLabel>
                <Select
                  labelId="customer-label"
                  label="customer"
                  value={filters.customer}
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

          <div className="row align-items-center mb-3">
            <div className="col-md-2">
              <FormControlLabel
                control={<Checkbox checked={criteria.branch} onChange={handleCriteriaChange} name="branch" />}
                label="Branch"
              />
            </div>
            {criteria.branch && (
              <div className="col-md-3">
              <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branchCode}>
                <InputLabel id="branchCode-label">Branch Code</InputLabel>
                <Select
                  labelId="branchCode-label"
                  label="branchCode"
                  value={filters.branch}
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
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <Button 
          variant="contained" 
          onClick={handleGo} 
          sx={{ backgroundColor: "#34449b", color: "white", '&:hover': { backgroundColor: "#2a3a8b" } }}
        >
          📊 Generate Report
        </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleClear}
              // onClick={() => { 
              //   setCriteria({ date: false, customer: false, branch: false }); 
              //   setFilters({ fromDate: "", toDate: "", customer: "", branch: "" }); 
              // }}
            >
              ❌ Reset
            </Button>
          </div>
          {listView && (
          <div>
            <CommonReportTable data={rowData} columns={reportColumns} isListView={listView} />
          </div>
        )}
        </CardContent>
      </Card>
    </>

  )
}

export default TaxRegister;
