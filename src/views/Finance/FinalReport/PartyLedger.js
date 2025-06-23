import React from 'react';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import apiCalls from 'apicall';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import CommonFilePL from 'utils/CommonFilePL';
import CircularProgress from '@mui/material/CircularProgress';
import { AnimatePresence, motion } from 'framer-motion';

function PartyLedger() {
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orgId] = useState(localStorage.getItem('orgId'));
  const [partyNameList, setPartyNameList] = useState([]);
  const [partyTypeList, setPartyTypeList] = useState([]);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    branch: 'All',
    partyName: '',
    partyType: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branch: '',
    partyName: '',
    partyType: ''
  });
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branch: false,
    customer: false
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [field]: ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };
  useEffect(() => {
    getAllBranches();
    getAllPartyMasterByOrgId();
  }, []);
  useEffect(() => {
    if (formData.partyType) {
      getPartyName();
    }
  }, [formData.partyType]);
  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchCodeList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
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

  const getPartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=${formData.partyType}`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  //
  const handleClear = () => {
    setListView(false);

    setFormData({
      fromDate: null,
      toDate: null,
      branch: 'All',
      partyName: '',
      partyType: ''
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      partyName: '',
      partyType: '',
      branch: ''
    });
    setRowData([]);
  };

  //
  const handleGo = async () => {
    const errors = {};
    if (!formData.partyName) {
      errors.partyName = 'Party Name is required';
    }
    if (!formData.partyType) {
      errors.partyType = 'Party Type is required';
    }
    if (!formData.fromDate) {
      errors.fromDate = 'From Date is required';
    }
    if (!formData.toDate) {
      errors.toDate = 'To Date is required';
    }
    //
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const response = await apiCalls(
          'get',
          `/master/getAllPartyLedgerReport?branch=${formData.branch}&fromDate=${formData.fromDate}&orgId=${orgId}&partyName=${formData.partyName}&partyType=${formData.partyType}&toDate=${formData.toDate}`
        );
        setRowData(response.paramObjectsMap.partyMasterVO || []);
        setIsLoading(false);
        setListView(true);
      } catch (error) {
        console.error('Error fetching gate passes:', error);
        showToast('error', 'Report Fetch failed');
        setIsLoading(false);
      }
    }
  };

  const reportColumns = [
    { accessorKey: 'DocId', header: 'Doc No', size: 50 },
    { accessorKey: 'DocDate', header: 'Date', size: 50 },
    { accessorKey: 'RefNo', header: 'Reference No', size: 50 },
    { accessorKey: 'RefDate', header: 'Reference Date', size: 50 },
    // { accessorKey: 'SuppRefNo', header: 'Supplier Code', size: 30 },
    // { accessorKey: 'SuppRefName', header: 'Supplier Name', size: 70 },
    { accessorKey: 'Particulars', header: 'Particulars', size: 50 },
    // { accessorKey: 'Currency', header: 'Currency', size: 30 },
    {
      accessorKey: 'DbAmount',
      header: 'Debit',
      size: 50
    },
    {
      accessorKey: 'CrAmount',
      header: 'Credit',
      size: 50
    }
  ];
  return (
    <>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row mb-2">
          <div className="col-md-2 mb-1">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.customer} onChange={handleCheckboxChange} name="customer" color="secondary" />}
              label="Party Type"
            />
          </div>
          <div className="col-md-2 mb-1">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.branch} onChange={handleCheckboxChange} name="branch" color="secondary" />}
              label="Branch"
            />
          </div>
          {/*  */}
        </div>
        {/*  */}
        <div className="row">
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled" size="small">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  value={formData.fromDate ? dayjs(formData.fromDate, 'YYYY-MM-DD') : null}
                  onChange={(date) => handleDateChange('fromDate', date)}
                  slotProps={{
                    textField: { size: 'small', error: fieldErrors.fromDate, helperText: fieldErrors.fromDate }
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
                    textField: { size: 'small', error: fieldErrors.toDate, helperText: fieldErrors.toDate }
                  }}
                  format="DD-MM-YYYY"
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          {selectedSections.branch && (
            <div className="col-md-3 mb-3">
              <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branch}>
                <InputLabel id="branch-label">Branch</InputLabel>
                <Select labelId="branch-label" label="branch" value={formData.branch} onChange={handleInputChange} name="branch">
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
          {selectedSections.customer && (
            <>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partyType}>
                  <InputLabel id="partyType-label">Party Type</InputLabel>
                  <Select
                    labelId="partyType-label"
                    label="partyType"
                    value={formData.partyType}
                    onChange={handleInputChange}
                    name="partyType"
                  >
                    {partyTypeList?.map((row) => (
                      <MenuItem key={row.id} value={row.partyType}>
                        {row.partyType}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.partyType && <FormHelperText>{fieldErrors.partyType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-2">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partyName}>
                  <InputLabel id="partyName-label">Party Name</InputLabel>
                  <Select
                    labelId="partyName-label"
                    label="partyName"
                    value={formData.partyName}
                    onChange={handleInputChange}
                    name="partyName"
                  >
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
          <div className="col-md-3 mb-2">
            <div className="row d-flex ml">
              <div className="d-flex flex-wrap justify-content-start mb-4 mt-1" style={{ marginBottom: '20px' }}>
                <ActionButton title="Search" icon={SearchIcon} onClick={handleGo} />
                <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
              </div>
            </div>
          </div>
          {/*  */}
        </div>
        {/* {listView && (
          <div>
            <CommonReportTable
              // partyName={formData.partyName}
              data={rowData}
              columns={reportColumns}
              isListView={listView}
              fileName={'Party Ledger'}
              filters={formData}
            />
          </div>
        )} */}
        <AnimatePresence>
          {listView && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CommonFilePL data={rowData} columns={reportColumns} isListView={listView} fileName={'Party Ledger'} filters={formData} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* isloading */}
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px',
              width: '100%'
            }}
          >
            <CircularProgress size={40} />
          </div>
        )}
        {/*  */}
      </div>
    </>
  );
}
export default PartyLedger;
